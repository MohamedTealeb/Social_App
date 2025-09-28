import { Server } from "socket.io";
import { IAuthSocket } from "../getway/getway.interface";
export interface IMainDto {
    socket: IAuthSocket;
    callback?: any;
    io?: Server;
}
export interface ISayHiDto extends IMainDto {
    message: string;
}
//# sourceMappingURL=chat.dto.d.ts.map