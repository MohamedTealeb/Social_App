import type { Request, Response, NextFunction } from 'express';
import { decodeToken, TokenEnum } from '../utils/security/token.security';
import { BadReauest, ForbiddenException } from '../utils/response/error.response';
import { RoleEnum } from '../DB/model/User.model';

export const authentication =(tokenType:TokenEnum=TokenEnum.access)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
       
        if(!req.headers.authorization){
            throw new BadReauest("validation error",{
                  key:"headers",
                issues:[{path:"authorization",message:"missing authorization"}]
            }
              )
        }
         const{user,decoded}=await decodeToken({authorization:req.headers.authorization,tokenType})
         req.user=user
         req.decoded=decoded
        next()
    }
}
export const authorization =(accessRoles:RoleEnum[]=[],tokenType:TokenEnum=TokenEnum.access)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
       
        if(!req.headers.authorization){
            throw new BadReauest("validation error",{
                  key:"headers",
                issues:[{path:"authorization",message:"missing authorization"}]
            }
              )
        }
         const{user,decoded}=await decodeToken({authorization:req.headers.authorization,tokenType})
         if(!accessRoles.includes(user.role)){
            throw new ForbiddenException("Not authorized acc")

         }
         req.user=user
         req.decoded=decoded
        next()
    }
}