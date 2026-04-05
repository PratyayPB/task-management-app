import { z } from "zod";

const titleSchema = z
  .string({
    required_error: "Task title is required.",
    invalid_type_error: "Task title must be a string.",
  })
  .trim()
  .min(1, "Task title cannot be empty.")
  .max(120, "Task title must be 120 characters or less.");

const descriptionSchema = z
  .string({
    invalid_type_error: "Description must be a string.",
  })
  .trim()
  .max(1000, "Description must be 1000 characters or less.");

const categorySchema = z
  .string({
    invalid_type_error: "Category must be a string.",
  })
  .trim()
  .min(1, "Category cannot be empty.")
  .max(50, "Category must be 50 characters or less.");

const dueDateSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === "") {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date(value);
  },
  z
    .union([
      z
        .date({
          invalid_type_error: "Due date must be a valid date.",
        })
        .refine((date) => !Number.isNaN(date.getTime()), {
          message: "Due date must be a valid date.",
        }),
      z.null(),
    ])
    .optional(),
);

const createTaskSchema = z.object({
  category: categorySchema.optional().default("General"),
  description: descriptionSchema.optional().default(""),
  dueDate: dueDateSchema,
  title: titleSchema,
});

const updateTaskSchema = z
  .object({
    category: categorySchema.optional(),
    description: descriptionSchema.optional(),
    dueDate: dueDateSchema,
    isCompleted: z.boolean().optional(),
    title: titleSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a task.",
  });

export { createTaskSchema, updateTaskSchema };
