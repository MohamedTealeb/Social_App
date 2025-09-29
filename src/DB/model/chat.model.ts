import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export  interface IMessage{
content:string
createdBy:Types.ObjectId
createdAt?:Date
updatedAt?:Date

}
export type HMeesageDocument=HydratedDocument<IMessage>

export interface IChat {
  //OVO
participants:Types.ObjectId[]
messages:IMessage[]
//ovm
group?:string
group_image?:string
roomId?:string

createdBy:Types.ObjectId
createdAt?:Date
updatedAt?:Date


}
export type HChatDocument=HydratedDocument<IChat>
const messageSchema=new Schema<IMessage>({
  content:{type:String,required:true,minlength:3,maxlength:10000},
  createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true},


},{
  timestamps:true,
})


const chatSchema=new Schema<IChat>({
participants:[{type:Schema.Types.ObjectId,ref:"User",required:true}],
createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true},
group:{type:String},
group_image:{type:String},
roomId:{type:String,required:function(){
  return this.roomId
}},
messages:[messageSchema]
},{
    timestamps:true,
}






)
export const CHatModel=models.Chat||model<IChat>("Chat",chatSchema)