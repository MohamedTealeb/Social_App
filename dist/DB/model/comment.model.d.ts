import { HydratedDocument, Types } from "mongoose";
import { IPost } from "./post.model";
export interface Icomment {
    createdBy: Types.ObjectId;
    postId: Types.ObjectId | Partial<IPost>;
    commentId?: Types.ObjectId;
    content?: string;
    attachements?: string[];
    tags?: Types.ObjectId[];
    likes?: Types.ObjectId[];
    freezedBy?: Types.ObjectId;
    freezedAt?: Date;
    restoredAt?: Date;
    restoredBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export type HPostDocument = HydratedDocument<Icomment>;
export declare const CommentModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<Icomment, {}, {}, {}, import("mongoose").Document<unknown, {}, Icomment, {}, {}> & Icomment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=comment.model.d.ts.map