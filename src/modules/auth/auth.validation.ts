import {z} from "zod"


export const signup={
    // query:z.strictObject({
    //     flag:z.string({error:"flag is required"}).min(2).max(20)
    // }),


    body:z.strictObject({
        username:z.string().min(2).max(20),
        email:z.email(),
        password:z.string(),
        confirmPassword:z.string(),
        phone:z.string().optional(),
    }).refine(data=>{
        return data.password === data.confirmPassword
    },{
        error:"Passwords do not match"
    }),
}