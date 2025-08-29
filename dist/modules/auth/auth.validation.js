"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
exports.signup = {
    // query:z.strictObject({
    //     flag:z.string({error:"flag is required"}).min(2).max(20)
    // }),
    body: zod_1.z.strictObject({
        firstName: validation_middleware_1.generalFields.firstName,
        lastName: validation_middleware_1.generalFields.lastName,
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password,
        confirmPassword: validation_middleware_1.generalFields.confirmPassword,
        phone: zod_1.z.string().optional(),
        gender: validation_middleware_1.generalFields.gender
    }).refine(data => {
        return data.password === data.confirmPassword;
    }, {
        error: "Passwords do not match"
    }),
};
exports.login = {
    body: zod_1.z.strictObject({
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password,
        confirmPassword: validation_middleware_1.generalFields.confirmPassword,
    })
};
//# sourceMappingURL=auth.validation.js.map