import {z} from "zod"
import { generalFields } from "../../middleware/validation.middleware"


export const signup={
    // query:z.strictObject({
    //     flag:z.string({error:"flag is required"}).min(2).max(20)
    // }),


    body:z.strictObject({
        username:generalFields.username,
        email:generalFields.email,
        password:generalFields.password,
        confirmPassword:generalFields.confirmPassword,
        phone:z.string().optional(),
    }).refine(data=>{
        return data.password === data.confirmPassword
    },{
        error:"Passwords do not match"
    }),
}

export const login={
    body:z.strictObject({
        email:generalFields,
        password:generalFields.password,
       confirmPassword:generalFields.confirmPassword,
    })
}