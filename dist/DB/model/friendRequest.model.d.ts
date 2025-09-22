import { HydratedDocument, Types } from "mongoose";
export interface IfriendRequest {
    createdBy: Types.ObjectId;
    sendTo: Types.ObjectId;
    acceptedAt?: Date;
    createdAt: Date;
    updatedAt?: Date;
}
export type HPostDocument = HydratedDocument<IfriendRequest>;
export declare const FriendRequestModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IfriendRequest, {}, {}, {}, import("mongoose").Document<unknown, {}, IfriendRequest, {}, {}> & IfriendRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=friendRequest.model.d.ts.map