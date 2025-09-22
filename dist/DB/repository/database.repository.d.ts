import { CreateOptions, HydratedDocument, Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
export declare abstract class DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOne({ filter, select }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null>;
    paginte({ filter, options, select, page, size, }: {
        filter: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | undefined;
        options?: QueryOptions<TDocument> | undefined;
        page?: number | "all";
        size?: number;
    }): Promise<{
        decsCount?: number;
        limit?: number;
        pages?: number;
        currentPage?: number;
        resault: HydratedDocument<TDocument>[];
    }>;
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
    findOneAndUpdate({ filter, update, options, }: {
        filter: RootFilterQuery<TDocument>;
        update?: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null>;
    create({ data, options, }: {
        data: Partial<TDocument>;
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<TDocument>>;
    createMany({ data, options, }: {
        data: Partial<TDocument>[];
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<TDocument>[]>;
    updateOne({ filter, update, options }: {
        filter: RootFilterQuery<TDocument>;
        update: UpdateQuery<TDocument>;
        options?: MongooseUpdateQueryOptions<TDocument>;
    }): Promise<UpdateWriteOpResult>;
}
//# sourceMappingURL=database.repository.d.ts.map