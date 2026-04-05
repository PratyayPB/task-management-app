import { useState } from "react";

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <polyline points="20 6 9 17 4 12" />
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
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ── Blurred background tasks ─────────────────────────────────────────────────

function BackgroundShell() {
  return (
    <main className="pt-24 px-6 max-w-7xl mx-auto blur-sm pointer-events-none select-none">
      <header className="mb-12">
        <div className="text-slate-400 text-[10px] uppercase tracking-widest mb-2">
          Workspace / Personal
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Today's Focus
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Active task */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className="w-6 h-6 border-2 rounded-full shrink-0"
                style={{ borderColor: "#4d44e3" }}
              />
              <h3 className="text-xl font-semibold text-slate-900">
                Redesigning the onboarding flow
              </h3>
            </div>
          </div>
          {/* Completed task */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-50">
            <div className="flex items-center gap-4">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#4d44e3" }}
              >
                <CheckIcon />
              </div>
              <h3 className="text-xl font-medium text-slate-900">
                Weekly sync with stakeholders
              </h3>
            </div>
          </div>
        </div>

        <aside>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h4 className="mono text-xs uppercase tracking-widest text-slate-400 mb-4">
              Productivity
            </h4>
            <div className="text-3xl font-bold text-slate-900">84%</div>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-4">
              <div
                className="h-full rounded-full"
                style={{ width: "84%", background: "#4d44e3" }}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState("High");

  const open = Boolean(task);
  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...task,
      title,
      description,
      dueDate,
      priority,
    });
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#f7f9fb",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      {/* Top Nav */}
      <header
        className="fixed top-0 w-full z-50"
        style={{
          background: "rgba(247,249,251,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #4d44e3, #4034d7)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Task Management App
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {["Login", "Signup", "Logout"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                {item}
              </a>
            ))}
            <button className="ml-2 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-5 h-5 text-slate-600"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </nav>

          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Blurred Background Content */}
      <BackgroundShell />

      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: "rgba(42,52,57,0.25)",
            backdropFilter: "blur(12px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Modal Card */}
          <div
            className="modal-enter bg-white w-full max-w-lg rounded-2xl overflow-hidden relative"
            style={{
              boxShadow:
                "0 24px 64px -12px rgba(42,52,57,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            {/* Header */}
            <div
              className="px-8 py-6 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Edit Task
              </h2>
              <button
                onClick={() => onClose()}
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-90"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-7">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="mono block text-[10px] font-medium uppercase tracking-widest text-slate-400">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="field-input w-full bg-transparent rounded-xl px-4 py-3 text-xl font-semibold text-slate-900 placeholder-slate-300 transition-all"
                  style={{ caretColor: "#4d44e3" }}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="mono block text-[10px] font-medium uppercase tracking-widest text-slate-400">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about this task..."
                  rows={4}
                  className="field-input w-full bg-transparent rounded-xl px-4 py-3 text-sm leading-relaxed text-slate-500 placeholder-slate-300 resize-none transition-all"
                  style={{ caretColor: "#4d44e3" }}
                />
              </div>

              {/* Due Date + Priority */}
              <div className="grid grid-cols-2 gap-5">
                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="mono flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    <CalIcon /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-600 border-none focus:outline-none focus:ring-2 cursor-pointer"
                    style={{ background: "#f0f4f7", focusRingColor: "#4d44e3" }}
                  />
                </div>

                {/* Priority Chips */}
                <div className="space-y-1.5">
                  <label className="mono block text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    Priority
                  </label>
                  <div className="flex gap-2 items-center pt-1">
                    {["High", "Medium", "Low"].map((p) => {
                      const active = priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className="chip px-3 py-1.5 rounded-lg text-xs font-bold tracking-tight"
                          style={
                            active
                              ? {
                                  background: "rgba(77,68,227,0.12)",
                                  color: "#4d44e3",
                                }
                              : { background: "#f0f4f7", color: "#8896a0" }
                          }
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full"
                style={{ background: "rgba(0,0,0,0.05)" }}
              />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="submit"
                  className="btn-primary flex-1 py-4 px-6 rounded-xl text-white font-bold tracking-tight text-sm"
                  style={{
                    background: "linear-gradient(135deg, #4d44e3, #4034d7)",
                    boxShadow: "0 4px 18px rgba(77,68,227,0.25)",
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="btn-secondary flex-1 py-4 px-6 rounded-xl font-bold tracking-tight text-sm text-slate-600 hover:bg-slate-100 transition-all"
                  style={{ background: "#f0f4f7" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
