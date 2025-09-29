import { IAuthSocket } from "../getway/getway.interface";
import { ChatService } from "./chat.service";
import { Server } from "socket.io";

export class ChatEvent{
  private  chatService:ChatService=new ChatService()

constructor(){}


sayHi=(socket:IAuthSocket,io:Server)=>{
    return socket.on("sayHi",(message:string,callback)=>{
        this.chatService.sayHi({message,socket,callback,io})
      
        
    })
}

sendMessage=(socket:IAuthSocket,io:Server)=>{
    return socket.on("sendMessage",(data:{content:string; sendTo:string})=>{
        this.chatService.sendMessage({...data,socket,io})
      
        
    })
}



}