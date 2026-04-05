# Task Manager Backend

This project is a MERN-style backend for a task management application. It uses Express for the API layer, MongoDB with Mongoose for persistence, and Clerk for authentication and authorization.

## Features

- Create tasks with a title and description.
- View all tasks for the authenticated user.
- Edit task details.
- Mark tasks as completed.
- Prevent duplicate completion updates.
- Delete tasks.
- Persist tasks in MongoDB.
- Validate incoming data with meaningful error messages.
- Support optional due dates and categories.
- Include automated API tests.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Clerk Auth
- Zod
- Jest + Supertest

## Project Structure

```text
src/
  app.js                  Express app setup
  server.js               Startup entrypoint
  controllers/            Route handlers
  lib/                    Shared helpers and configuration
  middleware/             Auth, validation, and error middleware
  models/                 Mongoose schemas
  routes/                 API route definitions
  validators/             Zod validation schemas
tests/
  tasks.test.js           API tests for task workflows
```

## Prerequisites

- Node.js 20.9 or later
- MongoDB running locally or a MongoDB Atlas connection string
- A Clerk application with API keys

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_SIGN_IN_URL=/sign-in
```

## Installation

```bash
npm install
```

## Running The Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will start on `http://localhost:5000` by default.

## Authentication With Clerk

Clerk middleware is registered at the application level. Protected task routes require an authenticated user, and each task is scoped to the Clerk `userId` that created it.

In a frontend app, send Clerk session credentials or bearer tokens with requests to the backend. Public routes such as `/api/health` remain accessible without authentication.

## API Endpoints

### Health Check

- `GET /api/health`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId/complete`
- `DELETE /api/tasks/:taskId`

### Create Task Payload

```json
{
  "title": "Build task API",
  "description": "Finish controllers and routes",
  "dueDate": "2026-04-10T00:00:00.000Z",
  "category": "Work"
}
```

### Update Task Payload

```json
{
  "title": "Build and document task API",
  "description": "Add README usage steps"
}
```

## Validation And Error Handling

- Task titles cannot be empty.
- Invalid task IDs return a `400` response.
- Trying to complete an already completed task returns `409`.
- Routes for missing resources return `404`.
- Validation errors return `400` with specific details in the response body.

## Tests

Run the test suite with:

```bash
npm test
```

The automated tests use an in-memory MongoDB instance and a test-only auth header instead of real Clerk credentials.

## Key Decisions

- MongoDB was chosen to keep the task model flexible while staying consistent with a MERN stack workflow.
- Clerk is applied centrally through middleware, while protected task routes use a focused authorization guard.
- Zod handles request validation before controller logic runs, and Mongoose adds a second layer of schema validation at the database level.
- Tasks are filtered by the authenticated Clerk user so each user only sees and manages their own data.
- Due dates and categories were added as part of the optional bonus requirements.
