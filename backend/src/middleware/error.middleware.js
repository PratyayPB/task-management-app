import mongoose from "mongoose";

import AppError from "../lib/app-error.js";

function notFoundHandler(req, res, next) {
  next(new AppError(404, `Route ${req.originalUrl} was not found.`));
}

function errorHandler(error, req, res, next) {
  let normalizedError = error;

  if (error instanceof mongoose.Error.ValidationError) {
    normalizedError = new AppError(
      400,
      "Validation failed.",
      Object.values(error.errors).map((item) => item.message),
    );
  } else if (error instanceof mongoose.Error.CastError) {
    normalizedError = new AppError(400, "Invalid resource identifier.");
  } else if (!(error instanceof AppError)) {
    normalizedError = new AppError(
      500,
      "Something went wrong while processing the request.",
    );
  }

  if (process.env.NODE_ENV !== "test" && normalizedError.statusCode >= 500) {
    console.error(error);
  }

  const response = {
    message: normalizedError.message,
  };

  if (normalizedError.details) {
    response.details = normalizedError.details;
  }

  res.status(normalizedError.statusCode).json(response);
}

export { errorHandler, notFoundHandler };
