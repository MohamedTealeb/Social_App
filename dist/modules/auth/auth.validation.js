"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const zod_1 = require("zod");
exports.signup = {
    // query:z.strictObject({
    //     flag:z.string({error:"flag is required"}).min(2).max(20)
    // }),
    body: zod_1.z.strictObject({
        username: zod_1.z.string().min(2).max(20),
        email: zod_1.z.email(),
        password: zod_1.z.string(),
        confirmPassword: zod_1.z.string(),
        phone: zod_1.z.string().optional(),
    }).refine(data => {
        return data.password === data.confirmPassword;
    }, {
        error: "Passwords do not match"
    }),
};
//# sourceMappingURL=auth.validation.js.map