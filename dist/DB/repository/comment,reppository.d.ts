import { DataBaseRepository } from "./database.repository";
import { Icomment as TDocument } from '../model/comment.model';
import { Model } from 'mongoose';
export declare class CommentRepository extends DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=comment,reppository.d.ts.map