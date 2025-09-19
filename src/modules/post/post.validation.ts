import {z}from 'zod'
import { allowCommentsEnum, availabilityEnum } from '../../DB/model/post.model'
export const createPost={

    body:z.strictObject({
        content:z.string().min(2).max(50000).optional(),
        attachments:z.array(z.any()).max(2).optional(),
        availability:z.enum(availabilityEnum).default(availabilityEnum.public),
        allowComments:z.enum(allowCommentsEnum).default(allowCommentsEnum.allow),
        tags:z.array(z.string()).max(10).optional()


    }).superRefine((data,ctx)=>{
         if(!data.attachments?.length && !data.content){
            ctx.addIssue({
                code:"custom",
                path:['content'],
                message:"Post must have either content or attachments"
            })
         }
         if(data.tags?.length && data.tags.length !== [...new Set(data.tags)].length){
            ctx.addIssue({
                code:"custom",
                path:["tags"],
                message:"duplicated tagged users"
            })
         }
    })
}
export const likePost={

    params:z.strictObject({
        postId:z.string()
    })
}