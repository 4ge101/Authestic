use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/activities", get(get_activities))
        .route("/item/:id", get(get_item))
        .route("/track", post(track_interaction))
}

#[derive(Deserialize)]
pub struct ContentQuery {
    pub category: Option<String>,
    pub r#type: Option<String>,
}

pub async fn get_activities(
    State(pool): State<PgPool>,
    Query(query): Query<ContentQuery>,
) -> Result<impl IntoResponse, StatusCode> {
    let items = sqlx::query!(
        "SELECT id, type, title, description, category, category_name, age_range, difficulty, duration, status, order_index, details FROM content_items WHERE status = 'published' ORDER BY order_index ASC"
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let filtered: Vec<_> = items
        .into_iter()
        .filter(|item| {
            if let Some(ref cat) = query.category {
                if !item.category.eq_ignore_ascii_case(cat) {
                    return false;
                }
            }
            if let Some(ref t) = query.r#type {
                if !item.r#type.eq_ignore_ascii_case(t) {
                    return false;
                }
            }
            true
        })
        .map(|i| {
            serde_json::json!({
                "id": i.id,
                "type": i.r#type,
                "title": i.title,
                "description": i.description,
                "category": i.category,
                "categoryName": i.category_name,
                "ageRange": i.age_range,
                "difficulty": i.difficulty,
                "duration": i.duration,
                "status": i.status,
                "orderIndex": i.order_index,
                "details": i.details
            })
        })
        .collect();

    Ok(Json(filtered))
}

pub async fn get_item(
    State(pool): State<PgPool>,
    Path(id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let item = sqlx::query!(
        "SELECT id, type, title, description, category, category_name, age_range, difficulty, duration, status, order_index, details FROM content_items WHERE id = $1 AND status = 'published'",
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": "Database query failed." }))))?;

    match item {
        Some(i) => Ok(Json(serde_json::json!({
            "id": i.id,
            "type": i.r#type,
            "title": i.title,
            "description": i.description,
            "category": i.category,
            "categoryName": i.category_name,
            "ageRange": i.age_range,
            "difficulty": i.difficulty,
            "duration": i.duration,
            "status": i.status,
            "orderIndex": i.order_index,
            "details": i.details
        }))),
        None => Err((
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({ "error": "Content item not found." })),
        )),
    }
}

#[derive(Deserialize)]
pub struct TrackPayload {
    pub content_id: String,
    pub content_type: String,
    pub interaction_type: Option<String>,
}

pub async fn track_interaction(
    State(pool): State<PgPool>,
    Json(payload): Json<TrackPayload>,
) -> impl IntoResponse {
    let interaction_id = Uuid::new_v4();
    let itype = payload.interaction_type.unwrap_or_else(|| "view".to_string());

    let _ = sqlx::query!(
        "INSERT INTO content_interactions (id, content_id, content_type, interaction_type) VALUES ($1, $2, $3, $4)",
        interaction_id,
        payload.content_id,
        payload.content_type,
        itype
    )
    .execute(&pool)
    .await;

    Json(serde_json::json!({ "success": true, "id": interaction_id }))
}
