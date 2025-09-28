import { IAuthSocket } from "../getway/getway.interface";
import { Server } from "socket.io";
export declare class ChatGateway {
    private ChatEvent;
    constructor();
    register: (socket: IAuthSocket, io: Server) => void;
}
//# sourceMappingURL=chat.gateway.d.ts.map