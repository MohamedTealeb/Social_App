"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chat_repository_1 = require("../../DB/repository/chat.repository");
const chat_model_1 = require("../../DB/model/chat.model");
const mongoose_1 = require("mongoose");
const error_response_1 = require("../../utils/response/error.response");
const User_model_1 = require("./../../DB/model/User.model");
const user_reository_1 = require("../../DB/repository/user.reository");
const friendRequest_model_1 = require("../../DB/model/friendRequest.model");
const friendRequest_repository_1 = require("../../DB/repository/friendRequest.repository");
const getway_1 = require("../getway/getway");
const uuid_1 = require("uuid");
class ChatService {
    chatModel = new chat_repository_1.ChatRepository(chat_model_1.CHatModel);
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    friendRequestRepo = new friendRequest_repository_1.FriendRequestRepository(friendRequest_model_1.FriendRequestModel);
    constructor() { }
    //Rest
    getChat = async (req, res) => {
        const { userId } = req.params;
        const { page, size } = req.query;
        const chat = await this.chatModel.findOneChat({
            filter: {
                participants: {
                    $all: [req.user?._id,
                        mongoose_1.Types.ObjectId.createFromHexString(userId)]
                },
                group: { $exists: false }
            },
            options: {
                populate: [{ path: "participants", select: "firstName lastName email " }],
            },
            page: page ? Number(page) : 1,
            size: size ? Number(size) : 5
        });
        if (!chat) {
            throw new error_response_1.BadReauest("chat not found");
        }
        return res.status(200).json({
            message: "get chat",
            data: { chat }
        });
    };
    getChatgroup = async (req, res) => {
        const { groupId } = req.params;
        const { page, size } = req.query;
        const chat = await this.chatModel.findOneChat({
            filter: {
                _id: mongoose_1.Types.ObjectId.createFromHexString(groupId),
                participants: {
                    $in: req.user?._id
                },
                group: { $exists: true }
            },
            options: {
                populate: [{ path: "messages.createdBy", select: "firstName lastName email " }],
            },
            page: page ? Number(page) : 1,
            size: size ? Number(size) : 5
        });
        if (!chat) {
            throw new error_response_1.BadReauest("chat not found");
        }
        return res.status(200).json({
            message: "get chat",
            data: { chat }
        });
    };
    createGroup = async (req, res) => {
        const { group, participants } = req.body;
        const dbparticipants = participants.map((participant) => mongoose_1.Types.ObjectId.createFromHexString(participant));
        const users = await this.userModel.find({
            filter: {
                _id: { $in: dbparticipants },
                friends: { $in: [req.user?._id] }
            }
        });
        const validIds = users.map((u) => u._id.toString());
        const invalidParticipants = participants.filter((p) => !validIds.includes(p));
        if (invalidParticipants.length > 0) {
            return res.status(400).json({
                error: "invalid participants",
                invalidParticipants
            });
        }
        dbparticipants.push(req.user?._id);
        const roomId = group.replaceAll(/\s+/g, "_") + "_" + (0, uuid_1.v4)();
        const newGroup = (await this.chatModel.create({
            data: {
                createdBy: req.user?._id,
                group,
                roomId,
                messages: [],
                participants: dbparticipants
            }
        }));
        if (!newGroup) {
            throw new error_response_1.BadReauest("fail to create group");
        }
        return res.status(201).json({
            message: "group created",
            data: { group: newGroup }
        });
    };
    sendMessage = async ({ content, sendTo, socket, io }) => {
        try {
            const createdBy = socket.credentials?.user._id;
            console.log({ content, sendTo, createdBy });
            const targetUser = await this.userModel.findOne({
                filter: {
                    _id: mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                },
            });
            if (!targetUser)
                throw new error_response_1.Notfound("invalid user id or you are not friend");
            const acceptedFriendship = await this.friendRequestRepo.findOne({
                filter: {
                    acceptedAt: { $exists: true },
                    $or: [
                        { createdBy: createdBy, sendTo: mongoose_1.Types.ObjectId.createFromHexString(sendTo) },
                        { createdBy: mongoose_1.Types.ObjectId.createFromHexString(sendTo), sendTo: createdBy },
                    ],
                },
            });
            if (!acceptedFriendship)
                throw new error_response_1.Notfound("invalid user id or you are not friend");
            const chat = await this.chatModel.findOneAndUpdate({
                filter: {
                    participants: {
                        $all: [
                            createdBy,
                            mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                        ],
                    },
                    group: { $exists: false },
                },
                update: {
                    $addToSet: {
                        messages: {
                            content,
                            createdBy,
                        },
                    },
                },
            });
            if (!chat) {
                const newChat = await this.chatModel.create({
                    data: {
                        createdBy,
                        messages: [{ content, createdBy }],
                        participants: [
                            createdBy,
                            mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                        ],
                    },
                });
                if (!newChat) {
                    throw new error_response_1.BadReauest("fail to create chat");
                }
            }
            io?.to(getway_1.connectedSocket.get(createdBy.toString())).emit("successMessage", { content });
            io?.to(getway_1.connectedSocket.get(sendTo)).emit("newMessage", { content, from: socket.credentials?.user });
            return true;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return socket.emit("custom_error", { message });
        }
    };
    joinRoom = async ({ roomId, socket, io }) => {
        try {
            const chat = await this.chatModel.findOne({
                filter: {
                    roomId, group: { $exists: true },
                    participants: { $in: socket.credentials?.user._id }
                }
            });
            if (!chat)
                throw new error_response_1.Notfound("invalid room id or you are not member in this room");
            socket.join(chat.roomId);
            return true;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            socket.emit("custom_error", { message });
            return false;
        }
    };
    sayHi = ({ message, socket, callback, io }) => {
        try {
            console.log({ message });
            if (callback) {
                callback("BE To FE");
                callback("hello BE from FE");
            }
            return true;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            socket.emit("custom_error", { message });
            return false;
        }
    };
    sendGroupMessage = async ({ content, groupId, socket, io }) => {
        try {
            const createdBy = socket.credentials?.user._id;
            const chat = await this.chatModel.findOneAndUpdate({
                filter: {
                    _id: mongoose_1.Types.ObjectId.createFromHexString(groupId),
                    participants: {
                        $in: createdBy
                    },
                    group: { $exists: true },
                },
                update: {
                    $addToSet: {
                        messages: {
                            content,
                            createdBy,
                        },
                    },
                },
            });
            if (!chat) {
                throw new error_response_1.BadReauest("fail to find match room");
            }
            io?.to(getway_1.connectedSocket.get(createdBy.toString())).emit("successMessage", { content });
            io?.to(chat.roomId).emit("newMessage", { content, from: socket.credentials?.user, groupId });
            return true;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return socket.emit("custom_error", { message });
        }
    };
    handleTyping = ({ chatId, isTyping, socket, io }) => {
        try {
            const userId = socket.credentials?.user._id?.toString();
            const userName = `${socket.credentials?.user.firstName} ${socket.credentials?.user.lastName}`;
            if (!userId) {
                throw new error_response_1.BadReauest("User not authenticated");
            }
            io?.emit("typing_status", {
                chatId,
                userId,
                userName,
                isTyping,
                user: {
                    _id: socket.credentials?.user._id,
                    firstName: socket.credentials?.user.firstName,
                    lastName: socket.credentials?.user.lastName,
                    profileImage: socket.credentials?.user.profileImage
                }
            });
            return true;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return socket.emit("custom_error", { message });
        }
    };
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map