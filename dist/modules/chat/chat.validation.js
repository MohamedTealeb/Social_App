"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChat = void 0;
const zod_1 = require("zod");
exports.getChat = {
    params: zod_1.z.strictObject({
        userId: zod_1.z.string()
    })
};
//# sourceMappingURL=chat.validation.js.map