import {  Request, Response } from "express";
import { ILpogoutDto } from "./user.dto";

import { UpdateQuery } from "mongoose";
import { HUserDocument, IUser, UserModel } from "../../DB/model/User.model";
import { UserRepository } from "../../DB/repository/user.reository";
// import { TokenRepository } from "../../DB/repository/token.repository";
// import { TokenModel } from "../../DB/model/Token.model";
import { createLoginCredentaails, createRevokeToken, LogoutEnum } from '../../utils/security/token.security';
import { JwtPayload } from "jsonwebtoken";
// import { uploadFile } from "multer/s3.config";
import { PostModel } from './../../DB/model/post.model';
import { PostRepository } from "../../DB/repository/post.repository";
import { FriendRequestRepository } from "../../DB/repository/friendRequest.repository";
import { FriendRequestModel } from "../../DB/model/friendRequest.model";
import { Types } from "mongoose";
import { BadReauest, ConflictException, Notfound } from "../../utils/response/error.response"
 


 class UserService {
    private userModel=new UserRepository(UserModel)
    private postModel=new PostRepository(PostModel)
    private friendRequestModel=new FriendRequestRepository(FriendRequestModel)
    // private tokenModel=new TokenRepository(TokenModel)
    constructor(){}


    profile=async(req:Request,res:Response):Promise<Response>=>{
           
        const profile=await this.userModel.findOne({filter:{_id:req.user?._id}})
        if(!profile){
            throw new Notfound("profile not found")
        }

        // Get friends from friend requests
        const friendRequests = await this.friendRequestModel.find({
            filter: {
                $or: [
                    { createdBy: req.user?._id, acceptedAt: { $exists: true } },
                    { sendTo: req.user?._id, acceptedAt: { $exists: true } }
                ]
            },
            options: {
                populate: [
                    { path: "createdBy", select: "firstName lastName email" },
                    { path: "sendTo", select: "firstName lastName email" }
                ]
            }
        });

        // Extract friends from the requests
        const friends = friendRequests.map(request => {
            // If I sent the request, the friend is sendTo
            if (request.createdBy._id.toString() === req.user?._id.toString()) {
                return request.sendTo;
            }
            // If I received the request, the friend is createdBy
            return request.createdBy;
        });

        return res.json({
            message:"Done",
            date:{
                user: profile,
                friends: friends
            }
        })
    }
    dashboard=async(req:Request,res:Response):Promise<Response>=>{
           
       const result=await Promise.allSettled([this.userModel.find({filter:{}}),this.postModel.find({filter:{}})])
        return res.json({
            message:"Done",
            date:{
               
                   result
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
    friendRequest=async(req:Request,res:Response):Promise<Response>=>{
        const {userId}=req.params as unknown as {userId:Types.ObjectId}
        const checkFriendRequest=await this.friendRequestModel.findOne({filter:{
            createdBy:{$in:[ req.user?._id ,userId]},
            sendTo:{$in:[req.user?._id,userId]}
        }}
        )
            if(checkFriendRequest){
                throw new ConflictException("friend request already exist")
            }
            const user= await this.userModel.findOne({filter:{_id:userId}})
            if(!user){
                throw new Notfound("user not found")
            }
            const [friendRequest]=await this.friendRequestModel.create({data:[{
                createdBy:req.user?._id as Types.ObjectId,
                sendTo:userId as Types.ObjectId
            }]})||[]
            if(!friendRequest){
                throw new BadReauest("fail to create friend request")
            }
        return res.status(201).json({
            message:"Done",
           status:201,
           data:{
            friendRequest
           }
        })
    }
    acceptFriendRequest=async(req:Request,res:Response):Promise<Response>=>{
        const {requestId}=req.params as unknown as {requestId:Types.ObjectId}
        const FriendRequest=await this.friendRequestModel.findOneAndUpdate({filter:{
            _id:requestId,
            sendTo:req.user?._id,
            acceptedAt:{$exists:false}

        },update:{acceptedAt:new Date()}}
        )
            if(!FriendRequest){
                throw new ConflictException("friend request not found")
            }
           await Promise.all([
            this.userModel.updateOne({filter:{_id:this.friendRequest.createdBy},update:{ $addToSet:{friends:FriendRequest.sendTo}}}),
            this.userModel.updateOne({filter:{_id:FriendRequest.sendTo},update:{ $addToSet:{friends:FriendRequest.createdBy}}}),
           ])
        return res.status(201).json({
            message:"accepted friend request",
           status:201,
          res:FriendRequest
        })
    }

 }
 export default new UserService()