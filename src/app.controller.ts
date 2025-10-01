import  { resolve} from 'node:path';
import { config } from 'dotenv';
config({path:resolve("./config/.env.development")});
import type { Express,NextFunction,Request,Response } from 'express';
import  express from 'express';
import cors from 'cors'
import authController from'./modules/auth/auth.controller';
import userController from './modules/user/user.controller'
import postController from './modules/post/post.controller'
import chatController from './modules/chat/chat.controller'
import helmet from 'helmet';
import {rateLimit}from 'express-rate-limit';
import {  globalErrorHandling } from './utils/response/error.response';
import connectDB from './DB/connections.db';
import { initializeIo } from './modules/getway/getway';
import {GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql'
import {createHandler}from "graphql-http/lib/use/express"
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
const schema=new GraphQLSchema({
   query:new GraphQLObjectType({
      name:"mainQueryName",
      fields:{
         sayHi:{
            type:GraphQLString,
            resolve:()=>{
               return "Hello GraphQl"
            },
         },
      },
   }),
});
app.all("/graphql",createHandler({schema}))
// Define your routes here
app.get('/',(req:Request,res:Response,next:NextFunction)=>{
   return res.status(200).json({
    message:"Welcome to the Social App API"
   })
   

})
app.use("/auth",authController)
app.use("/user",userController)
app.use("/post",postController)
app.use("/chat",chatController)
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

initializeIo(httpServer)



}

export default bootstrap