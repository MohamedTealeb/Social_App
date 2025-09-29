import { IAuthSocket } from "../getway/getway.interface";
import { Server } from "socket.io";
export declare class ChatEvent {
    private chatService;
    constructor();
    sayHi: (socket: IAuthSocket, io: Server) => IAuthSocket;
    sendMessage: (socket: IAuthSocket, io: Server) => IAuthSocket;
    joinRoom: (socket: IAuthSocket, io: Server) => IAuthSocket;
    sendGroupMessage: (socket: IAuthSocket, io: Server) => IAuthSocket;
    handleTyping: (socket: IAuthSocket, io: Server) => IAuthSocket;
}
//# sourceMappingURL=chat.event.d.ts.map