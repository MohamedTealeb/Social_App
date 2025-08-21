import type { Request,Response } from 'express';
import { ISignupBodyInputs } from './dto/auth.dto';
// import {  BadReauest } from '../../utils/response/error.response';
import * as validators from './auth.validation'
class AuthenticationService{
    constructor(){}
        signup=async(req:Request,res:Response):Promise<Response>=>{
        
      const validationResult =await validators.signup.body.safeParseAsync(req.body);
            if(!validationResult.success){
                return res.json({validationResult})
            }
            
           let {username,email,password,phone,gender}:ISignupBodyInputs=req.body
            console.log({username,email,password,phone,gender})
            // throw new BadReauest("Fail in auth",400);
            return res.status(201).json({
                message:"User created successfully",
                data:req.body
            })
        }
        login=(req:Request,res:Response):Response=>{
            return res.status(200).json({
                message:"Done",
                data:req.body
            })
        }
        
    }

export default new AuthenticationService()