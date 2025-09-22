"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = require("../../DB/model/User.model");
const user_reository_1 = require("../../DB/repository/user.reository");
// import { TokenRepository } from "../../DB/repository/token.repository";
// import { TokenModel } from "../../DB/model/Token.model";
const token_security_1 = require("../../utils/security/token.security");
// import { uploadFile } from "multer/s3.config";
const post_model_1 = require("./../../DB/model/post.model");
const post_repository_1 = require("../../DB/repository/post.repository");
const friendRequest_repository_1 = require("../../DB/repository/friendRequest.repository");
const friendRequest_model_1 = require("../../DB/model/friendRequest.model");
const error_response_1 = require("../../utils/response/error.response");
class UserService {
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    postModel = new post_repository_1.PostRepository(post_model_1.PostModel);
    friendRequestModel = new friendRequest_repository_1.FriendRequestRepository(friendRequest_model_1.FriendRequestModel);
    // private tokenModel=new TokenRepository(TokenModel)
    constructor() { }
    profile = async (req, res) => {
        return res.json({
            message: "Done",
            date: {
                user: req.user,
                decoded: req.decoded
            }
        });
    };
    dashboard = async (req, res) => {
        const result = await Promise.allSettled([this.userModel.find({ filter: {} }), this.postModel.find({ filter: {} })]);
        return res.json({
            message: "Done",
            date: {
                result
            }
        });
    };
    profileImage = async (req, res) => {
        // const key=await uploadFile({
        //     file:req.file as Express.Multer.File,
        //     path:`users/${req.decoded?._id}`
        // })
        return res.json({
            message: "Done",
            date: {
                file: req.file
            }
        });
    };
    logout = async (req, res) => {
        const { flag } = req.body;
        let statusCode = 200;
        const update = {};
        switch (flag) {
            case token_security_1.LogoutEnum.all:
                update.changeCredentialTime = new Date();
                break;
            default:
                await (0, token_security_1.createRevokeToken)(req.decoded);
                statusCode = 201;
                break;
        }
        await this.userModel.updateOne({
            filter: { _id: req.decoded?._id },
            update
        });
        return res.status(statusCode).json({
            message: "Done",
            date: {
                user: req.user,
                decoded: req.decoded
            }
        });
    };
    refreshToken = async (req, res) => {
        const credentials = await (0, token_security_1.createLoginCredentaails)(req.user);
        await (0, token_security_1.createRevokeToken)(req.decoded);
        return res.status(201).json({
            message: "Donne",
            data: {
                credentials
            }
        });
    };
    friendRequest = async (req, res) => {
        const { userId } = req.params;
        const checkFriendRequest = await this.friendRequestModel.findOne({ filter: {
                createdBy: { $in: [req.user?._id, userId] },
                sendTo: { $in: [req.user?._id, userId] }
            } });
        if (checkFriendRequest) {
            throw new error_response_1.ConflictException("friend request already exist");
        }
        const user = await this.userModel.findOne({ filter: { _id: userId } });
        if (!user) {
            throw new error_response_1.Notfound("user not found");
        }
        const [friendRequest] = await this.friendRequestModel.create({ data: [{
                    createdBy: req.user?._id,
                    sendTo: userId
                }] }) || [];
        if (!friendRequest) {
            throw new error_response_1.BadReauest("fail to create friend request");
        }
        return res.status(201).json({
            message: "Done",
            status: 201,
            data: {
                friendRequest
            }
        });
    };
    acceptFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const FriendRequest = await this.friendRequestModel.findOneAndUpdate({ filter: {
                _id: requestId,
                sendTo: req.user?._id,
                acceptedAt: { $exists: false }
            }, update: { acceptedAt: new Date() } });
        if (!FriendRequest) {
            throw new error_response_1.ConflictException("friend request not found");
        }
        await Promise.all([
            this.userModel.updateOne({ filter: { _id: this.friendRequest.createdBy }, update: { $addToSet: { friends: FriendRequest.sendTo } } }),
            this.userModel.updateOne({ filter: { _id: FriendRequest.sendTo }, update: { $addToSet: { friends: FriendRequest.createdBy } } }),
        ]);
        return res.status(201).json({
            message: "accepted friend request",
            status: 201,
            res: FriendRequest
        });
    };
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map