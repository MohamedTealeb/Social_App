"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = exports.getChatgroup = exports.getChat = void 0;
const zod_1 = require("zod");
exports.getChat = {
    params: zod_1.z.strictObject({
        userId: zod_1.z.string()
    }),
    query: zod_1.z.strictObject({
        page: zod_1.z.coerce.number().int().min(1).optional(),
        size: zod_1.z.coerce.number().int().min(1).optional(),
    })
};
exports.getChatgroup = {
    params: zod_1.z.strictObject({
        groupId: zod_1.z.string()
    }),
    query: exports.getChat.query
};
exports.createGroup = {
    body: zod_1.z.strictObject({
        participants: zod_1.z.array(zod_1.z.string()).min(1),
        group: zod_1.z.string().min(2).max(330),
    }).superRefine((data, ctx) => {
        if (data.participants
            ?.length && data.participants
            .length !== [...new Set(data.participants)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["participants"],
                message: "duplicated tagged users"
            });
        }
    })
};
//# sourceMappingURL=chat.validation.js.map