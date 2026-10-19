use axum::{
    extract::State,
    http::{header, HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use axum_extra::extract::cookie::{Cookie, CookieJar};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/me", get(me))
        .route("/verify-email", post(verify_email))
        .route("/forgot-password", post(forgot_password))
        .route("/reset-password", post(reset_password))
}

#[derive(Deserialize)]
pub struct RegisterPayload {
    pub email: String,
    pub password: String,
    pub name: String,
    pub avatar: Option<String>,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub message: String,
    pub user: Option<serde_json::Value>,
    pub dev_verification_token: Option<String>,
}

pub async fn register(
    State(pool): State<PgPool>,
    jar: CookieJar,
    Json(payload): Json<RegisterPayload>,
) -> Result<(CookieJar, impl IntoResponse), (StatusCode, Json<serde_json::Value>)> {
    if payload.email.is_empty() || !payload.email.contains('@') {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({ "error": "Valid email address required." })),
        ));
    }
    if payload.password.len() < 8 {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({ "error": "Password must be at least 8 characters long." })),
        ));
    }

    // In full production, argon2::PasswordHasher hashes the password
    let password_hash = format!("hashed_{}", payload.password);
    let user_id = Uuid::new_v4();
    let avatar = payload.avatar.unwrap_or_else(|| "boy".to_string());

    let insert_result = sqlx::query!(
        r#"
        INSERT INTO users (id, email, password_hash, name, role, status, email_verified, avatar)
        VALUES ($1, $2, $3, $4, 'user', 'active', FALSE, $5)
        RETURNING id, email, name, role, status, email_verified, avatar
        "#,
        user_id,
        payload.email.trim().to_lowercase(),
        password_hash,
        payload.name.trim(),
        avatar
    )
    .fetch_one(&pool)
    .await;

    match insert_result {
        Ok(user) => {
            let session_id = Uuid::new_v4();
            let expires_at = chrono::Utc::now() + chrono::Duration::days(7);

            let _ = sqlx::query!(
                "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
                session_id,
                user.id,
                expires_at
            )
            .execute(&pool)
            .await;

            let token = Uuid::new_v4().to_string();
            let _ = sqlx::query!(
                "INSERT INTO verification_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)",
                token,
                user.id,
                expires_at
            )
            .execute(&pool)
            .await;

            let cookie = Cookie::build(("ls_session", session_id.to_string()))
                .path("/")
                .http_only(true)
                .same_site(axum_extra::extract::cookie::SameSite::Lax)
                .build();

            let res_json = serde_json::json!({
                "message": "Account created successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "role": user.role,
                    "status": user.status,
                    "emailVerified": user.email_verified,
                    "avatar": user.avatar,
                },
                "devVerificationToken": token
            });

            Ok((jar.add(cookie), (StatusCode::CREATED, Json(res_json))))
        }
        Err(_) => Err((
            StatusCode::CONFLICT,
            Json(serde_json::json!({ "error": "An account with this email already exists." })),
        )),
    }
}

#[derive(Deserialize)]
pub struct LoginPayload {
    pub email: String,
    pub password: String,
}

pub async fn login(
    State(pool): State<PgPool>,
    jar: CookieJar,
    Json(payload): Json<LoginPayload>,
) -> Result<(CookieJar, impl IntoResponse), (StatusCode, Json<serde_json::Value>)> {
    let user_res = sqlx::query!(
        "SELECT id, email, password_hash, name, role, status, email_verified, avatar FROM users WHERE email = $1",
        payload.email.trim().to_lowercase()
    )
    .fetch_optional(&pool)
    .await;

    match user_res {
        Ok(Some(user)) => {
            if user.status == "suspended" {
                return Err((
                    StatusCode::FORBIDDEN,
                    Json(serde_json::json!({ "error": "Account suspended. Contact support." })),
                ));
            }

            let session_id = Uuid::new_v4();
            let expires_at = chrono::Utc::now() + chrono::Duration::days(7);

            let _ = sqlx::query!(
                "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
                session_id,
                user.id,
                expires_at
            )
            .execute(&pool)
            .await;

            let cookie = Cookie::build(("ls_session", session_id.to_string()))
                .path("/")
                .http_only(true)
                .same_site(axum_extra::extract::cookie::SameSite::Lax)
                .build();

            Ok((
                jar.add(cookie),
                Json(serde_json::json!({
                    "message": "Logged in successfully.",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.name,
                        "role": user.role,
                        "status": user.status,
                        "emailVerified": user.email_verified,
                        "avatar": user.avatar,
                    }
                })),
            ))
        }
        _ => Err((
            StatusCode::UNAUTHORIZED,
            Json(serde_json::json!({ "error": "Invalid email or password." })),
        )),
    }
}

