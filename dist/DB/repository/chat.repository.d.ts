import { DataBaseRepository } from "./database.repository";
import { Model } from 'mongoose';
import { IChat as TDocument } from './../model/chat.model';
export declare class ChatRepository extends DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=chat.repository.d.ts.map