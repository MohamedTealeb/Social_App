import { Request, Response } from "express";
import { ISayHiDto, ISendMessageDto } from "./chat.dto";
export declare class ChatService {
    private chatModel;
    private userModel;
    constructor();
    getChat: (req: Request, res: Response) => Promise<Response>;
    sendMessage: ({ content, sendTo, socket, io }: ISendMessageDto) => Promise<boolean | undefined>;
    sayHi: ({ message, socket, callback, io }: ISayHiDto) => boolean | undefined;
}
//# sourceMappingURL=chat.service.d.ts.map