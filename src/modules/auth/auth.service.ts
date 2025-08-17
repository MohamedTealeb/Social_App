import type { NextFunction,Request,Response } from 'express';
class AuthenticationService{
    constructor(){}
        signup=(req:Request,res:Response,next:NextFunction):Response=>{
            return res.status(201).json({
                message:"Done",
                data:req.body
            })
        }
        login=(req:Request,res:Response,next:NextFunction):Response=>{
            return res.status(200).json({
                message:"Done",
                data:req.body
            })
        }
        
    }

export default new AuthenticationService()