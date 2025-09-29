import {  Request, Response } from "express";
import { IGetChatGroupParamsDto, IGetChatParamsDto, IGetChatQueryDto, IjoinRoomDto, ISayHiDto, ISendGroupMessageDto, ISendMessageDto, ITypingDto } from "./chat.dto";
import { ChatRepository } from "../../DB/repository/chat.repository";
import { CHatModel } from "../../DB/model/chat.model";
import { Types } from "mongoose";
import { BadReauest, Notfound } from "../../utils/response/error.response";
import { UserModel } from './../../DB/model/User.model';
import { UserRepository } from "../../DB/repository/user.reository";
import { FriendRequestModel } from "../../DB/model/friendRequest.model";
import { FriendRequestRepository } from "../../DB/repository/friendRequest.repository";
import { connectedSocket } from "../getway/getway";
import { v4 as uuid } from "uuid";

export class ChatService{
    private chatModel:ChatRepository=new ChatRepository(CHatModel)
    private userModel:UserRepository=new UserRepository(UserModel)
    private friendRequestRepo:FriendRequestRepository=new FriendRequestRepository(FriendRequestModel)
constructor(){}
//Rest
getChat=async(req:Request,res:Response,):Promise<Response>=>{
    const {userId}=req.params as IGetChatParamsDto
    const {page,size}:IGetChatQueryDto=req.query 
    const chat = await this.chatModel.findOneChat({
        filter:{
            participants:{
                $all:[req.user?._id as Types.ObjectId,
                    Types.ObjectId.createFromHexString(userId)]
            },
            group:{$exists:false}
        },
        options:{
            populate:[{path:"participants",select:"firstName lastName email "}],

        },
        page:page?Number(page):1,
        size:size ? Number(size) : 5
        
        
      })
    if(!chat){
        throw new BadReauest("chat not found")
    }


    return res.status(200).json({
        message:"get chat",
        data:{chat}
    })

}
getChatgroup=async(req:Request,res:Response,):Promise<Response>=>{
    const {groupId}=req.params as IGetChatGroupParamsDto
    const {page,size}:IGetChatQueryDto=req.query 
    const chat = await this.chatModel.findOneChat({
        filter:{
          _id:Types.ObjectId.createFromHexString(groupId),
            participants:{
                $in:req.user?._id as Types.ObjectId
            },
            group:{$exists:true}
        },
        options:{
            populate:[{path:"messages.createdBy",select:"firstName lastName email "}],

        },
        page:page?Number(page):1,
        size:size ? Number(size) : 5
        
        
      })
    if(!chat){
        throw new BadReauest("chat not found")
    }


    return res.status(200).json({
        message:"get chat",
        data:{chat}
    })

}
createGroup = async (req: Request, res: Response): Promise<Response> => {
  const { group, participants }: any = req.body;

  const dbparticipants = participants.map((participant: string) =>
    Types.ObjectId.createFromHexString(participant)
  );

  const users = await this.userModel.find({
    filter: {
      _id: { $in: dbparticipants },
      friends: { $in: [req.user?._id as Types.ObjectId] }
    }
  });

  const validIds = users.map((u: any) => u._id.toString());

  const invalidParticipants = participants.filter(
    (p: string) => !validIds.includes(p)
  );

  if (invalidParticipants.length > 0) {
    return res.status(400).json({
      error: "invalid participants",
      invalidParticipants
    });
  }

  dbparticipants.push(req.user?._id as Types.ObjectId);

  const roomId = group.replaceAll(/\s+/g, "_") + "_" + uuid();

  const newGroup =
    (await this.chatModel.create({
      data: {
        createdBy: req.user?._id as Types.ObjectId,
        group,
        roomId,
        messages: [],
        participants: dbparticipants
      }
    }));

  if (!newGroup) {
    throw new BadReauest("fail to create group");
  }

  return res.status(201).json({
    message: "group created",
    data: { group: newGroup }
  });
};

sendMessage = async ({ content, sendTo, socket, io }: ISendMessageDto) => {
  try {
    const createdBy = socket.credentials?.user._id as Types.ObjectId;
    console.log({ content, sendTo, createdBy });

    const targetUser = await this.userModel.findOne({
      filter: {
        _id: Types.ObjectId.createFromHexString(sendTo),
      },
    });

    if (!targetUser) throw new Notfound("invalid user id or you are not friend");

    const acceptedFriendship = await this.friendRequestRepo.findOne({
      filter: {
        acceptedAt: { $exists: true },
        $or: [
          { createdBy: createdBy, sendTo: Types.ObjectId.createFromHexString(sendTo) },
          { createdBy: Types.ObjectId.createFromHexString(sendTo), sendTo: createdBy },
        ],
      },
    });

    if (!acceptedFriendship) throw new Notfound("invalid user id or you are not friend");

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
      const newChat = await this.chatModel.create({
        data: {
          createdBy,
          messages: [{ content, createdBy }],
          participants: [
            createdBy as Types.ObjectId,
            Types.ObjectId.createFromHexString(sendTo),
          ],
        },
      });

      if (!newChat) {
        throw new BadReauest("fail to create chat");
      }
    }
    io?.to(connectedSocket.get(createdBy.toString()as string)as string[]).emit("successMessage",{content})
    io?.to(connectedSocket.get(sendTo)as string[]).emit("newMessage",{content,from:socket.credentials?.user})
    
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return socket.emit("custom_error", { message });
  }
};
joinRoom = async ({  roomId,socket, io }: IjoinRoomDto) => {
  try {

    const chat=await this.chatModel.findOne({
      filter:{
        roomId,group:{$exists:true},
        participants:{$in:socket.credentials?.user._id as Types.ObjectId}
      }
    })
    if(!chat) throw new Notfound("invalid room id or you are not member in this room")
      socket.join(chat.roomId as string)
      return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    socket.emit("custom_error", { message });
    return false;
  }
};

sayHi = ({ message, socket, callback, io }: ISayHiDto) => {
  try {
    console.log({ message });

    if (callback) {
      callback("BE To FE");
      callback("hello BE from FE");
    }
    
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    socket.emit("custom_error", { message });
    return false;
  }
}
sendGroupMessage = async ({ content, groupId, socket, io }: ISendGroupMessageDto) => {
  try {
  const createdBy=socket.credentials?.user._id as Types.ObjectId
    const chat = await this.chatModel.findOneAndUpdate({
      filter: {
        _id:Types.ObjectId.createFromHexString(groupId),
        participants: {
         $in:createdBy as Types.ObjectId
      
        },
        group: { $exists: true },
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
      throw new BadReauest("fail to find match room")
    }
    io?.to(connectedSocket.get(createdBy.toString()as string)as string[]).emit("successMessage",{content})
    io?.to(chat.roomId as string).emit("newMessage",{content,from:socket.credentials?.user,groupId})
    
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return socket.emit("custom_error", { message });
  }
};

handleTyping = ({ chatId, isTyping, socket, io }: ITypingDto) => {
  try {
    const userId = socket.credentials?.user._id?.toString();
    const userName = `${socket.credentials?.user.firstName} ${socket.credentials?.user.lastName}`;
    
    if (!userId) {
      throw new BadReauest("User not authenticated");
    }

    io?.emit("typing_status", {
      chatId,
      userId,
      userName,
      isTyping,
      user: {
        _id: socket.credentials?.user._id,
        firstName: socket.credentials?.user.firstName,
        lastName: socket.credentials?.user.lastName,
        profileImage: socket.credentials?.user.profileImage
      }
    });

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return socket.emit("custom_error", { message });
  }
};



}