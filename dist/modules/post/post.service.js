"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_repository_1 = require("../../DB/repository/post.repository");
const post_model_1 = require("../../DB/model/post.model");
const user_reository_1 = require("../../DB/repository/user.reository");
const User_model_1 = require("../../DB/model/User.model");
class PostService {
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    postModel = new post_repository_1.PostRepository(post_model_1.PostModel);
    constructor() { }
    createPost = async (req, res) => {
        return res.json({});
    };
}
exports.default = new PostService();
//# sourceMappingURL=post.service.js.map