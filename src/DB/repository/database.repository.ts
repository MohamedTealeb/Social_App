import { CreateOptions, HydratedDocument, Model,  MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";

export abstract class DataBaseRepository<TDocument>{
    constructor(protected readonly model:Model<TDocument>){}

async findOne({filter,select}:
    {filter?:RootFilterQuery<TDocument>,
        select?:ProjectionType<TDocument>|null,
        options?:QueryOptions<TDocument>|null}):Promise<HydratedDocument<TDocument>|null>{
    return await this.model.findOne(filter).select(select||"")
}
async find({
  filter,
  select,
  options,
}: {
  filter?: RootFilterQuery<TDocument>;
  select?: ProjectionType<TDocument> | null;
  options?: QueryOptions<TDocument> | null;
}): Promise<HydratedDocument<TDocument>[]> {
  return this.model
    .find(filter ?? {}, null, options)
    .select(select ?? "")
    .exec() as Promise<HydratedDocument<TDocument>[]>;
}
async findByIdAndUpdate({
    id,
    update,
    options={new:true},
}:{
    id:Types.ObjectId;
    update?:UpdateQuery<TDocument>;
    options?:QueryOptions<TDocument>|null;


}):Promise<HydratedDocument<TDocument>|null>{
    return this.model.findByIdAndUpdate(id,{
        ...update,$inc:{__v:1}
    },options)
}


    async  create({
        data,
        options,
    }:{
        data:Partial<TDocument>[];
    
        options?:CreateOptions|undefined
    }):Promise<HydratedDocument<TDocument>[]| undefined> {
      return  await this.model.create(data,options);
    }


async updateOne({
filter,
update,
    options
}:{
    filter:RootFilterQuery<TDocument>;
    update:UpdateQuery<TDocument>;
    options?:MongooseUpdateQueryOptions<TDocument>

}):Promise<UpdateWriteOpResult>
{
    return await this.model.updateOne(filter,{...update,$inc:{__v:1}},options)
}


}

