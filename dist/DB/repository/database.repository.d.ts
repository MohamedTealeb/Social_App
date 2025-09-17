import { CreateOptions, HydratedDocument, Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
export declare abstract class DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOne({ filter, select }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null>;
    find({ filter, select, options, }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument>[]>;
    findByIdAndUpdate({ id, update, options, }: {
        id: Types.ObjectId;
        update?: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null>;
    create({ data, options, }: {
        data: Partial<TDocument>[];
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<TDocument>[] | undefined>;
    updateOne({ filter, update, options }: {
        filter: RootFilterQuery<TDocument>;
        update: UpdateQuery<TDocument>;
        options?: MongooseUpdateQueryOptions<TDocument>;
    }): Promise<UpdateWriteOpResult>;
}
//# sourceMappingURL=database.repository.d.ts.map