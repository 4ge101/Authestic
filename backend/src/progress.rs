use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post, put},
    Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/goals", get(get_goals))
        .route("/goals/:id", put(toggle_goal))
        .route("/complete/:activity_id", post(complete_activity))
}

pub async fn get_goals(State(pool): State<PgPool>) -> Result<impl IntoResponse, StatusCode> {
    let goals = sqlx::query!(
        "SELECT id, title, category, target_count, completed_count, completed FROM daily_goals LIMIT 20"
    )
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    let list: Vec<_> = goals
        .into_iter()
        .map(|g| {
            serde_json::json!({
                "id": g.id,
                "title": g.title,
                "category": g.category,
                "targetCount": g.target_count,
                "completedCount": g.completed_count,
                "completed": g.completed
            })
        })
        .collect();

    Ok(Json(list))
}

#[derive(Deserialize)]
pub struct ToggleGoalPayload {
    pub completed: Option<bool>,
}

pub async fn toggle_goal(
    State(pool): State<PgPool>,
    Path(id): Path<String>,
    Json(payload): Json<ToggleGoalPayload>,
) -> Result<impl IntoResponse, StatusCode> {
    let completed = payload.completed.unwrap_or(true);
    let _ = sqlx::query!(
        "UPDATE daily_goals SET completed = $1 WHERE id = $2",
        completed,
        id
    )
    .execute(&pool)
    .await;

    Ok(Json(serde_json::json!({ "id": id, "completed": completed })))
}

#[derive(Deserialize)]
pub struct CompleteActivityPayload {
    pub steps: Option<i32>,
    pub percent: Option<i32>,
}

pub async fn complete_activity(
    Path(activity_id): Path<String>,
    Json(_payload): Json<CompleteActivityPayload>,
) -> impl IntoResponse {
    Json(serde_json::json!({
        "success": true,
        "progress": {
            "activityId": activity_id,
            "completed": true,
            "progressPercent": 100
        }
    }))
}
