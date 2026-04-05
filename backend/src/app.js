import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import AppError from "./lib/app-error.js";
import { env } from "./lib/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import apiRoutes from "./routes/index.js";

function createApp(options = {}) {
  const { enableClerk = process.env.NODE_ENV !== "test" } = options;
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (
          !origin ||
          env.allowedOrigins.length === 0 ||
          env.allowedOrigins.includes(origin)
        ) {
          return callback(null, true);
        }

        return callback(new AppError(403, "Origin not allowed by CORS."));
      },
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  if (enableClerk) {
    app.use(clerkMiddleware());
  }

  app.use("/api", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export { createApp };
