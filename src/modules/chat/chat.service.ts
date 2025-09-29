import {  Request, Response } from "express";
import { IGetChatParamsDto, ISayHiDto, ISendMessageDto } from "./chat.dto";
import { ChatRepository } from "../../DB/repository/chat.repository";
import { CHatModel } from "../../DB/model/chat.model";
import { Types } from "mongoose";
import { BadReauest, Notfound } from "../../utils/response/error.response";
import { UserModel } from './../../DB/model/User.model';
import { UserRepository } from "../../DB/repository/user.reository";
import { connectedSocket } from "../getway/getway";

export class ChatService{
    private chatModel:ChatRepository=new ChatRepository(CHatModel)
    private userModel:UserRepository=new UserRepository(UserModel)
constructor(){}
//Rest
getChat=async(req:Request,res:Response,):Promise<Response>=>{
    const {userId}=req.params as IGetChatParamsDto
    const chat = await this.chatModel.findOne({
        filter:{
            participants:{
                $all:[req.user?._id as Types.ObjectId,
                    Types.ObjectId.createFromHexString(userId)]
            },
            group:{$exists:false}
        },
        options:{
            populate:[{path:"participants",select:"firstName lastName email "}],
        }
        
        
      })
    if(!chat){
        throw new BadReauest("chat not found")
    }


    return res.status(200).json({
        message:"get chat",
        data:{chat}
    })

}

sendMessage = async ({ content, sendTo, socket, io }: ISendMessageDto) => {
  try {
    const createdBy = socket.credentials?.user._id as Types.ObjectId;
    console.log({ content, sendTo, createdBy });

  const user = await this.userModel.findOne({
  _id: Types.ObjectId.createFromHexString(sendTo),
  friends: { $in: [createdBy] },
});


    if (!user) throw new Notfound("invalid user id or you are not friend");

    const chat = await this.chatModel.findOneAndUpdate({
      filter: {
        participants: {
          $all: [
            createdBy as Types.ObjectId,
            Types.ObjectId.createFromHexString(sendTo),
          ],
        },
        group: { $exists: false },
      },
      update: {
        $addToSet: {
          messages: {
            content,
            createdBy,
          },
        },
      },
    });

    if (!chat) {
      const [newChat] =
        (await this.chatModel.create({
          data: [
            {
              createdBy,
              messages: [{ content, createdBy }],
              participants: [
                createdBy as Types.ObjectId,
                Types.ObjectId.createFromHexString(sendTo),
              ],
            },
          ],
        })) || [];

      if (!newChat) {
        throw new BadReauest("fail to create chat");
      }
    }
    io?.to(connectedSocket.get(createdBy.toString()as string)as string[]).emit("successMessage",{content})
    io?.to(connectedSocket.get(sendTo)as string[]).emit("newMessage",{content,from:socket.credentials?.user})
  } catch (error) {
    return socket.emit("custom_error", error);
  }
};

sayHi = ({ message, socket, callback, io }: ISayHiDto) => {
  try {
    console.log({ message });

    if (callback) {
      callback("BE To FE");
      callback("hello BE from FE");
    }
  } catch (error) {
    return socket.emit("custom_error", error);
  }
}

}