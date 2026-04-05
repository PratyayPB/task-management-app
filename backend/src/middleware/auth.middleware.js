import { getAuth } from "@clerk/express";

import AppError from "../lib/app-error.js";

function requireAuthenticatedUser(req, res, next) {
  const testUserId =
    process.env.NODE_ENV === "test" ? req.header("x-test-user-id") : null;

  if (testUserId) {
    req.auth = { userId: testUserId };
    return next();
  }

  if (process.env.NODE_ENV === "test") {
    return next(
      new AppError(401, "Authentication is required to access this resource."),
    );
  }

  let auth;

  try {
    auth = getAuth(req);
  } catch (error) {
    return next(
      new AppError(
        500,
        "Authentication middleware is not configured correctly.",
      ),
    );
  }

  if (!auth?.userId) {
    return next(
      new AppError(401, "Authentication is required to access this resource."),
    );
  }

  req.auth = auth;
  return next();
}

export { requireAuthenticatedUser };
