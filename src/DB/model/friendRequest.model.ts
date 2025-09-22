import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IfriendRequest {
createdBy:Types.ObjectId
sendTo:Types.ObjectId
acceptedAt?:Date


    
    createdAt:Date
    updatedAt?:Date
      

}
export type HPostDocument=HydratedDocument<IfriendRequest>
const friendRequestSchema=new Schema<IfriendRequest>(
{
createdBy:{type:Schema.Types.ObjectId,ref:"User"},
sendTo:{type:Schema.Types.ObjectId,ref:"User"},
acceptedAt:Date,


   


},{
    timestamps:true,
    strictQuery:true
 })







export const FriendRequestModel= models.FriendRequest||model<IfriendRequest>("FriendRequest",friendRequestSchema)