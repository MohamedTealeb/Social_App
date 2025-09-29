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
const mongoose_1 = require("mongoose");
const error_response_1 = require("../../utils/response/error.response");
const chat_model_1 = require("./../../DB/model/chat.model");
const chat_repository_1 = require("../../DB/repository/chat.repository");
class UserService {
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    CHatModel = new chat_repository_1.ChatRepository(chat_model_1.CHatModel);
    postModel = new post_repository_1.PostRepository(post_model_1.PostModel);
    friendRequestModel = new friendRequest_repository_1.FriendRequestRepository(friendRequest_model_1.FriendRequestModel);
    // private tokenModel=new TokenRepository(TokenModel)
    constructor() { }
    profile = async (req, res) => {
        const profile = await this.userModel.findOne({ filter: { _id: req.user?._id } });
        if (!profile) {
            throw new error_response_1.Notfound("profile not found");
        }
        const friendRequests = await this.friendRequestModel.find({
            filter: {
                $or: [
                    { createdBy: req.user?._id, acceptedAt: { $exists: true } },
                    { sendTo: req.user?._id, acceptedAt: { $exists: true } }
                ]
            },
            options: {
                populate: [
                    { path: "createdBy", select: "firstName lastName email" },
                    { path: "sendTo", select: "firstName lastName email" }
                ]
            }
        });
        const me = req.user?._id?.toString() || "";
        const friends = friendRequests
            .map(request => {
            const createdBy = request.createdBy || null;
            const sendTo = request.sendTo || null;
            const createdById = createdBy?._id?.toString?.() ?? createdBy?.toString?.();
            return createdById === me ? sendTo : createdBy;
        })
            .filter(Boolean);
        const groups = await this.CHatModel.find({
            filter: {
                participants: { $in: [req.user?._id] },
                group: { $exists: true, $nin: [null, ""] }
            }
        });
        return res.json({
            message: "Done",
            date: {
                user: profile,
                friends: friends,
                groups: groups
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
        const friendRequest = await this.friendRequestModel.create({ data: {
                createdBy: req.user?._id,
                sendTo: userId
            } });
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
            this.userModel.updateOne({ filter: { _id: FriendRequest.createdBy }, update: { $addToSet: { friends: FriendRequest.sendTo } } }),
            this.userModel.updateOne({ filter: { _id: FriendRequest.sendTo }, update: { $addToSet: { friends: FriendRequest.createdBy } } }),
        ]);
        return res.status(201).json({
            message: "accepted friend request",
            status: 201,
            res: FriendRequest
        });
    };
    deleteFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const deleted = await this.friendRequestModel.findOneAndUpdate({
            filter: {
                _id: requestId,
                $or: [{ createdBy: req.user?._id }, { sendTo: req.user?._id }]
            },
            update: { acceptedAt: undefined },
            options: { new: false }
        });
        if (!deleted) {
            throw new error_response_1.Notfound("friend request not found");
        }
        await friendRequest_model_1.FriendRequestModel.deleteOne({ _id: requestId });
        return res.status(200).json({ message: "friend request deleted" });
    };
    unFriend = async (req, res) => {
        const { userId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new error_response_1.Notfound("Invalid user id");
        }
        await Promise.all([
            this.userModel.updateOne({ filter: { _id: req.user?._id }, update: { $pull: { friends: userId } } }),
            this.userModel.updateOne({ filter: { _id: userId }, update: { $pull: { friends: req.user?._id } } })
        ]);
        return res.status(200).json({ message: "unfriended successfully" });
    };
    updateEmail = async (req, res) => {
        const { email } = req.body;
        const existingUser = await this.userModel.findOne({ filter: { email } });
        if (existingUser && existingUser._id.toString() !== req.user?._id.toString()) {
            throw new error_response_1.ConflictException("Email already exists");
        }
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: req.user?._id },
            update: { email },
            options: { new: true, select: "-password -confrimEmailOtp -resetPasswordOtp -changeCredentialTime" }
        });
        if (!updatedUser) {
            throw new error_response_1.Notfound("User not found");
        }
        return res.json({
            message: "Email updated successfully",
            data: {
                user: updatedUser
            }
        });
    };
    blockUser = async (req, res) => {
        const { userId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new error_response_1.Notfound("Invalid user id");
        }
        const user = await this.userModel.findOne({ filter: { _id: userId } });
        if (!user) {
            throw new error_response_1.Notfound("user not found");
        }
        await this.userModel.updateOne({
            filter: { _id: req.user?._id },
            update: { $addToSet: { blocked: userId } }
        });
        return res.status(200).json({ message: "user blocked" });
    };
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map