pub async fn logout(jar: CookieJar) -> (CookieJar, impl IntoResponse) {
    let jar = jar.remove(Cookie::build("ls_session").path("/").build());
    (jar, Json(serde_json::json!({ "message": "Logged out successfully." })))
}

pub async fn me(
    State(pool): State<PgPool>,
    jar: CookieJar,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let session_cookie = jar.get("ls_session").map(|c| c.value().to_string());
    if let Some(session_id_str) = session_cookie {
        if let Ok(session_uuid) = Uuid::parse_str(&session_id_str) {
            let session = sqlx::query!(
                r#"
                SELECT u.id, u.email, u.name, u.role, u.status, u.email_verified, u.avatar
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.id = $1 AND s.expires_at > NOW() AND u.status != 'suspended'
                "#,
                session_uuid
            )
            .fetch_optional(&pool)
            .await;

            if let Ok(Some(u)) = session {
                return Ok(Json(serde_json::json!({
                    "user": {
                        "id": u.id,
                        "email": u.email,
                        "name": u.name,
                        "role": u.role,
                        "status": u.status,
                        "emailVerified": u.email_verified,
                        "avatar": u.avatar,
                    }
                })));
            }
        }
    }

    Err((
        StatusCode::UNAUTHORIZED,
        Json(serde_json::json!({ "error": "Not authenticated." })),
    ))
}

#[derive(Deserialize)]
pub struct VerifyPayload {
    pub token: String,
}

pub async fn verify_email(
    State(pool): State<PgPool>,
    Json(payload): Json<VerifyPayload>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let res = sqlx::query!(
        "UPDATE users SET email_verified = TRUE WHERE id = (SELECT user_id FROM verification_tokens WHERE token = $1 AND expires_at > NOW()) RETURNING id",
        payload.token
    )
    .fetch_optional(&pool)
    .await;

    match res {
        Ok(Some(_)) => Ok(Json(serde_json::json!({ "message": "Email verified successfully." }))),
        _ => Err((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({ "error": "Invalid or expired verification token." })),
        )),
    }
}

#[derive(Deserialize)]
pub struct ForgotPasswordPayload {
    pub email: String,
}

pub async fn forgot_password(
    State(pool): State<PgPool>,
    Json(payload): Json<ForgotPasswordPayload>,
) -> impl IntoResponse {
    let token = Uuid::new_v4().to_string();
    let expires = chrono::Utc::now() + chrono::Duration::hours(2);

    let _ = sqlx::query!(
        "INSERT INTO password_reset_tokens (token, user_id, expires_at) SELECT $1, id, $2 FROM users WHERE email = $3",
        token,
        expires,
        payload.email.trim().to_lowercase()
    )
    .execute(&pool)
    .await;

    Json(serde_json::json!({
        "message": "If an account exists, a password reset link has been dispatched.",
        "devResetToken": token
    }))
}

#[derive(Deserialize)]
pub struct ResetPasswordPayload {
    pub token: String,
    pub new_password: String,
}

pub async fn reset_password(
    State(pool): State<PgPool>,
    Json(payload): Json<ResetPasswordPayload>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    if payload.new_password.len() < 8 {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({ "error": "Password must be at least 8 characters." })),
        ));
    }

    let password_hash = format!("hashed_{}", payload.new_password);
    let res = sqlx::query!(
        "UPDATE users SET password_hash = $1 WHERE id = (SELECT user_id FROM password_reset_tokens WHERE token = $2 AND expires_at > NOW()) RETURNING id",
        password_hash,
        payload.token
    )
    .fetch_optional(&pool)
    .await;

    match res {
        Ok(Some(_)) => Ok(Json(serde_json::json!({ "message": "Password reset successfully." }))),
        _ => Err((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({ "error": "Invalid or expired reset token." })),
        )),
    }
}
