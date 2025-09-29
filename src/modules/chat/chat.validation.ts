import { get } from "http"
import {z} from "zod"

export const getChat ={
    params:z.strictObject({
        userId:z.string()
    }),
    query:z.strictObject({
        page:z.coerce.number().int().min(1).optional(),
        size:z.coerce.number().int().min(1).optional(),
    })
}
export const getChatgroup ={
    params:z.strictObject({
       groupId:z.string()
    }),
    query:getChat.query
}

export const createGroup={

    body:z.strictObject({
       participants: z.array(z.string()).min(1),

        group:z.string().min(2).max(330),
        
    }).superRefine((data,ctx)=>{
   if(data.participants
?.length && data.participants
.length !== [...new Set(data.participants
)].length){
            ctx.addIssue({
                code:"custom",
                path:["participants"],
                message:"duplicated tagged users"
            })
         }



    })
}
