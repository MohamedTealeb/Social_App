import  type{Secret, SignOptions} from 'jsonwebtoken'
import {sign} from 'jsonwebtoken'

export const generarteToken=async({payload,secret=process.env.ACCESS_USER_TOKEN_SIGNATURE as string,options={expiresIn:Number(process.env.ACCESS_TOKEN_EXPIRES_IN)}}:{
 payload:object,
 secret?:Secret,
 options?:SignOptions
}):Promise<string>=>{

    return sign(payload,secret,options)
}