import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import Header from "./Header";
import TaskCreateForm from "./TaskCreateForm";
import TaskList from "./TaskList";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function normalizeTask(task) {
  return {
    id: task?._id || task?.id || `${Date.now()}-${Math.random()}`,
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "",
    completed: task?.isCompleted ?? task?.completed ?? false,
  };
}

function LandingPage() {
  const { isSignedIn, getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function fetchTasks() {
    setIsLoading(true);
    setLoadError("");

    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const rawTasks = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];

      setTasks(rawTasks.map(normalizeTask));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setLoadError("Unable to load tasks right now.");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [getToken]);

  const pendingCount = tasks.filter((task) => !task.completed).length;

  return (
    <div
      className="min-h-screen font-sans text-slate-800"
      style={{
        background: "linear-gradient(135deg, #f7f9fb 0%, #eef2f7 100%)",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      <Header />

      <main className="pt-28 pb-36 px-4 md:px-8 max-w-5xl mx-auto">
        <section className="mb-12">
          <p
            className="mono text-xs font-medium tracking-widest uppercase mb-2"
            style={{ color: "#4d44e3" }}
          >
            Workspace
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Today's Focus
          </h2>
        </section>

        <TaskCreateForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          refreshTasks={fetchTasks}
          isAuthenticated={isSignedIn}
        />

        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          pendingCount={pendingCount}
          isLoading={isLoading}
          loadError={loadError}
          isAuthenticated={isSignedIn}
          refreshTasks={fetchTasks}
        />
      </main>
    </div>
  );
}

export default LandingPage;
