import type { Request,Response } from 'express';
import { IConfirmEmail, IGmail, ILoginBody, ISignupBody } from './dto/auth.dto';
// import {  BadReauest } from '../../utils/response/error.response';
import {  providerEnm, UserModel } from '../../DB/model/User.model';
import { BadReauest, ConflictException, Notfound } from '../../utils/response/error.response';
import { UserRepository } from '../../DB/repository/user.reository';
import { CompareHash, generateHash } from '../../utils/security/hash.security';
import { emailEvent } from '../../utils/event/email.event';
import { generateNumberOtp } from '../../utils/otp';
import { createLoginCredentaails } from '../../utils/security/token.security';
  import {OAuth2Client,type TokenPayload}from 'google-auth-library';
class AuthenticationService{
    private  userModel =new UserRepository(UserModel)
    constructor(){}
 
    private async verifyGmailAccount(idToken:string):Promise<TokenPayload>{
        const client=new OAuth2Client();
        const ticket=await client.verifyIdToken({
            idToken,
            audience:process.env.WEB_CLIENT_IDS?.split(",")||[]
        })
        const payload=ticket.getPayload()
        if(!payload?.email_verified){
            throw new BadReauest("fail to verify google acc")
        }
        return payload
    }
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
                filter:{email,provider:providerEnm.SYSTEM}
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

const credentials=await createLoginCredentaails(user)
            return res.status(200).json({
                message:"Done",
                data:{credentials}
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
        signupWithGmail=async(req:Request,res:Response):Promise<Response>=>{
            const {idToken}:IGmail=req.body;
            const{email,family_name,given_name,picture}:TokenPayload=await this.verifyGmailAccount(idToken)
            const user=await this.userModel.findOne({
                filter:{
                    email,
                }
            })
            if(user){
                if(user.provider===providerEnm.GOOGLE){
                    return await this.LoginWithGmail(req,res)
                }
                throw new ConflictException(`Email exist with another provider ${user.provider}`)
            }
            const [newUser]=await this.userModel.create({
                data:[{firstName:given_name as string,
                    lastName:family_name as string,
                    email:email as string,
                    profileImage:picture as string,
                    confirmAt:new Date(),
                    provider:providerEnm.GOOGLE

                
                }]
            })||[]
            if(!newUser){
                throw new BadReauest("Fail to signup with gmail please try again later")
            } 
            const credentials=await createLoginCredentaails(newUser)
            return res.status(201).json({
                message:"Done",
                data:{
                    credentials
                }
            })
        }
        LoginWithGmail=async(req:Request,res:Response):Promise<Response>=>{
            const {idToken}:IGmail=req.body;
            const{email}:TokenPayload=await this.verifyGmailAccount(idToken)
            const user=await this.userModel.findOne({
                filter:{
                    email,
                    provider:providerEnm.GOOGLE
                }
            })
            if(!user){
              
                throw new Notfound(`not register account or registerd with another provider`)
            }
          
            const credentials=await createLoginCredentaails(user)
            return res.status(200).json({
                message:"Done",
                data:{
                    credentials
                }
            })
        }
        
    }

export default new AuthenticationService()