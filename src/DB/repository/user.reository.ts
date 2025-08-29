import { CreateOptions, HydratedDocument, Model } from "mongoose";
import { IUser } from "../model/User.model";
import { DataBaseRepository } from "./database.repository";
import { BadReauest } from "../../utils/response/error.response";




export class UserRepository extends DataBaseRepository <IUser>{
    constructor(protected override readonly model:Model<IUser>){
        super(model)
    }



async creaeUser({
    data,
    options,
}:{

    data:Partial<IUser>[];
    options?:CreateOptions
}):Promise<HydratedDocument<IUser>[]| undefined> {

const [user]=await this.create({data,options})||[]
if(!user){
    throw new BadReauest("fail to create this user")
}

return [user];
}

}