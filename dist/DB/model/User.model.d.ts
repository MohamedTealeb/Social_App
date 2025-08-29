import { Types } from "mongoose";
export declare enum GenderEnum {
    male = "male",
    female = "female"
}
export declare enum RoleEnum {
    user = "user",
    admin = "admin"
}
export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    username?: string;
    email: string;
    confrimEmailOtp?: string;
    confirmAt: Date;
    password: string;
    resetPasswordOtp?: string;
    changeCredentialTime?: Date;
    phone?: string;
    address?: string;
    gender?: GenderEnum;
    role: RoleEnum;
    createdAt: Date;
    updatedAt?: Date;
}
export declare const UserModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.model.d.ts.map