import type { Request,Response } from 'express';
import { ISignupBodyInputs } from './dto/auth.dto';
// import {  BadReauest } from '../../utils/response/error.response';
import * as validators from './auth.validation'
class AuthenticationService{
    constructor(){}
        signup=(req:Request,res:Response):Response=>{
            try{
validators.signup.body.parse(req.body);

            }catch(error:any){
                return res.status(201).json({
                    error,messsage:JSON.parse(error)
                })
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