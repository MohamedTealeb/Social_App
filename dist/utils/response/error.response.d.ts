import type { NextFunction, Request, Response } from 'express';
interface IError extends Error {
    statusCode: number;
}
export declare class AppError extends Error {
    message: string;
    statusCode: number;
    cause: unknown;
    constructor(message: string, statusCode: number, cause: unknown);
}
export declare class BadReauest extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare class Notfound extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare class ConflictException extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare const globalErrorHandling: (error: IError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare class UnauthorizedException extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare class ForbiddenException extends AppError {
    constructor(message: string, cause?: unknown);
}
export {};
//# sourceMappingURL=error.response.d.ts.map