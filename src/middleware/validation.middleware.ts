import type { NextFunction, Request, Response } from 'express';

import { ZodType } from 'zod';
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