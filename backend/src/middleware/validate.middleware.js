import AppError from "../lib/app-error.js";

function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          "Validation failed.",
          result.error.issues.map((issue) => issue.message),
        ),
      );
    }

    req.validatedBody = result.data;
    return next();
  };
}

export default validateRequest;
