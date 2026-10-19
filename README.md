# Eshal - Autism Support & Learning Platform

Eshal is an accessible, sensory-friendly autism-support and learning platform with a child-friendly interface, organic layouts, illustrated activities, social stories, games, AAC communication tools, life skills routines, sensory breaks, and dedicated caregiver tools.

## System Architecture

```
/
├── backend/                    # Production Rust Modular Monolith Backend
│   ├── Cargo.toml              # Tokio, Axum, SQLx, Argon2, Serde
│   ├── migrations/             # PostgreSQL schema migrations
│   │   └── 0001_initial_schema.sql
│   ├── src/
│   │   ├── main.rs             # Axum entry point and route dispatch
│   │   ├── config.rs           # Environment configuration
│   │   ├── db.rs               # SQLx PostgreSQL pool & migrations
│   │   ├── auth.rs             # Authentication & session verification
│   │   ├── admin.rs            # Admin overview & data analytics
│   │   ├── content.rs          # Activities, stories, interaction tracking
│   │   └── progress.rs         # Daily goals and completion records
│   └── README.md
│
├── frontend/                   # React + TypeScript Frontend Application
│   ├── src/                    # Components, pages, context, and styles
│   ├── package.json            # Vite, React, Tailwind CSS
│   ├── index.html              # Eshal HTML entrypoint
│   └── server.ts               # Full-stack API & Vite middleware runner
│
├── metadata.json
└── README.md
```

## Features

- **Authentication & RBAC**: Real authentication with sessions, password hashing, password recovery, email verification, and role-based protection (`user`, `support`, `admin`).
- **Admin Dashboard**:
  - **Overview**: Real-time stats, user accounts, and audit log.
  - **Data Analytics**:
    - **User Growth Line Chart** with interactive tooltips and 7d / 30d / 90d / 365d filters.
    - **Account Distribution Donut Chart** segmented by active system roles.
    - **Content Performance Bar Chart** tracking interactions across games, stories, AAC, life skills, sensory, and caregiver guides.
    - **Platform Activity Area Chart** monitoring daily/weekly activity.
    - **Summary Cards**: Total registered users, new users this month, stories and games count, activity sessions, and most-used content.
- **Child-Friendly Learning**:
  - Interactive social stories with calming pagination.
  - Interactive tactile puzzles and matching games.
  - AAC visual communication board.
  - Visual daily routines and life skills checklist.
  - Breathing bubble sensory breaks.

## Default Administrative Credentials

- **Admin Email**: `admin@eshal.org`
- **Admin Password**: `AdminPassword123!`