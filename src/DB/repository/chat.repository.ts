import { DataBaseRepository } from "./database.repository";

import { HydratedDocument, Model, ProjectionType, QueryOptions } from 'mongoose';
import { IChat as TDocument } from './../model/chat.model';
import { RootFilterQuery } from "mongoose";


export class ChatRepository extends DataBaseRepository<TDocument>{
    constructor(protected override readonly model:Model<TDocument>){
        super(model)
    }
async findOneChat({
  filter,
  select,
  options,
  page = 1,
  size = 5,
}: {
  filter?: RootFilterQuery<TDocument>,
  select?: ProjectionType<TDocument> | null,
  options?: QueryOptions<TDocument> | null,
  page?: number | "all",
  size?: number | undefined,
}): Promise<HydratedDocument<TDocument> | null> {
  let decsCount: number | undefined = undefined;
  let pages: number | undefined = undefined;

  if (page !== "all") {
    const limit = Math.floor(size && size > 0 ? size : 5);
    const currentPage = Math.max(1, Number(page));

    decsCount = await this.model.countDocuments(filter);
    pages = Math.ceil(decsCount / limit);

    if (options) {
      options.limit = limit;
      options.skip = (currentPage - 1) * limit;
    }
  }

  const sliceValue = page === "all"
    ? undefined
    : [(Math.max(1, Number(page)) - 1) * size, size];

  let query = this.model
    .findOne(filter ?? {}, null, options ?? undefined)
    .select({
      ...(typeof select === "object" ? select : {}),
      ...(sliceValue ? { messages: { $slice: sliceValue } } : {}),
    });

  if (options?.populate) {
    query = query.populate(options.populate as any);
  }

  return (await query) as unknown as HydratedDocument<TDocument> | null;
}

}









