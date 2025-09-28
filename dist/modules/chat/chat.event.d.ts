import { IAuthSocket } from "../getway/getway.interface";
import { Server } from "socket.io";
export declare class ChatEvent {
    private chatService;
    constructor();
    sayHi: (socket: IAuthSocket, io: Server) => IAuthSocket;
}
//# sourceMappingURL=chat.event.d.ts.map