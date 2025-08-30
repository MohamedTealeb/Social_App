import type { NextFunction, Request, Response } from 'express';

import z, { ZodType } from 'zod';
import { GenderEnum } from '../DB/model/User.model';
type KetReqType = keyof Request
type SchemaType = Partial<Record<KetReqType,ZodType>>

export const validation =(schema:SchemaType)=>{

    return(req:Request,res:Response,next:NextFunction):Response|NextFunction=>{
const errors:{key:KetReqType,issue:{path:string|number|symbol|undefined,message:string}[]}[]=[]
        for(const key of Object.keys(schema)as KetReqType[]){
            if(!schema[key])continue
            const validationResult=schema[key]?.safeParse(req[key]);
            if(!validationResult.success){
                errors.push({key,issue:validationResult.error.issues.map(issue=>{
                    return {
                        path:issue.path[0],
                        message:issue.message
                    }
                })})
            }
        }
        if(errors.length){
            return res.status(400).json({
                message:"Validation error",
                errors
            })
        }
   return next() as unknown as NextFunction;
}
}


export const generalFields={

 username:z.string({
    error:"username is requird"
 }).min(2,{error:"min username length is 2"}).max(20,{error:"max username length is 20"}),
 firstName:z.string({
    error:"firstName is required"
 }).min(2,{error:"min firstName length is 2"}).max(50,{error:"max firstName length is 50"}),
 lastName:z.string({
    error:"lastName is required"
 }).min(2,{error:"min lastName length is 2"}).max(50,{error:"max lastName length is 50"}),
 email:z.email({
    error   :"email is requird"
 }),
 password:z.string().min(6,{error:"min password length is 6"}),
 confirmPassword:z.string(),
gender: z.nativeEnum(GenderEnum).optional(),
otp:z.string().regex(/^\d{6}$/)


}