import { DataBaseRepository } from "./database.repository";
import { IPost as TDocument } from '../model/post.model';
import { Model, ProjectionType, QueryOptions, RootFilterQuery } from 'mongoose';
export declare class PostRepository extends DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    private commentModel;
    constructor(model: Model<TDocument>);
    findcursor({ filter, select, options, page, size, }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
        page?: number | "all";
        size?: number;
    }): Promise<{
        decsCount?: number;
        limit?: number;
        pages?: number;
        currentPage?: number;
        resault: any[];
    }>;
}
//# sourceMappingURL=post.repository.d.ts.map