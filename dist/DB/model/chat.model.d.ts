import { HydratedDocument, Types } from "mongoose";
export interface IMessage {
    content: string;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export type HMeesageDocument = HydratedDocument<IMessage>;
export interface IChat {
    participants: Types.ObjectId[];
    messages: IMessage[];
    group?: string;
    group_image?: string;
    roomId?: string;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export type HChatDocument = HydratedDocument<IChat>;
export declare const CHatModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IChat, {}, {}, {}, import("mongoose").Document<unknown, {}, IChat, {}, {}> & IChat & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=chat.model.d.ts.map