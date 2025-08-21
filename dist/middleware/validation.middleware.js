"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const validation = (schema) => {
    return (req, res, next) => {
        const errors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const validationResult = schema[key]?.safeParse(req[key]);
            if (!validationResult.success) {
                errors.push({ key, issue: validationResult.error.issues.map(issue => {
                        return {
                            path: issue.path[0],
                            message: issue.message
                        };
                    }) });
            }
        }
        if (errors.length) {
            return res.status(400).json({
                message: "Validation error",
                errors
            });
        }
        return next();
    };
};
exports.validation = validation;
//# sourceMappingURL=validation.middleware.js.map