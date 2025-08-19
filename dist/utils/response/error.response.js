"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = exports.BadReauest = exports.AppError = void 0;
class AppError extends Error {
    message;
    statusCode;
    cause;
    constructor(message, statusCode, cause) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.cause = cause;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class BadReauest extends AppError {
    constructor(message, cause) {
        super(message, 400, cause);
    }
}
exports.BadReauest = BadReauest;
const globalErrorHandling = (error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        errror_message: error.message || "something went wrong",
        stack: process.env.MOOD === "development" ? error.stack : undefined,
        cause: error.cause,
    });
};
exports.globalErrorHandling = globalErrorHandling;
//# sourceMappingURL=error.response.js.map