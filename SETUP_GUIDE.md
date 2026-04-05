# Task Manager - Authentication & API Integration Setup Guide

This guide will help you set up Clerk authentication and integrate the frontend with the backend APIs.

## Prerequisites

- Node.js (v20+)
- MongoDB running locally or a MongoDB Atlas connection string
- A Clerk account (free at https://clerk.com)

## Step 1: Set Up Clerk

### 1.1 Create a Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Choose "Email address" as your sign-in method
4. Get your API keys:
   - **Publishable Key**: Starts with `pk_test_` or `pk_live_`
   - **Secret Key**: Starts with `sk_test_` or `sk_live_`

### 1.2 Configure Clerk Settings

In Clerk Dashboard:

1. Go to **Settings** > **URLs**
2. Add your frontend URL to **Allowed redirect URLs**: `http://localhost:3000`
3. Go to **Settings** > **Webhooks** (optional, for syncing user data)

## Step 2: Configure Backend Environment

### 2.1 Update Backend .env

Navigate to the `backend` folder and update `.env` with your settings:

```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_SIGN_IN_URL=/sign-in
```

**Note**: Replace `pk_test_*` and `sk_test_*` with your actual Clerk keys.

### 2.2 Install Backend Dependencies

```bash
cd backend
npm install
```

### 2.3 Start Backend Server

```bash
npm run dev
```

The backend should now be running on `http://localhost:5000`

## Step 3: Configure Frontend Environment

### 3.1 Update Frontend .env.local

Navigate to the `frontend` folder and update `.env.local`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:5000/api
```

**Note**: Replace `pk_test_*` with your actual Clerk publishable key (same key from Clerk Dashboard).

### 3.2 Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3.3 Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## Step 4: Test the Application

### 4.1 Sign Up

1. Open `http://localhost:3000` in your browser
2. Click "Sign up" and create an account
3. Verify your email using the link sent to your inbox
4. You'll be redirected to the dashboard

### 4.2 Sign In

1. Go to `http://localhost:3000/sign-in`
2. Enter your email and password
3. You'll be logged in and see the task dashboard

### 4.3 Create a Task

1. On the dashboard, fill in the task form
2. Click "Add to Workflow"
3. The task will be created and appear in your task list
4. Changes are persisted to the MongoDB database

### 4.4 Manage Tasks

- **Complete a task**: Click the checkmark icon
- **Edit a task**: Click the edit icon
- **Delete a task**: Click the delete icon
- **Log out**: Click the user avatar in the top right

## API Endpoints

All endpoints require authentication (Clerk token in Authorization header).

### Task Endpoints

- `GET /api/tasks` - Get all tasks for the current user
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:taskId` - Update a task
- `PATCH /api/tasks/:taskId/complete` - Mark a task as completed
- `DELETE /api/tasks/:taskId` - Delete a task

### Example Request

```javascript
const token = await getToken(); // From @clerk/react useAuth hook

const response = await fetch("http://localhost:5000/api/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "My Task",
    description: "Task description",
    dueDate: "2026-04-15",
    category: "Development",
    priority: "High",
  }),
});
```

## Frontend Architecture

### Components

- **SignInPage**: Custom login form with Clerk
- **SignUpPage**: Custom registration with email verification
- **DashboardPage**: Main task management interface
- **ProtectedRoute**: Route wrapper to ensure authentication
- **TopNav**: Navigation with user profile and logout

### API Integration

The `src/utils/api.js` file provides utility functions for all backend requests:

```javascript
import {
  fetchTasks,
  createTask,
  updateTask,
  markTaskComplete,
  deleteTask,
} from "./utils/api";

// Usage example
const token = await getToken();
const tasks = await fetchTasks(token);
```

## Troubleshooting

### "Publishable Key not found"

- Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set in `frontend/.env.local`
- Make sure it starts with `pk_`
- Restart the frontend dev server after updating .env.local

### "CORS error" when creating tasks

- Check that `CLIENT_URL` and `ALLOWED_ORIGINS` in backend `.env` match your frontend URL
- Ensure the backend is running on port 5000

### "Authentication failed"

- Verify Clerk keys are correct in both backend and frontend
- Check that the Clerk account is active
- Clear browser cookies and try again

### "MongoDB connection failed"

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in backend `.env`
- For MongoDB Atlas, verify your IP is in the whitelist

## Project Structure

```
backend/
├── src/
│   ├── app.js           # Express app setup with Clerk
│   ├── server.js        # Server entry point
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── validators/      # Zod validation schemas
├── .env                 # Environment variables
└── package.json

frontend/
├── src/
│   ├── App.jsx         # Main routing component
│   ├── main.jsx        # Clerk provider setup
│   ├── pages/          # Page components (SignIn, SignUp, Dashboard)
│   ├── components/     # Reusable UI components
│   ├── routes/         # Route protection
│   └── utils/          # API client utilities
├── .env.local          # Frontend environment variables
└── package.json
```

## Next Steps

1. Deploy to production using services like:
   - **Frontend**: Vercel, Netlify, or GitHub Pages
   - **Backend**: Railway, Render, or Heroku
   - **Database**: MongoDB Atlas

2. Update environment variables for production Clerk keys

3. Update `CLIENT_URL` and `ALLOWED_ORIGINS` for production domains

## Support

- Clerk Documentation: https://clerk.com/docs
- Express.js Guide: https://expressjs.com
- React Documentation: https://react.dev
- MongoDB Guide: https://docs.mongodb.com
