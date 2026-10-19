# Eshal Rust Backend & PostgreSQL Architecture

Eshal uses a modular monolith backend built with **Rust**, **Tokio**, **Axum**, and **SQLx** for PostgreSQL.

## Architecture

```
backend/
├── Cargo.toml                  # Rust dependencies (Axum, Tokio, SQLx, Argon2, Serde)
├── migrations/
│   └── 0001_initial_schema.sql # PostgreSQL schema migrations
├── src/
│   ├── main.rs                 # Server entrypoint and route mounting
│   ├── config.rs               # Environment & database configuration
│   ├── db.rs                   # SQLx connection pool & migrations runner
│   ├── auth.rs                 # Registration, login, sessions, password reset
│   ├── admin.rs                # Admin overview, analytics queries, user management
│   ├── content.rs              # Educational content & interaction tracking
│   └── progress.rs             # Daily goals and completion records
└── README.md
```

## Running the Rust Backend

### Prerequisites
- Rust 1.80+ (`rustup toolchain install stable`)
- PostgreSQL 15+ (`createdb eshal`)

### Configuration
Set the following environment variables in your `.env`:
```bash
DATABASE_URL="postgres://postgres:postgres@localhost:5432/eshal"
PORT=8080
SESSION_SECRET="eshal-production-secret-min-32-chars"
APP_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3000/admin"
```

### Run Migrations & Start
```bash
cd backend
cargo run --release
```

The server binds to `0.0.0.0:8080` (or the configured `PORT`).
