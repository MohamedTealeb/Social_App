import { DataBaseRepository } from "./database.repository";
import { IToken as TDocument } from './../model/Token.model';
import { Model } from 'mongoose';
export declare class TokenRepository extends DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=token.repository%20copy.d.ts.map