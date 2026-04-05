# Task Management Frontend

This frontend is a React + Vite + Tailwind CSS implementation of the task management UI based on the provided "Today&apos;s Focus" design references. It uses reusable components and local React state to demonstrate the full task workflow visually and interactively.

## Features

- Create a task with title, description, due date, category, and priority
- View active and completed tasks in a styled workflow list
- Mark tasks as completed with guard logic for already-complete items
- Edit task details in a glass-style modal
- Delete tasks from the workflow
- Validate empty titles and overly long descriptions
- Show contextual success, info, and error feedback

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Code Structure

- `src/App.jsx`: state management, task actions, validation, and screen composition
- `src/components/TopNav.jsx`: header/navigation shell
- `src/components/HeroSection.jsx`: page intro and editorial heading
- `src/components/TaskComposer.jsx`: create-task form wrapper
- `src/components/TaskFormFields.jsx`: shared fields used by create and edit flows
- `src/components/TaskList.jsx`: active/completed list rendering
- `src/components/TaskCard.jsx`: reusable task item card
- `src/components/EditTaskModal.jsx`: edit/delete modal flow
- `src/components/StatsPanel.jsx`: bottom summary cards
- `src/components/FloatingDock.jsx`: bottom floating navigation pill
- `src/components/FeedbackBanner.jsx`: transient inline status messaging
- `src/components/Icons.jsx`: lightweight reusable SVG icons

## Key Decisions

- The UI follows the reference system by relying on tonal layering and glass panels instead of heavy borders and dense dashboard chrome.
- Task fields are shared between create and edit flows to keep behavior consistent and reduce duplication.
- Validation is handled in the UI layer so the frontend already reflects the project requirements before backend integration.
- Due date and category were included because they align with the reference and cover the optional bonus fields.

## Notes

- This frontend currently uses in-memory state for interaction demos.
- It is structured to connect cleanly to a backend API later for real persistence with MySQL or MongoDB.
