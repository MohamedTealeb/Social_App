import { compare, hash } from "bcrypt"

export const generateHash=async(plaintext:string,salt:number=Number(process.env.SALT)):Promise<string>=>{
    return await hash(plaintext,salt);
}
export const CompareHash=async(plaintext:string,hash:string):Promise<boolean>=>{
    return await compare(plaintext,hash);
}