
import { Types,Schema, models, model, HydratedDocument, UpdateQuery } from "mongoose"


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
userSchema.pre("save",function(next){
    return
})

userSchema.pre("updateOne",async function (next) {
next()

})

userSchema.post("updateOne",async function (next) {
  const query =this.getQuery()
  const update=this.getUpdate()as UpdateQuery<HUserDocument>
console.log({query,update})

})
export const UserModel=models.User||model<IUser>("User",userSchema)
export type HUserDocument=HydratedDocument<IUser>
