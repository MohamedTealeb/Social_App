import { Server } from "socket.io";
import { IAuthSocket } from "../getway/getway.interface";
import {z}from 'zod'
import { getChat } from "./chat.validation";

export type IGetChatParamsDto=z.infer<typeof getChat>
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