import {z}from 'zod'
export const createComment={
params:z.strictObject({
    postId:z.string()
}),
    body:z.strictObject({
        content:z.string().min(2).max(50000).optional(),
        attachments:z.array(z.any()).max(2).optional(),
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
export const replyComment={
    params:z.strictObject({
        postId:z.string(),
        commentId:z.string()
    }),
    body:z.strictObject({
        content:z.string().min(2).max(50000).optional(),
        attachments:z.array(z.any()).max(2).optional(),
        tags:z.array(z.string()).max(10).optional()
    }).optional().default({}).superRefine((data,ctx)=>{
        if(!data.attachments?.length && !data.content){
           ctx.addIssue({
               code:"custom",
               path:['content'],
               message:"Reply must have either content or attachments"
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