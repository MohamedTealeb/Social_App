import  { resolve} from 'node:path';
import { config } from 'dotenv';
config({path:resolve("./config/.env.development")});
import type { Express,NextFunction,Request,Response } from 'express';
import  express from 'express';
import cors from 'cors'
import authController from'./modules/auth/auth.controller';
const bootstrap=async():Promise<void>=>{
const port:number|string=process.env.PORT||5000;
const app:Express=express()
app.use(express.json());
app.use(cors)
// Define your routes here
app.get('/',(req:Request,res:Response,next:NextFunction)=>{
   return res.status(200).json({
    message:"Welcome to the Social App API"
   })
})
app.use("/auth",authController)

app.listen(port,()=>{
console.log(`Server is running on port ${port} `);})
}

export default bootstrap