"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_repository_1 = require("../../DB/repository/post.repository");
const post_model_1 = require("../../DB/model/post.model");
const user_reository_1 = require("../../DB/repository/user.reository");
const User_model_1 = require("../../DB/model/User.model");
const error_response_1 = require("../../utils/response/error.response");
const mongoose_1 = require("mongoose");
class PostService {
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    postModel = new post_repository_1.PostRepository(post_model_1.PostModel);
    constructor() { }
    createPost = async (req, res) => {
        let processedTags = [];
        if (req.body.tags?.length) {
            processedTags = req.body.tags.map((tag) => {
                if (typeof tag === 'object' && tag.userId) {
                    return tag.userId;
                }
                return tag;
            });
        }
        if (processedTags.length &&
            (await this.userModel.find({ filter: { _id: { $in: processedTags } } })).length !==
                processedTags.length) {
            throw new error_response_1.Notfound("Some of the mentioned users do not exist");
        }
        const postData = {
            ...req.body,
            tags: processedTags
        };
        const post = await this.postModel.create({ data: postData });
        return res.status(201).json(post);
    };
    likePost = async (req, res) => {
        const { postId } = req.params;
        const { userId } = req.body;
        if (!postId) {
            throw new error_response_1.Notfound("Post ID is required");
        }
        if (!userId) {
            throw new error_response_1.Notfound("User ID is required");
        }
        if (!mongoose_1.Types.ObjectId.isValid(postId)) {
            throw new error_response_1.Notfound("Invalid Post ID format");
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new error_response_1.Notfound("Invalid User ID format");
        }
        const existingPost = await this.postModel.findOne({ filter: { _id: new mongoose_1.Types.ObjectId(postId) } });
        if (!existingPost) {
            throw new error_response_1.Notfound("Post not found");
        }
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const isLiked = existingPost.likes?.some(likeId => likeId.toString() === userObjectId.toString()) || false;
        let updatedPost;
        if (isLiked) {
            updatedPost = await this.postModel.findByIdAndUpdate({
                id: new mongoose_1.Types.ObjectId(postId),
                update: { $pull: { likes: userObjectId } },
                options: { new: true }
            });
        }
        else {
            updatedPost = await this.postModel.findByIdAndUpdate({
                id: new mongoose_1.Types.ObjectId(postId),
                update: { $addToSet: { likes: userObjectId } },
                options: { new: true }
            });
        }
        return res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
            post: updatedPost,
            isLiked: !isLiked
        });
    };
}
exports.default = new PostService();
//# sourceMappingURL=post.service.js.map