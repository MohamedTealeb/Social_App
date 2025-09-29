import { IAuthSocket } from "../getway/getway.interface";
import { ChatEvent } from "./chat.event";
import { Server } from "socket.io";



export class ChatGateway{
    private ChatEvent:ChatEvent=new ChatEvent();

constructor(){}


register=(socket:IAuthSocket,io:Server)=>{
    this.ChatEvent.sayHi(socket,io)
    this.ChatEvent.sendMessage(socket,io)
    this.ChatEvent.joinRoom(socket,io)
    this.ChatEvent.sendGroupMessage(socket,io)
    this.ChatEvent.handleTyping(socket,io)
   
}

}