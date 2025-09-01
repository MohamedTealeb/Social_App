"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const token_security_1 = require("../../utils/security/token.security");
const zod_1 = require("zod");
exports.logout = {
    body: zod_1.z.strictObject({
        flag: zod_1.z.enum(token_security_1.LogoutEnum).default(token_security_1.LogoutEnum.only)
    })
};
//# sourceMappingURL=user.validation.js.map