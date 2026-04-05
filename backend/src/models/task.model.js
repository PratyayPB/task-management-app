import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      maxlength: [120, "Task title must be 120 characters or less."],
      validate: {
        validator(value) {
          return typeof value === "string" && value.trim().length > 0;
        },
        message: "Task title cannot be empty.",
      },
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description must be 1000 characters or less."],
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      default: "General",
      maxlength: [50, "Category must be 50 characters or less."],
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      index: true,
      required: [true, "Task owner is required."],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ createdBy: 1, createdAt: -1 });

taskSchema.pre("save", async function () {
  if (this.isModified("isCompleted")) {
    this.completedAt = this.isCompleted ? this.completedAt || new Date() : null;
  }
});

export default mongoose.model("Task", taskSchema);
