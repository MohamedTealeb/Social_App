import  { resolve} from 'node:path';
import { config } from 'dotenv';
config({path:resolve("./config/.env.development")});
import type { Express,NextFunction,Request,Response } from 'express';
import  express from 'express';
import cors from 'cors'
import authController from'./modules/auth/auth.controller';
import helmet from 'helmet';
import {rateLimit}from 'express-rate-limit';
import { globalErrorHandling } from './utils/response/error.response';
import connectDB from './DB/connections.db';





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
app.use('{/*dummy}',(req:Request,res:Response,next:NextFunction)=>{
   return res.status(404).json({
      error:"Not Found",
      message:"The requested resource was not found on this server."
   })
})
await connectDB()
app.use(globalErrorHandling)
app.listen(port,()=>{
console.log(`Server is running on port ${port} `);})
}

export default bootstrap