import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { IPost } from "./post.model";

export interface Icomment {
createdBy:Types.ObjectId
postId:Types.ObjectId |Partial<IPost>;
commentId?:Types.ObjectId


    content?:string;
    attachements?:string[];


    tags?:Types.ObjectId[]
    likes?:Types.ObjectId[]

    freezedBy?:Types.ObjectId
    freezedAt?:Date
    restoredAt?:Date
    restoredBy?:Types.ObjectId
    createdAt?:Date
    updatedAt?:Date
      

}
export type HPostDocument=HydratedDocument<Icomment>
const commentSchema=new Schema<Icomment>(
{
createdBy:{type:Schema.Types.ObjectId,ref:"User"},
postId:{type:Schema.Types.ObjectId,ref:"Post"},
commentId:{type:Schema.Types.ObjectId,ref:"Comment"},
  content:
  {
    type:String,minlength:2,maxlength:50000
  },
    attachements:[String],

    tags:[{type:Schema.Types.ObjectId,ref:"User"}],
    likes:[{type:Schema.Types.ObjectId,ref:"User"}],
    freezedBy:{type:Schema.Types.ObjectId,ref:"User"},
    freezedAt:Date,
    restoredAt:Date,
    restoredBy:{type:Schema.Types.ObjectId,ref:"User"},


},{
    timestamps:true,
    strictQuery:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
}




)
commentSchema.virtual("reply",{
  ref:"Comment",
  localField:"_id",
  foreignField:"commentId",
})


export const CommentModel= models.Comment||model<Icomment>("Comment",commentSchema)