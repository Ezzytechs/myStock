class AppError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }

  /* ========= COMMON ERRORS ========= */

  static notFound(message = "Resource not found") {
    return new AppError(message, "NOT_FOUND", 404);
  }

  static validation(message = "Invalid input") {
    return new AppError(message, "INVALID_INPUT", 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, "UNAUTHORIZED", 401);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, "FORBIDDEN", 403);
  }

  static conflict(message = "Conflict") {
    return new AppError(message, "CONFLICT", 409);
  }

  static internal(message = "Internal server error") {
    return new AppError(message, "INTERNAL_SERVER_ERROR", 500);
  }
}

module.exports = AppError;
