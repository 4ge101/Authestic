# Eshal - Autism Support & Learning Platform

Eshal is an accessible, sensory-friendly autism-support and learning platform with a child-friendly interface, organic layouts, illustrated activities, social stories, games, AAC communication tools, life skills routines, sensory breaks, and dedicated caregiver tools.

## Quick Start on Localhost

The app uses an integrated full-stack architecture where **a single command boots both the Express backend API and the React/Vite frontend**:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
```bash
npm run dev
```

Open your browser to:
**[http://localhost:3000](http://localhost:3000)**

Both the **Backend API** (authentication, sessions, content, admin APIs under `/api/*`) and the **React Frontend** run together on port `3000`.

### How to resolve it:
Always use:
```bash
npm run dev
```
This runs `frontend/server.ts`, which starts Express on port `3000`, initializes the database, mounts the `/api/*` endpoints, and mounts the Vite frontend into the same server.

---

## Running Backend and Frontend Separately (Optional)

If you prefer to run the backend and frontend in separate terminals:

### Terminal 1: Backend Server (Port 3000)
```bash
npm run server
```
This boots the Express backend API on `http://localhost:3000`.

### Terminal 2: Frontend Client (Port 5173 with API Proxy)
```bash
npm run client
```
This runs Vite on `http://localhost:5173`, automatically proxying `/api` requests to `http://localhost:3000`.

---

## Default Administrative Credentials

- **Admin Email**: `admin@eshal.org`
- **Admin Password**: `AdminPassword123!`

---

## Features

- **Authentication & RBAC**: Real authentication with sessions, password hashing (`bcryptjs`), password recovery, email verification, and role-based protection (`user`, `support`, `admin`).
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