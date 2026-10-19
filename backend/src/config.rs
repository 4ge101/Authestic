use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub database_url: String,
    pub server_port: u16,
    pub session_secret: String,
    pub app_url: String,
    pub admin_url: String,
    pub environment: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/eshal".to_string()),
            server_port: env::var("PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(8080),
            session_secret: env::var("SESSION_SECRET")
                .unwrap_or_else(|_| "eshal-dev-secret-change-in-production-min-32-chars".to_string()),
            app_url: env::var("APP_URL")
                .unwrap_or_else(|_| "http://localhost:3000".to_string()),
            admin_url: env::var("ADMIN_URL")
                .unwrap_or_else(|_| "http://localhost:3000/admin".to_string()),
            environment: env::var("ENVIRONMENT")
                .unwrap_or_else(|_| "development".to_string()),
        }
    }
}
