"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const zod_1 = require("zod");
exports.signup = {
    body: zod_1.z.object({
        username: zod_1.z.string().min(2).max(20),
        email: zod_1.z.email(),
        password: zod_1.z.string(),
        confirmPassword: zod_1.z.string()
    }).refine(data => {
        return data.password === data.confirmPassword;
    }, {
        error: "Passwords do not match"
    }),
};
//# sourceMappingURL=auth.validation.js.map