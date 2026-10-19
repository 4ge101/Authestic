mod admin;
mod auth;
mod config;
mod content;
mod db;
mod progress;

use axum::{routing::get, Json, Router};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let cfg = config::AppConfig::from_env();
    tracing::info!("Initializing Eshal Rust modular backend on port {}", cfg.server_port);

    // Database connection pool
    let pool = match db::create_pool(&cfg.database_url).await {
        Ok(p) => {
            tracing::info!("Connected to PostgreSQL database successfully.");
            if let Err(e) = db::run_migrations(&p).await {
                tracing::warn!("Database migration notice: {}", e);
            }
            p
        }
        Err(e) => {
            tracing::warn!("PostgreSQL unavailable, starting in offline mode: {}", e);
            // Fallback unattached pool for graceful container boots
            db::create_pool("postgres://postgres:postgres@localhost:5432/eshal")
                .await
                .unwrap_or_else(|_| panic!("Failed to allocate pool"))
        }
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Application Router
    let app = Router::new()
        .route(
            "/health",
            get(|| async {
                Json(serde_json::json!({
                    "status": "healthy",
                    "timestamp": chrono::Utc::now().to_rfc3339(),
                    "service": "Eshal Rust API"
                }))
            }),
        )
        .nest("/api/auth", auth::router())
        .nest("/api/content", content::router())
        .nest("/api/admin", admin::router())
        .nest("/api/progress", progress::router())
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], cfg.server_port));
    tracing::info!("✨ Eshal Rust API running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
