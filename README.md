# Task Management App

A full-stack To-Do List application with a React + Vite frontend and an Express + MongoDB backend.

## What it does

- Create, edit, complete, and delete tasks
- Support optional due date and category fields
- Validate task data on both frontend and backend
- Secure task operations with authentication middleware

## Project structure

- `backend/`
  - `src/`
    - `app.js` — Express app setup and middleware registration
    - `server.js` — application start point
    - `controllers/` — task route handlers
    - `middleware/` — auth, validation, and error handling
    - `models/` — Mongoose task schema
    - `routes/` — task API routes
    - `validators/` — Zod validation schemas
    - `lib/` — shared helpers and environment config
- `frontend/`
  - `src/` — React UI source files
  - `components/` — reusable UI components for task creation, list display, and editing
  - `App.jsx` — root state management and page composition

## Key decisions

- Built as a split frontend/backend repository so UI and API can be developed and run independently.
- React + Vite powers a fast, modern frontend experience with local state for task workflows.
- Express + MongoDB is used in the backend for a flexible task data model and simple CRUD API.
- Authentication middleware is placed centrally so protected task routes are always guarded.

## Setup

### Backend

1. Open a terminal in `backend/`
2. Copy `.env.example` to `.env`
3. Update the environment values, especially `MONGODB_URI` and Clerk credentials
4. Install dependencies:

```bash
cd backend
npm install
```

5. Run the server:

```bash
npm run dev
```

By default, the backend listens on `http://localhost:5000`.

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the development server:

```bash
node server.js
```

4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Usage

- Use the frontend UI to add new tasks with title, description and due date.
- Edit tasks using the provided modal workflow.
- Mark tasks as complete and delete tasks as needed.
- The backend API exposes task management endpoints under `/api/tasks`.

## Backend API endpoints

- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId/complete`
- `DELETE /api/tasks/:taskId`
