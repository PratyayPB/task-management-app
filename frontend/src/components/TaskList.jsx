import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import EditTaskModal from "./EditTaskModal";
import { CheckIcon, EditIcon, TrashIcon, CalIcon, SortIcon } from "./Icons";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TaskList = ({
  tasks = [],
  setTasks,
  pendingCount = 0,
  isLoading = false,
  isAuthenticated = false,
  refreshTasks,
}) => {
  const { getToken } = useAuth();
  const [editingTask, setEditingTask] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  function getSortedTasks() {
    const tasksCopy = [...tasks];
    return tasksCopy.sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }

  const sortedTasks = getSortedTasks();

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
    } catch {
      console.error("Failed to toggle task:");
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
    } catch {
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
    } catch {
      console.error("Failed to update task:");
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-slate-100"
            style={{ color: "#4d44e3" }}
            title={`Sort by date (Current: ${sortOrder === "asc" ? "Earliest first" : "Latest first"})`}
          >
            <SortIcon direction={sortOrder} />
            <span className="hidden sm:inline">
              {sortOrder === "asc" ? "Oldest" : "Latest"}
            </span>
          </button>
          <span
            className="mono text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: "rgba(77,68,227,0.08)", color: "#4d44e3" }}
          >
            {pendingCount} pending
          </span>
        </div>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={closeEditModal}
        />
      )}
      <div className="space-y-2.5">
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
          sortedTasks.map((task) => (
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

        {!isLoading && tasks.length === 0 && (
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
