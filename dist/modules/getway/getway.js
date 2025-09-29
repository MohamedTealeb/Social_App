"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.initializeIo = exports.connectedSocket = void 0;
const socket_io_1 = require("socket.io");
const token_security_1 = require("../../utils/security/token.security");
const chat_gateway_1 = require("../chat/chat.gateway");
const error_response_1 = require("../../utils/response/error.response");
exports.connectedSocket = new Map();
let io = undefined;
const initializeIo = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
        }
    });
    (0, exports.getIo)().use(async (socket, next) => {
        try {
            const { user, decoded } = await (0, token_security_1.decodeToken)({
                authorization: socket.handshake?.auth.authorization || "",
                tokenType: token_security_1.TokenEnum.access
            });
            const usertaps = exports.connectedSocket.get(user._id.toString()) || [];
            usertaps.push(socket.id);
            console.log({ usertaps });
            exports.connectedSocket.set(user._id.toString(), usertaps);
            socket.credentials = { user, decoded };
            next();
            // next(new BadReauest("fail in authentication middleware"))
        }
        catch (error) {
            console.error("Socket auth failed:", error.message);
        }
    });
    // disconnection
    function disconnection(socket) {
        return socket.on("disconnect", () => {
            // connectedSocket.delete(socket.credentials?.user._id?.toString() as string)
            const userId = socket.credentials?.user._id?.toString();
            let reminingTabs = exports.connectedSocket.get(userId)?.filter((tab) => {
                return tab !== socket.id;
            }) || [];
            if (reminingTabs?.length) {
                exports.connectedSocket.set(userId, reminingTabs);
            }
            else {
                exports.connectedSocket.delete(userId);
                (0, exports.getIo)().emit("offline_user", userId);
            }
            console.log({ after_Disconnect: exports.connectedSocket });
            (0, exports.getIo)().emit("offline_user", { userId: socket.credentials?.user._id?.toString() });
            console.log("A user disconnected:", socket.id);
        });
    }
    const chatGateway = new chat_gateway_1.ChatGateway();
    (0, exports.getIo)().on('connection', (socket) => {
        chatGateway.register(socket, (0, exports.getIo)());
        disconnection(socket);
    });
};
exports.initializeIo = initializeIo;
const getIo = () => {
    if (!io)
        throw new error_response_1.BadReauest("Io not initialized");
    return io;
};
exports.getIo = getIo;
//# sourceMappingURL=getway.js.map