import type { Request,Response } from 'express';
import { IConfirmEmail, ILoginBody, ISignupBody } from './dto/auth.dto';
// import {  BadReauest } from '../../utils/response/error.response';
import {  UserModel } from '../../DB/model/User.model';
import { BadReauest, ConflictException, Notfound } from '../../utils/response/error.response';
import { UserRepository } from '../../DB/repository/user.reository';
import { CompareHash, generateHash } from '../../utils/security/hash.security';
import { emailEvent } from '../../utils/event/email.event';
import { generateNumberOtp } from '../../utils/otp';
import { generarteToken } from '../../utils/security/token.security';
class AuthenticationService{
    private  userModel =new UserRepository(UserModel)
    constructor(){}

    /**
     * 
     *  @param req Exress.Request
     *  @param res Express.Response
     *  @return Promise<Express.Response>
     *  @example()
     * return {messae: "Done",status:201,data:{}}
     */
        signup=async(req:Request,res:Response):Promise<Response>=>{
        
     
           let {firstName,lastName,email,password}:ISignupBody=req.body
            console.log({firstName,lastName,email,password})
            const checkUserExist=await this.userModel.findOne({
                filter:{email},
                select:"email"
            })
            if(checkUserExist){
                throw new ConflictException("email already exists")
            }
            const otp=generateNumberOtp()
            
            const user=await this.userModel.creaeUser({
                data:[{firstName,lastName,email,password:await generateHash(password),confrimEmailOtp:await generateHash(String(otp))}]
            })

        if(!user){
            throw new BadReauest("fail")
        }
       emailEvent.emit("confirmEmail",{
            to:email,
          otp
        })
            // throw new BadReauest("Fail in auth",400);
            return res.status(201).json({
                message:"User created successfully",
                data:{user}
            })
        }
        login=async(req:Request,res:Response):Promise<Response>=>{

            const{email ,password}:ILoginBody=req.body
            const user=await this.userModel.findOne({
                filter:{email}
            })
            if(!user){
                throw new Notfound("invalid login data")
            }
            if(!user.confirmAt){
                throw new BadReauest("verify your acc first") 
            }
            if(!(await CompareHash(password,user.password) ) ){
                throw new Notfound("invalid login data")
            }

             const access_token=await generarteToken({
                payload: {_id:user._id},
            });
             const refresh_token=await generarteToken({
                payload:{_id:user._id},
                secret:process.env.REFRESH_USER_TOKEN_SIGNATURE as string,
                options:{expiresIn:Number(process.env.REFRESH_TOKEN_EXPIRES_IN)}
             })


            return res.status(200).json({
                message:"Done",
                data:{Credentials:{
                    access_token,refresh_token
                }}
            })
        }
        confirmEmail=async(req:Request,res:Response):Promise<Response>=>{

            const {email,otp}:IConfirmEmail=req.body
            const user=await this.userModel.findOne({
                filter:{email,confrimEmailOtp:{$exists:true},confirmAt:{$exists:false}},
               
            })
            if(!user){
                throw new Notfound("Invalid account")
            }
            if(!await CompareHash(otp,user.confrimEmailOtp as string)){
                throw new ConflictException("Invalid confirmation code")
            }
            await this.userModel.updateOne({
                filter:{email},
                update:{
                    confirmAt:new Date(),
                    $unset:{
                        confrimEmailOtp:true
                    }
                },
            })
            return res.status(200).json({
                message:"Done",
                data:req.body
            })
        }
        
    }

export default new AuthenticationService()