import express from "express";

import {
  createTask,
  deleteTask,
  getTasks,
  markTaskAsCompleted,
  updateTask,
} from "../controllers/task.controller.js";
import { requireAuthenticatedUser } from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

const router = express.Router();

router.use(requireAuthenticatedUser);

router
  .route("/")
  .get(getTasks)
  .post(validateRequest(createTaskSchema), createTask);

router.patch("/:taskId/complete", markTaskAsCompleted);
router.put("/:taskId", validateRequest(updateTaskSchema), updateTask);
router
  .route("/:taskId")
  .patch(validateRequest(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
