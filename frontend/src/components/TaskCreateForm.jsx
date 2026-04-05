import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function TaskCreateForm({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  refreshTasks,
  isAuthenticated = false,
}) {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      window.alert("You must be signed in to create a task.");
      return;
    }
    if (!title) {
      window.alert("Please enter a title for the task.");
      return;
    }
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const token = await getToken();

      await axios.post(
        `${API_URL}/tasks`,
        {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
        },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      await refreshTasks?.();
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mb-14">
      <div
        className="rounded-2xl p-7 shadow-sm"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-slate-600 text-black"
            style={{ caretColor: "#4d44e3" }}
          />

          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.06), transparent)",
            }}
          />

          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-grow">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-600">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some context..."
                rows={2}
                className="w-full resize-none rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2"
              />
            </div>

            <div className="w-full md:w-56">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #4d44e3, #4034d7)",
                boxShadow: "0 4px 18px rgba(77,68,227,0.25)",
              }}
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TaskCreateForm;
