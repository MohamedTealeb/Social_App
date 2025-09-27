import { z} from "zod"
import { generalFields } from "../../middleware/validation.middleware"


export const signup={
    // query:z.strictObject({
    //     flag:z.string({error:"flag is required"}).min(2).max(20)
    // }),


    body:z.strictObject({
        firstName:generalFields.firstName,
        lastName:generalFields.lastName,
        email:generalFields.email,
        password:generalFields.password,
        confirmPassword:generalFields.confirmPassword,
        phone:z.string().optional(),
      gender: generalFields.gender
    }).refine(data=>{
        return data.password === data.confirmPassword
    },{
        error:"Passwords do not match"
    }),
}

export const login={
    body:z.strictObject({
        email:generalFields.email,
        password:generalFields.password,
    //    confirmPassword:generalFields.confirmPassword,
    })
}
export const confirmEmail={
    body:z.strictObject({
        email:generalFields.email,
        otp:generalFields.otp
})
}

export const signupWithGmail={
    body:z.strictObject({
        idToken:z.string()
    })

}
export const sendForgotPasseordCode={
    body:z.strictObject({
        email:generalFields.email
    })

}
export const verifyForgotPasseordCode={
    body:sendForgotPasseordCode.body.extend({
        otp:generalFields.otp
    })

}
export const restForgotPasseordCode={
      body:verifyForgotPasseordCode.body.extend({
        otp:generalFields.otp,
        password:generalFields.password,
        confirmPassword:generalFields.confirmPassword
    }).refine((data)=>{
        return data.password===data.confirmPassword
    },{message:"passwoed mismatch confirmPassword ",path:['confirmPassword']})

}