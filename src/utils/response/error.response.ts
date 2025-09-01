import type { NextFunction,Request,Response } from 'express';
interface IError extends Error {

 statusCode:number
}


export class  AppError extends Error {
    constructor(
        public override message:string,
        public statusCode:number,
        public override cause: unknown
    ){
        super(message)
        this.name=this.constructor.name
        Error.captureStackTrace(this,this.constructor)
    }
}
export class BadReauest extends AppError{
    constructor(message:string,cause?:unknown){
        super(message,400,cause)
    }
}
export class Notfound extends AppError{
    constructor(message:string,cause?:unknown){
        super(message,404,cause)
    }
}
export class ConflictException extends AppError{
    constructor(message:string,cause?:unknown){
        super(message,409,cause)
    }
}
export const globalErrorHandling = (error:IError,req:Request,res:Response,next:NextFunction)=>{
   
   return res.status(error.statusCode||500).json({
      errror_message:error.message||"something went wrong",
      stack:process.env.MOOD==="development"?error.stack:undefined,
      cause:error.cause,
   })
}
export class UnauthorizedException extends AppError{
    constructor(message:string,cause?:unknown){
        super(message,401,cause)
    }
}
export class ForbiddenException extends AppError{
    constructor(message:string,cause?:unknown){
        super(message,403,cause)
    }
}