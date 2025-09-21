"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
    content: {
        type: String, minlength: 2, maxlength: 50000
    },
    attachements: [String],
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    freezedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    freezedAt: Date,
    restoredAt: Date,
    restoredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true
});
exports.CommentModel = mongoose_1.models.Comment || (0, mongoose_1.model)("Comment", postSchema);
//# sourceMappingURL=comment.model.js.map