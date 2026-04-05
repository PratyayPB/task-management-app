import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import EditTaskModal from "./EditTaskModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function CheckIcon({ checked }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={checked ? 2.5 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      {checked ? (
        <polyline points="20 6 9 17 4 12" />
      ) : (
        <circle cx="12" cy="12" r="9" />
      )}
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3 h-3"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

const TaskList = ({
  tasks = [],
  setTasks,
  pendingCount = 0,
  isLoading = false,
  loadError = "",
  isAuthenticated = false,
  refreshTasks,
}) => {
  const { getToken } = useAuth();
  const [editingTask, setEditingTask] = useState(null);

  async function toggleTask(id) {
    console.log("Toggling task with ID:", id);
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t)),
    );

    try {
      const token = await getToken();
      await axios.patch(
        `${API_URL}/tasks/${id}`,
        { isCompleted: nextCompleted },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: task.completed } : t,
        ),
      );
      refreshTasks?.();
    }
  }

  async function deleteTask(id) {
    if (typeof setTasks !== "function") return;

    const removedTask = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      if (removedTask) {
        setTasks((prev) => [...prev, removedTask]);
      }
      refreshTasks?.();
    }
  }

  function openEditModal(task) {
    setEditingTask(task);
  }

  async function handleSaveTask(updatedTask) {
    if (!updatedTask || typeof setTasks !== "function") return;

    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
    );

    try {
      const token = await getToken();
      await axios.patch(
        `${API_URL}/tasks/${updatedTask.id}`,
        {
          title: updatedTask.title,
          description: updatedTask.description,
          dueDate: updatedTask.dueDate,
          isCompleted: updatedTask.completed,
        },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      refreshTasks?.();
    } finally {
      setEditingTask(null);
    }
  }

  function closeEditModal() {
    setEditingTask(null);
  }

  function renderSignInMessage() {
    return (
      <div className="lg:col-span-8 space-y-3">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">Active Tasks</h3>
          <span
            className="mono text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: "rgba(77,68,227,0.08)", color: "#4d44e3" }}
          >
            {pendingCount} pending
          </span>
        </div>

        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px dashed rgba(0,0,0,0.1)",
          }}
        >
          <p className="text-sm font-medium text-slate-400">
            Sign in to Display Tasks
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return renderSignInMessage();
  }

  return (
    <div className="lg:col-span-8 space-y-3">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900">Active Tasks</h3>
        <span
          className="mono text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: "rgba(77,68,227,0.08)", color: "#4d44e3" }}
        >
          {pendingCount} pending
        </span>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={closeEditModal}
        />
      )}
      <div className="space-y-2.5">
        {loadError && (
          <div
            className="rounded-2xl px-5 py-4 text-sm font-medium text-rose-500"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(244,63,94,0.15)",
            }}
          >
            {loadError}
          </div>
        )}

        {isLoading && (
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px dashed rgba(0,0,0,0.1)",
            }}
          >
            <p className="text-slate-400 text-sm font-medium">
              Loading tasks...
            </p>
          </div>
        )}

        {!isLoading &&
          tasks.map((task) => (
            <article
              key={task.id}
              className={`task-card group rounded-2xl p-5 flex items-start gap-4 ${
                task.completed ? "opacity-50" : "hover:shadow-md"
              }`}
              style={{
                background: task.completed
                  ? "rgba(241,245,249,0.7)"
                  : "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: task.completed
                  ? "none"
                  : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`checkbox-btn mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  task.completed
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-slate-200 text-slate-300 hover:border-violet-400 hover:text-violet-400"
                }`}
              >
                <CheckIcon checked={task.completed} />
              </button>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <h4
                  className={`text-base font-semibold mb-0.5 truncate transition-colors ${
                    task.completed
                      ? "line-through text-slate-400"
                      : "text-slate-900 group-hover:text-violet-700"
                  }`}
                >
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-slate-400 text-sm truncate">
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <CalIcon />
                    <span className="mono text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      {task.dueDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div
                className={`flex gap-1 shrink-0 ${task.completed ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
              >
                {!task.completed && (
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 text-slate-300 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-all"
                  >
                    <EditIcon />
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <TrashIcon />
                </button>
              </div>
            </article>
          ))}

        {!isLoading && tasks.length === 0 && !loadError && (
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px dashed rgba(0,0,0,0.1)",
            }}
          >
            <p className="text-slate-300 text-sm font-medium">
              No tasks yet. Create one above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
