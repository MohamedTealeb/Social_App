"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.createPost = void 0;
const zod_1 = require("zod");
const post_model_1 = require("../../DB/model/post.model");
exports.createPost = {
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000).optional(),
        attachments: zod_1.z.array(zod_1.z.any()).max(2).optional(),
        availability: zod_1.z.enum(post_model_1.availabilityEnum).default(post_model_1.availabilityEnum.public),
        allowComments: zod_1.z.enum(post_model_1.allowCommentsEnum).default(post_model_1.allowCommentsEnum.allow),
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
exports.likePost = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string()
    })
};
//# sourceMappingURL=post.validation.js.map