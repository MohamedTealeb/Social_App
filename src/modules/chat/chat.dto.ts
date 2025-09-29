import { Server } from "socket.io";
import { IAuthSocket } from "../getway/getway.interface";
import {z}from 'zod'
import { createGroup, getChat, getChatgroup } from "./chat.validation";

export type IGetChatParamsDto=z.infer<typeof getChat.params>
export type IGetChatGroupParamsDto=z.infer<typeof getChatgroup.params>
export type IGetChatQueryDto=z.infer<typeof getChat.query>
export type ICreateChatGroupDto=z.infer<typeof createGroup.body>
export interface IMainDto{

    socket:IAuthSocket;
    callback?:any;
    io?:Server;

}
export interface ISayHiDto extends IMainDto{

    message:string;


}
export interface ISendMessageDto extends IMainDto{

    content:string;
    sendTo:string


}
export interface ISendGroupMessageDto extends IMainDto{

    content:string;
    groupId:string


}
export interface IjoinRoomDto extends IMainDto{

    roomId:string;


}
export interface ITypingDto extends IMainDto{

    chatId:string;
    isTyping:boolean;


}