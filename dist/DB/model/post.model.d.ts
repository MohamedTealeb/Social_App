import { HydratedDocument, Types } from "mongoose";
export declare enum allowCommentsEnum {
    allow = "allow",
    deny = "deny"
}
export declare enum availabilityEnum {
    public = "public",
    friends = "friends",
    onlyMe = "only-me"
}
export interface IPost {
    content?: string;
    attachements?: string[];
    assetsFolderId: string;
    availability: availabilityEnum;
    allowComments: allowCommentsEnum;
    tags?: Types.ObjectId[];
    likes?: Types.ObjectId[];
    createdBy: Types.ObjectId;
    freezedBy?: Types.ObjectId;
    freezedAt?: Date;
    restoredAt?: Date;
    restoredBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export type HPostDocument = HydratedDocument<IPost>;
export declare const PostModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IPost, {}, {}, {}, import("mongoose").Document<unknown, {}, IPost, {}, {}> & IPost & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=post.model.d.ts.map