import { IAuthSocket } from "../getway/getway.interface";
import { ChatEvent } from "./chat.event";
import { Server } from "socket.io";



export class ChatGateway{
    private ChatEvent:ChatEvent=new ChatEvent();

constructor(){}


register=(socket:IAuthSocket,io:Server)=>{
    this.ChatEvent.sayHi(socket,io)
   
}

}