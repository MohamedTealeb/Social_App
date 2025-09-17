
import { Types,Schema, models, model, HydratedDocument } from "mongoose"
import { generateHash } from "../../utils/security/hash.security"
import { emailEvent } from './../../utils/event/email.event';


export enum GenderEnum{
male="male",
female="female"
}
export enum RoleEnum{
user="user",
admin="admin"
}
export enum providerEnm{
GOOGLE="GOOGLE",
SYSTEM="SYSTEM"
}
export interface IUser{
    _id:Types.ObjectId;
    firstName: string;
    lastName:string;
    slug:string;
    username?:string;
    email:string;
    confrimEmailOtp?:string;
    confirmAt:Date;
    password:string;
    resetPasswordOtp?:string;
    changeCredentialTime?:Date;
    phone?:string;
    address?:string;
    gender?:GenderEnum;
    role:RoleEnum;
    provider:providerEnm
    createdAt:Date;
    updatedAt?:Date;
    profileImage?:string;
    coverImages?:string[]

}

const userSchema=new Schema<IUser>({

    firstName:{type:String,required:true,minLength:2,maxLength:25}, 
    lastName:{type:String,required:true,minLength:2,maxLength:25},
    slug:{type:String,required:true,minLength:2,maxLength:51},
   
    email:{type:String,required:true,unique:true},
    confrimEmailOtp:{type:String},
    confirmAt:{type:Date},
    password:{type:String,required:function(){
        return this.provider===providerEnm.GOOGLE?false:true
    }},
    resetPasswordOtp:{type:String},
    changeCredentialTime:{type:Date},
    phone:{type:String},
    address:{type:String},
    gender:{type:String,enum:GenderEnum,default:GenderEnum.male},
    role:{type:String,enum:RoleEnum,default:RoleEnum.user},
    provider:{type:String,enum:providerEnm,default:providerEnm.SYSTEM},
    profileImage:{type:String},
    coverImages:[String]
    

},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

userSchema.virtual("username")
  .set(function (value: string) {
    const [firstName = "", lastName = ""] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
    this.slug = value.trim().replace(/\s+/g, "-").toLowerCase();
  })
  .get(function () {
    return `${this.firstName ?? ""} ${this.lastName ?? ""}`.trim();
  });

  userSchema.pre("save",async function (this:HUserDocument&{wasNew:boolean,confirmEmailPlainOtp?:string},next) 
  {
    this.wasNew=this.isNew
  
    if(this.isModified("password")){
      this.password==await generateHash(this.password)
    }
    if(this.isModified("confrimEmailOtp")){
      this.confirmEmailPlainOtp=this.confrimEmailOtp as string
      this.confrimEmailOtp==await generateHash(this.confrimEmailOtp as string)
    }
    next()
  })

  userSchema.post("save",async function (doc,next) {
    const that=this as HUserDocument&{wasNew:boolean,confirmEmailPlainOtp?:string}
    if(that.wasNew&&that.confirmEmailPlainOtp){
  emailEvent.emit("confirmEmail",{to:this.email,otp:that.confirmEmailPlainOtp})

}
 next()
    
  })
  userSchema.pre(["find","findOne"],function(next){
    const query=this.getQuery()

    if(query.paranoid===false){
      this.setQuery({...query})
    }else{
      this.setQuery({...query,freezedAt:{$exists:false}})
    }

    next()
  })
export const UserModel=models.User||model<IUser>("User",userSchema)
export type HUserDocument=HydratedDocument<IUser>
