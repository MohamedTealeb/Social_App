"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmail = exports.acceptFriendRequest = exports.friendRequest = exports.logout = void 0;
const token_security_1 = require("../../utils/security/token.security");
const zod_1 = require("zod");
exports.logout = {
    body: zod_1.z.strictObject({
        flag: zod_1.z.enum(token_security_1.LogoutEnum).default(token_security_1.LogoutEnum.only)
    })
};
exports.friendRequest = {
    params: zod_1.z.strictObject({
        userId: zod_1.z.string()
    })
};
exports.acceptFriendRequest = {
    params: zod_1.z.strictObject({
        requestId: zod_1.z.string()
    })
};
exports.updateEmail = {
    body: zod_1.z.strictObject({
        email: zod_1.z.string().email("Invalid email format").min(1, "Email is required")
    })
};
//# sourceMappingURL=user.validation.js.map