import mongoose from "mongoose";

import AppError from "../lib/app-error.js";
import asyncHandler from "../lib/async-handler.js";
import Task from "../models/task.model.js";

function ensureValidTaskId(taskId) {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError(400, "Invalid task id.");
  }
}

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ createdBy: req.auth.userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    data: tasks,
    message: "Tasks retrieved successfully.",
  });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.validatedBody,
    createdBy: req.auth.userId,
  });

  res.status(201).json({
    data: task,
    message: "Task created successfully.",
  });
});

const updateTask = asyncHandler(async (req, res) => {
  ensureValidTaskId(req.params.taskId);

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      createdBy: req.auth.userId,
    },
    {
      $set: req.validatedBody,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    throw new AppError(404, "Task not found.");
  }

  res.status(200).json({
    data: task,
    message: "Task updated successfully.",
  });
});

const markTaskAsCompleted = asyncHandler(async (req, res) => {
  ensureValidTaskId(req.params.taskId);

  const task = await Task.findOne({
    _id: req.params.taskId,
    createdBy: req.auth.userId,
  });

  if (!task) {
    throw new AppError(404, "Task not found.");
  }

  if (task.isCompleted) {
    throw new AppError(409, "Task is already marked as completed.");
  }

  task.isCompleted = true;
  task.completedAt = new Date();
  await task.save();

  res.status(200).json({
    data: task,
    message: "Task marked as completed successfully.",
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  ensureValidTaskId(req.params.taskId);

  const task = await Task.findOneAndDelete({
    _id: req.params.taskId,
    createdBy: req.auth.userId,
  });

  if (!task) {
    throw new AppError(404, "Task not found.");
  }

  res.status(200).json({
    message: "Task deleted successfully.",
  });
});

export { createTask, deleteTask, getTasks, markTaskAsCompleted, updateTask };
