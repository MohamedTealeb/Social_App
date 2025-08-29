import { CreateOptions, HydratedDocument, Model, ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";
export declare abstract class DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOne({ filter, select }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | null>;
    create({ data, options, }: {
        data: Partial<TDocument>[];
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<TDocument>[] | undefined>;
}
//# sourceMappingURL=database.repository.d.ts.map