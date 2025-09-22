import{v4 as uuid}from 'uuid'
import  type{JwtPayload, Secret, SignOptions} from 'jsonwebtoken'
import {sign, verify} from 'jsonwebtoken'
import { HUserDocument, RoleEnum, UserModel } from '../../DB/model/User.model'
import { BadReauest, UnauthorizedException } from '../response/error.response'
import { UserRepository } from '../../DB/repository/user.reository'
import { TokenRepository } from '../../DB/repository/token.repository'
import { HTokenDocument, TokenModel } from '../../DB/model/Token.model'
export enum SignatureLevelEnum {
    Bearer="Bearer",
    System="System"

}
export enum TokenEnum {
    access="access",
    refresh="refresh"
}
export enum LogoutEnum{
    only="only",
    all="all"
}
export const generarteToken=async({payload,secret=process.env.ACCESS_USER_TOKEN_SIGNATURE as string,options={expiresIn:Number(process.env.ACCESS_TOKEN_EXPIRES_IN)}}:{
 payload:object,
 secret?:Secret,
 options?:SignOptions
}):Promise<string>=>{

    return sign(payload,secret,options)
}
export const verifyrteToken=async({token,secret=process.env.ACCESS_USER_TOKEN_SIGNATURE as string,}:{
 token:string,
 secret?:Secret,
}):Promise<JwtPayload>=>{

    return verify(token,secret) as JwtPayload
}

export const detectSignatureLevel=async(role:RoleEnum=RoleEnum.user):Promise<SignatureLevelEnum>=>{
let signatureLevel:SignatureLevelEnum=SignatureLevelEnum.Bearer

switch(role){
    case RoleEnum.admin:
    case RoleEnum.superAdmin:
        signatureLevel=SignatureLevelEnum.System
        break;
        default:
            signatureLevel=SignatureLevelEnum.Bearer;
            break;
}
return signatureLevel
}


export const getSignature=async(signatureLevel:SignatureLevelEnum=SignatureLevelEnum.Bearer):Promise<{access_signature:string;
        refresh_signature:string}>=>{
    let signature:{access_signature:string;
        refresh_signature:string
    }={
        access_signature:"",
        refresh_signature:""
    };
switch(signatureLevel){
    case SignatureLevelEnum.System:
        signature.access_signature=process.env.ACCESS_SYSYEM_TOKEN_SIGNATURE as string;
        signature.refresh_signature=process.env.REFRESH_USER_TOKEN_SIGNATURE as string;
        break;
        default:
      signature.access_signature=process.env.ACCESS_USER_TOKEN_SIGNATURE as string;
        signature.refresh_signature=process.env.REFRESH_USER_TOKEN_SIGNATURE as string;
        break;
}
return signature

}
export const createLoginCredentaails=async(user:HUserDocument)=>{
  const signatureLevel=await detectSignatureLevel(user.role)
  const signatures=await getSignature(signatureLevel)
  const jwtid=uuid()
  const access_token=await generarteToken({
                payload: {_id:user._id},
                secret:signatures.access_signature,
                 options:{expiresIn:Number(process.env.ACCESS_TOKEN_EXPIRES_IN),jwtid}
            });
             const refresh_token=await generarteToken({
                payload:{_id:user._id},
                secret:signatures.refresh_signature,
                options:{expiresIn:Number(process.env.REFRESH_TOKEN_EXPIRES_IN),jwtid}
             })

return{access_token,refresh_token}

}

export const decodeToken=async({authorization,tokenType=TokenEnum.access}:{authorization:string; tokenType?:TokenEnum;})=>{
    const userModel=new UserRepository(UserModel)
    const tokenModel=new TokenRepository(TokenModel)
    const [bearerKey,token]=authorization.split(" ")
    if(!bearerKey ||!token){
        throw new UnauthorizedException("missing token parts")
    }
    const signatures=await getSignature(bearerKey as SignatureLevelEnum)
    const decoded=await verifyrteToken({
        token,
        secret:tokenType===TokenEnum.refresh?signatures.refresh_signature:signatures.access_signature,
    })
if(!decoded?._id||!decoded?.iat){
    throw new BadReauest("invalid token payload")
}
if(await tokenModel.findOne({
    filter:{jti:decoded.jti}
})){
    throw new UnauthorizedException("invalid or old login credentials")
}

const user =await userModel.findOne({
    filter:{
        _id:decoded._id
    }

})
if(!user){
    throw new BadReauest("not register acc")
}
if(user.changeCredentialTime?.getTime()||0>decoded.iat*1000){
    throw new UnauthorizedException("invalid or old login credentials")
}
return {user ,decoded}
}

export const createRevokeToken=async(decoded:JwtPayload):Promise<HTokenDocument>=>{
    const  tokenModel=new TokenRepository(TokenModel)
   const [result]=  await tokenModel.create({
                    data:[{
                        jti:decoded?.jti as string,
                        expiresIn:decoded?.iat as number+Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
                        userId:decoded?._id,
                    }]
                })||[]
                if(!result){
                    throw new BadReauest("fail to revoke this token")
                }
                return result

}