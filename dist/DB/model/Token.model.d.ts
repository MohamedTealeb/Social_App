import { Types, HydratedDocument } from "mongoose";
export interface IToken {
    jti: string;
    expiresIn: number;
    userId: Types.ObjectId;
}
export declare const TokenModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IToken, {}, {}, {}, import("mongoose").Document<unknown, {}, IToken, {}, {}> & IToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export type HTokenDocument = HydratedDocument<IToken>;
//# sourceMappingURL=Token.model.d.ts.map