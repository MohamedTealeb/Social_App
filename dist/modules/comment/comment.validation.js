"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyComment = exports.createComment = void 0;
const zod_1 = require("zod");
exports.createComment = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string()
    }),
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000).optional(),
        attachments: zod_1.z.array(zod_1.z.any()).max(2).optional(),
        tags: zod_1.z.array(zod_1.z.string()).max(10).optional()
    }).superRefine((data, ctx) => {
        if (!data.attachments?.length && !data.content) {
            ctx.addIssue({
                code: "custom",
                path: ['content'],
                message: "Post must have either content or attachments"
            });
        }
        if (data.tags?.length && data.tags.length !== [...new Set(data.tags)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["tags"],
                message: "duplicated tagged users"
            });
        }
    })
};
exports.replyComment = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string(),
        commentId: zod_1.z.string()
    }),
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000).optional(),
        attachments: zod_1.z.array(zod_1.z.any()).max(2).optional(),
        tags: zod_1.z.array(zod_1.z.string()).max(10).optional()
    }).optional().default({}).superRefine((data, ctx) => {
        if (!data.attachments?.length && !data.content) {
            ctx.addIssue({
                code: "custom",
                path: ['content'],
                message: "Reply must have either content or attachments"
            });
        }
        if (data.tags?.length && data.tags.length !== [...new Set(data.tags)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["tags"],
                message: "duplicated tagged users"
            });
        }
    })
};
//# sourceMappingURL=comment.validation.js.map