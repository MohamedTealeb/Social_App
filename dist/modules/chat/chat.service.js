"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chat_repository_1 = require("../../DB/repository/chat.repository");
const chat_model_1 = require("../../DB/model/chat.model");
const mongoose_1 = require("mongoose");
const error_response_1 = require("../../utils/response/error.response");
const User_model_1 = require("./../../DB/model/User.model");
const user_reository_1 = require("../../DB/repository/user.reository");
const getway_1 = require("../getway/getway");
class ChatService {
    chatModel = new chat_repository_1.ChatRepository(chat_model_1.CHatModel);
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    constructor() { }
    //Rest
    getChat = async (req, res) => {
        const { userId } = req.params;
        const chat = await this.chatModel.findOne({
            filter: {
                participants: {
                    $all: [req.user?._id,
                        mongoose_1.Types.ObjectId.createFromHexString(userId)]
                },
                group: { $exists: false }
            },
            options: {
                populate: [{ path: "participants", select: "firstName lastName email " }],
            }
        });
        if (!chat) {
            throw new error_response_1.BadReauest("chat not found");
        }
        return res.status(200).json({
            message: "get chat",
            data: { chat }
        });
    };
    sendMessage = async ({ content, sendTo, socket, io }) => {
        try {
            const createdBy = socket.credentials?.user._id;
            console.log({ content, sendTo, createdBy });
            const user = await this.userModel.findOne({
                _id: mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                friends: { $in: [createdBy] },
            });
            if (!user)
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
                const [newChat] = (await this.chatModel.create({
                    data: [
                        {
                            createdBy,
                            messages: [{ content, createdBy }],
                            participants: [
                                createdBy,
                                mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                            ],
                        },
                    ],
                })) || [];
                if (!newChat) {
                    throw new error_response_1.BadReauest("fail to create chat");
                }
            }
            io?.to(getway_1.connectedSocket.get(createdBy.toString())).emit("successMessage", { content });
            io?.to(getway_1.connectedSocket.get(sendTo)).emit("newMessage", { content, from: socket.credentials?.user });
        }
        catch (error) {
            return socket.emit("custom_error", error);
        }
    };
    sayHi = ({ message, socket, callback, io }) => {
        try {
            console.log({ message });
            if (callback) {
                callback("BE To FE");
                callback("hello BE from FE");
            }
        }
        catch (error) {
            return socket.emit("custom_error", error);
        }
    };
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map