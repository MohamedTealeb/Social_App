import  { resolve} from 'node:path';
import { config } from 'dotenv';
config({path:resolve("./config/.env.development")});
import type { Express,NextFunction,Request,Response } from 'express';
import  express from 'express';
import cors from 'cors'
import authController from'./modules/auth/auth.controller';
import userController from './modules/user/user.controller'
import postController from './modules/post/post.controller'
import helmet from 'helmet';
import {rateLimit}from 'express-rate-limit';
import {  globalErrorHandling } from './utils/response/error.response';
import connectDB from './DB/connections.db';
import { Server, Socket } from 'socket.io';
import { decodeToken, TokenEnum } from './utils/security/token.security';
import { HUserDocument } from './DB/model/User.model';
import { JwtPayload } from 'jsonwebtoken';
const connectedSocket =new Map<string,string>();
interface IAuthSocket extends Socket{

   credentials?:{
      user:Partial<HUserDocument>,
      decoded:JwtPayload
   }
}
const bootstrap=async():Promise<void>=>{
const port:number|string=process.env.PORT||5000;
const app:Express=express()
app.use(express.json());
app.use(cors())
app.use(helmet())
const limiter=rateLimit({
   windowMs:60*60000,
   limit:1000,
   message:{error:"Too many requests, please try again later."},
   statusCode:429
})
app.use(limiter)
// Define your routes here
app.get('/',(req:Request,res:Response,next:NextFunction)=>{
   return res.status(200).json({
    message:"Welcome to the Social App API"
   })
   

})
app.use("/auth",authController)
app.use("/user",userController)
app.use("/post",postController)
app.use('{/*dummy}',(req:Request,res:Response,next:NextFunction)=>{
   return res.status(404).json({
      error:"Not Found",
      message:"The requested resource was not found on this server."
   })
})

app.use(globalErrorHandling)

await connectDB()

//hoooks
// async function test() {
   
   
// }
 const httpServer=app.listen(port,()=>{
console.log(`Server is running on port ${port} `);})

const io=new Server(httpServer,{
   cors:{
      origin:"*",
   }
})
io.use(async(socket:IAuthSocket,next)=>{
   try{
 const {user,decoded}=
 await decodeToken({
   authorization:socket.handshake?.auth.authoriztion || "" ,
   tokenType:TokenEnum.access
 })
 connectedSocket.set(user._id.toString(),socket.id)
 socket.credentials={user,decoded}
   next()


      // next(new BadReauest("fail in authentication middleware"))
   }catch(error:any){
      next(error)
   } 

})

io.on('connection',(socket:IAuthSocket)=>{
   // console.log("A user connected");
   // console.log({connectedSocket})
   // connectedSocket.push(socket.id)
   console.log("public,socket",socket.credentials?.user._id?.toString());

   socket.emit("sayHi", {
    productId: "12345",
    message: "Hello from server"
  });

  // Handle disconnection
  socket.on("disconnect", () => {
   connectedSocket.delete(socket.credentials?.user._id?.toString() as string)
   io.emit("offline", { userId: socket.credentials?.user._id?.toString() });
    console.log("A user disconnected:", socket.id);
  });
   
   
})



}

export default bootstrap