import {  Request, Response } from "express";
import { ILpogoutDto } from "./user.dto";

import { UpdateQuery } from "mongoose";
import { HUserDocument, IUser, UserModel } from "../../DB/model/User.model";
import { UserRepository } from "../../DB/repository/user.reository";
import { TokenRepository } from "../../DB/repository/token.repository";
import { TokenModel } from "../../DB/model/Token.model";
import { createLoginCredentaails, createRevokeToken, LogoutEnum } from '../../utils/security/token.security';
import { JwtPayload } from "jsonwebtoken";
// import { uploadFile } from "multer/s3.config";

 


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
    profileImage=async(req:Request,res:Response):Promise<Response>=>{
           
            // const key=await uploadFile({
            //     file:req.file as Express.Multer.File,
            //     path:`users/${req.decoded?._id}`
            // })
        return res.json({
            message:"Done",
            date:{
             file:req.file
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
         await createRevokeToken(req.decoded as JwtPayload)
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

    refreshToken=async(req:Request,res:Response):Promise<Response>=>{
        const credentials=await createLoginCredentaails(req.user as HUserDocument)
            await createRevokeToken(req.decoded as JwtPayload)
        return res.status(201).json({
            message:"Donne",
            data:{
                credentials
            }
        })
    }
 }
 export default new UserService()