"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_repository_1 = require("../../DB/repository/comment.repository");
const post_repository_1 = require("../../DB/repository/post.repository");
const post_model_1 = require("../../DB/model/post.model");
const comment_model_1 = require("../../DB/model/comment.model");
const post_service_1 = require("../post/post.service");
const error_response_1 = require("../../utils/response/error.response");
class CommentService {
    commentModel = new comment_repository_1.CommentRepository(comment_model_1.CommentModel);
    postModel = new post_repository_1.PostRepository(post_model_1.PostModel);
    constructor() { }
    createComment = async (req, res) => {
        const { postId } = req.params;
        const post = await this.postModel.findOne({ filter: { _id: postId, allowComments: post_model_1.allowCommentsEnum.allow, $or: (0, post_service_1.postAvailability)(req) } });
        if (!post) {
            throw new error_response_1.Notfound("Post not found");
        }
        const comment = await this.commentModel.create({ data: {
                ...req.body,
                postId,
                createdBy: req.user?._id
            } });
        return res.status(201).json(comment);
    };
    replyComment = async (req, res) => {
        const { postId, commentId } = req.params;
        const comment = await this.commentModel.findOne({
            filter: { _id: commentId, postId }
        });
        if (!comment) {
            throw new error_response_1.Notfound("comment not found");
        }
        // Check if the post allows comments
        const post = await this.postModel.findOne({
            filter: { _id: postId, allowComments: post_model_1.allowCommentsEnum.allow, $or: (0, post_service_1.postAvailability)(req) }
        });
        if (!post) {
            throw new error_response_1.Notfound("Post not found or comments not allowed");
        }
        const reply = await this.commentModel.create({
            data: {
                ...req.body,
                postId,
                commentId: commentId, // مهم عشان تحدد إنه رد
                createdBy: req.user?._id,
            }
        });
        return res.status(201).json(reply);
    };
}
exports.default = new CommentService();
//# sourceMappingURL=comment.service.js.map