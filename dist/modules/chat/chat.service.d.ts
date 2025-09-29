import { Request, Response } from "express";
import { IjoinRoomDto, ISayHiDto, ISendGroupMessageDto, ISendMessageDto, ITypingDto } from "./chat.dto";
export declare class ChatService {
    private chatModel;
    private userModel;
    private friendRequestRepo;
    constructor();
    getChat: (req: Request, res: Response) => Promise<Response>;
    getChatgroup: (req: Request, res: Response) => Promise<Response>;
    createGroup: (req: Request, res: Response) => Promise<Response>;
    sendMessage: ({ content, sendTo, socket, io }: ISendMessageDto) => Promise<boolean>;
    joinRoom: ({ roomId, socket, io }: IjoinRoomDto) => Promise<boolean>;
    sayHi: ({ message, socket, callback, io }: ISayHiDto) => boolean;
    sendGroupMessage: ({ content, groupId, socket, io }: ISendGroupMessageDto) => Promise<boolean>;
    handleTyping: ({ chatId, isTyping, socket, io }: ITypingDto) => boolean;
}
//# sourceMappingURL=chat.service.d.ts.map