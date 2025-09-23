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
                commentId: commentId,
                createdBy: req.user?._id,
            }
        });
        return res.status(201).json(reply);
    };
    updateComment = async (req, res) => {
        const { commentId } = req.params;
        const comment = await this.commentModel.findOne({
            filter: { _id: commentId }
        });
        if (!comment) {
            throw new error_response_1.Notfound("comment not found");
        }
        const updated = await this.commentModel.findOneAndUpdate({
            filter: { _id: commentId },
            update: { ...req.body },
            options: { new: true }
        });
        return res.status(200).json(updated);
    };
    freezeComment = async (req, res) => {
        const { commentId } = req.params;
        const comment = await this.commentModel.findOne({
            filter: { _id: commentId }
        });
        if (!comment) {
            throw new error_response_1.Notfound("comment not found");
        }
        const updated = await this.commentModel.findOneAndUpdate({
            filter: { _id: commentId },
            update: {
                freezedBy: req.user?._id,
                freezedAt: new Date(),
                restoredAt: undefined,
                restoredBy: undefined
            },
            options: { new: true }
        });
        return res.status(200).json({
            success: true,
            message: "Comment freezed successfully",
            comment: updated
        });
    };
    hardDeleteComment = async (req, res) => {
        const { postId, commentId } = req.params;
        const comment = await this.commentModel.findOne({
            filter: { _id: commentId, postId }
        });
        if (!comment) {
            throw new error_response_1.Notfound("comment not found");
        }
        await comment_model_1.CommentModel.deleteMany({
            $or: [
                { _id: commentId },
                { commentId }
            ]
        });
        return res.status(200).json({
            success: true,
            message: "Comment deleted permanently"
        });
    };
    getCommentById = async (req, res) => {
        const { commentId } = req.params;
        const comment = await this.commentModel.findOne({
            filter: { _id: commentId }
        });
        if (!comment) {
            throw new error_response_1.Notfound("comment not found");
        }
        return res.status(200).json(comment);
    };
    getCommentWithReply = async (req, res) => {
        const { commentId } = req.params;
        const comment = await this.commentModel.findOne({
            filter: { _id: commentId },
            options: { populate: [{ path: "reply", populate: { path: "createdBy", select: "_id username" } }] }
        });
        if (!comment) {
            throw new error_response_1.Notfound("comment not found");
        }
        return res.status(200).json(comment);
    };
}
exports.default = new CommentService();
//# sourceMappingURL=comment.service.js.map