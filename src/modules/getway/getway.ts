
import {Server as HttpServer } from 'node:http'
import { Server } from 'socket.io';
import { decodeToken,TokenEnum } from '../../utils/security/token.security';
import {IAuthSocket} from './getway.interface';
import { ChatGateway } from '../chat/chat.gateway';
import { BadReauest } from '../../utils/response/error.response';
const connectedSocket =new Map<string,string[]>();
let io:undefined|Server=undefined

export const initializeIo=(httpServer:HttpServer)=>{


 io=new Server(httpServer,{
   cors:{
      origin:"*",
   }
})
getIo().use(async(socket:IAuthSocket,next)=>{
   try{
 const {user,decoded}=
 await decodeToken({
   authorization :socket.handshake?.auth.authorization  || "" ,
   tokenType:TokenEnum.access
 })
 const usertaps=connectedSocket.get(user._id.toString())||[]
 usertaps.push(socket.id)
 console.log({usertaps});
 
 connectedSocket.set(user._id.toString(),usertaps)
 socket.credentials={user,decoded}
   next()


      // next(new BadReauest("fail in authentication middleware"))
   }catch(error:any){
   console.error("Socket auth failed:", error.message);
   } 

})

// disconnection
function disconnection(socket:IAuthSocket){
    return   socket.on("disconnect", () => {
   // connectedSocket.delete(socket.credentials?.user._id?.toString() as string)
   const userId=socket.credentials?.user._id?.toString() as string
   let reminingTabs=connectedSocket.get(userId)?.filter((tab:string)=>{
return tab!==socket.id
   })||[]
   if(reminingTabs?.length){
      connectedSocket.set(userId,reminingTabs)
   }
   else{
      connectedSocket.delete(userId)
      getIo().emit("offline_user", userId);
   }
   
   console.log({after_Disconnect:connectedSocket});
   
   getIo().emit("offline_user", { userId: socket.credentials?.user._id?.toString() });
    console.log("A user disconnected:", socket.id);
  });


}
const chatGateway:ChatGateway=new ChatGateway()
getIo().on('connection',(socket:IAuthSocket)=>{
  
chatGateway.register(socket,getIo())
disconnection(socket)

   
   
})



}
export const getIo=():Server=>{
if(!io) throw new BadReauest("Io not initialized")
return io

}