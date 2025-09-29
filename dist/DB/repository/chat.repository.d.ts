import { DataBaseRepository } from "./database.repository";
import { HydratedDocument, Model, ProjectionType, QueryOptions } from 'mongoose';
import { IChat as TDocument } from './../model/chat.model';
import { RootFilterQuery } from "mongoose";
export declare class ChatRepository extends DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOneChat({ filter, select, options, page, size, }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
        page?: number | "all";
        size?: number | undefined;
    }): Promise<HydratedDocument<TDocument> | null>;
}
//# sourceMappingURL=chat.repository.d.ts.map