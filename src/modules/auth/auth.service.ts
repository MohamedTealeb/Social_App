import type { Request,Response } from 'express';
import { ISignupBody } from './dto/auth.dto';
// import {  BadReauest } from '../../utils/response/error.response';
import {  UserModel } from '../../DB/model/User.model';
import { BadReauest, ConflictException } from '../../utils/response/error.response';
import { UserRepository } from '../../DB/repository/user.reository';
class AuthenticationService{
    private  userModel =new UserRepository(UserModel)
    constructor(){}

    /**
     * 
     *  @param req Exress.Request
     *  @param res Express.Response
     *  @return Promise<Express.Response>
     *  @example()
     * return {messae: "Done",status:201,data:{}}
     */
        signup=async(req:Request,res:Response):Promise<Response>=>{
        
     
           let {firstName,lastName,email,password}:ISignupBody=req.body
            console.log({firstName,lastName,email,password})
            const checkUserExist=await this.userModel.findOne({
                filter:{email},
                select:"email"
            })
            if(checkUserExist){
                throw new ConflictException("email already exists")
            }
            
            const user=await this.userModel.creaeUser({
                data:[{firstName,lastName,email,password}]
            })

        if(!user){
            throw new BadReauest("fail")
        }
            // throw new BadReauest("Fail in auth",400);
            return res.status(201).json({
                message:"User created successfully",
                data:{user}
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