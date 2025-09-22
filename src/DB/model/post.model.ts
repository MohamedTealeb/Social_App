import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export enum allowCommentsEnum {
allow="allow",
deny="deny"

}
export enum availabilityEnum {
public="public",
friends="friends",
onlyMe="only-me"

}

export interface IPost {
    content?:string;
    attachements?:string[];
    assetsFolderId?:string
    availability?:availabilityEnum
    allowComments?:allowCommentsEnum;
    tags?:Types.ObjectId[]
    likes?:Types.ObjectId[]
    createdBy?:Types.ObjectId
    freezedBy?:Types.ObjectId
    freezedAt?:Date
    restoredAt?:Date
    restoredBy?:Types.ObjectId
    createdAt?:Date
    updatedAt?:Date
      

}
export type HPostDocument=HydratedDocument<IPost>
const postSchema=new Schema<IPost>(
{

  content:
  {
    type:String,minlength:2,maxlength:50000
  },
    attachements:[String],
    assetsFolderId:{type:String},
    availability:{type:String,enum:availabilityEnum ,default:availabilityEnum.public},
    allowComments:{type:String,enum:allowCommentsEnum ,default:allowCommentsEnum.allow},
    tags:[{type:Schema.Types.ObjectId,ref:"User"}],
    likes:[{type:Schema.Types.ObjectId,ref:"User"}],
    createdBy:{type:Schema.Types.ObjectId,ref:"User"},
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

postSchema.virtual("comments",{
  ref:"Comment",
  localField:"_id",
  foreignField:"postId",
  justOne:false
})

export const PostModel= models.Post||model<IPost>("Post",postSchema)