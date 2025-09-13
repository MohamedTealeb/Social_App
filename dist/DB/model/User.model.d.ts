import { Types, HydratedDocument } from "mongoose";
export declare enum GenderEnum {
    male = "male",
    female = "female"
}
export declare enum RoleEnum {
    user = "user",
    admin = "admin"
}
export declare enum providerEnm {
    GOOGLE = "GOOGLE",
    SYSTEM = "SYSTEM"
}
export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    slug: string;
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
    provider: providerEnm;
    createdAt: Date;
    updatedAt?: Date;
    profileImage?: string;
    coverImages?: string[];
}
export declare const UserModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export type HUserDocument = HydratedDocument<IUser>;
//# sourceMappingURL=User.model.d.ts.map