import { DataBaseRepository } from "./database.repository";
import { IPost as TDocument } from '../model/post.model';
import { Model } from 'mongoose';
export declare class PostRepository extends DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=post.repository.d.ts.map