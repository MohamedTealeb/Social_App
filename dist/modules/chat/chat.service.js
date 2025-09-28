"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor() { }
    sayHi = ({ message, socket, callback, io }) => {
        try {
            console.log({ message });
            if (callback) {
                callback('BE To FE');
            }
            callback ? callback("hello BE from FE") : undefined;
        }
        catch (error) {
            return socket.emit("custom_error", error);
        }
    };
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map