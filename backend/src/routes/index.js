import express from "express";

import taskRoutes from "./task.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    message: "Task Manager API is running.",
  });
});

router.use("/tasks", taskRoutes);

export default router;
