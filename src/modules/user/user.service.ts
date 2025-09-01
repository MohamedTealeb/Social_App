import {  Request, Response } from "express";
import { ILpogoutDto } from "./user.dto";

import { UpdateQuery } from "mongoose";
import { IUser, UserModel } from "../../DB/model/User.model";
import { UserRepository } from "../../DB/repository/user.reository";
import { TokenRepository } from "../../DB/repository/token.repository";
import { TokenModel } from "../../DB/model/Token.model";
import { LogoutEnum } from '../../utils/security/token.security';

 


 class UserService {
    private userModel=new UserRepository(UserModel)
    private tokenModel=new TokenRepository(TokenModel)
    constructor(){}


    profile=async(req:Request,res:Response):Promise<Response>=>{
           

        return res.json({
            message:"Done",
            date:{
                user:req.user,
                decoded:req.decoded
            }
        })
    }
    logout=async(req:Request,res:Response):Promise<Response>=>{
           const {flag}:ILpogoutDto=req.body
           let statusCode:number=200
           const update:UpdateQuery<IUser>={}

           switch (flag){
            case LogoutEnum.all:
            update.changeCredentialTime=new Date();
            break;
            default:
                await this.tokenModel.create({
                    data:[{
                        jti:req.decoded?.jti as string,
                        expiresIn:req.decoded?.iat as number+Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
                        userId:req.decoded?._id,
                    }]
                })
                statusCode=201
                break
           }
           await this.userModel.updateOne({
            filter:{_id:req.decoded?._id},
            update
           })
        return res.status(statusCode).json({
            message:"Done",
            date:{
                user:req.user,
                decoded:req.decoded
            }
        })
    }
 }
 export default new UserService()