"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.validation = void 0;
const zod_1 = __importDefault(require("zod"));
const User_model_1 = require("../DB/model/User.model");
const validation = (schema) => {
    return (req, res, next) => {
        const errors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            if (req.file) {
                req.body.attachments = req.file;
            }
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
exports.generalFields = {
    username: zod_1.default.string({
        error: "username is requird"
    }).min(2, { error: "min username length is 2" }).max(20, { error: "max username length is 20" }),
    firstName: zod_1.default.string({
        error: "firstName is required"
    }).min(2, { error: "min firstName length is 2" }).max(50, { error: "max firstName length is 50" }),
    lastName: zod_1.default.string({
        error: "lastName is required"
    }).min(2, { error: "min lastName length is 2" }).max(50, { error: "max lastName length is 50" }),
    email: zod_1.default.email({
        error: "email is requird"
    }),
    password: zod_1.default.string().min(6, { error: "min password length is 6" }),
    confirmPassword: zod_1.default.string(),
    gender: zod_1.default.nativeEnum(User_model_1.GenderEnum).optional(),
    otp: zod_1.default.string().regex(/^\d{6}$/)
};
//# sourceMappingURL=validation.middleware.js.map