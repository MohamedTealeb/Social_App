import {email, z} from "zod"


export const signup={
    body:z.object({
        username:z.string().min(2).max(20),
        email:z.email(),
        password:z.string(),
        confirmPassword:z.string()
    }).refine(data=>{
        return data.password === data.confirmPassword
    },{
        error:"Passwords do not match"
    }),
}