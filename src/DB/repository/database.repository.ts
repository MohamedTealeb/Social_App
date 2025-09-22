import { CreateOptions, HydratedDocument, Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";

export abstract class DataBaseRepository<TDocument>{
    constructor(protected readonly model:Model<TDocument>){}

async findOne({filter,select}:
    {filter?:RootFilterQuery<TDocument>,
        select?:ProjectionType<TDocument>|null,
        options?:QueryOptions<TDocument>|null}):Promise<HydratedDocument<TDocument>|null>{
    return await this.model.findOne(filter).select(select||"")
}
async paginte({
    filter={},
    options={},
    select,
    page=1,
    size=5,
}:{
    filter:RootFilterQuery<TDocument>,
    select?:ProjectionType<TDocument>|undefined,
    options?:QueryOptions<TDocument>|undefined,
    page?:number|"all",
    size?:number,
}):Promise<{decsCount?: number, limit?: number, pages?: number, currentPage?: number, resault: HydratedDocument<TDocument>[]}>{ 

let decsCount:number|undefined=undefined
let pages:number|undefined=undefined
if(page!="all"){
    pages=Math.floor(page<1?1:page)
options.limit=Math.floor(size<1||!size?5:size)
options.skip=Math.floor((pages-1)*options.limit)
decsCount=await this.model.countDocuments(filter)
pages=Math.ceil(decsCount/options.limit)
}
const resault=await this.model.find(filter,select,options)
return {
    decsCount: decsCount || 0,
    limit: options.limit || 0,
    pages: pages || 0,
    currentPage: typeof page === 'number' ? Math.floor(page<1?1:page) : 1,
    resault
}}
   
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

async findOneAndUpdate({
    filter,
    update,
    options={new:true},
}:{
    filter:RootFilterQuery<TDocument>;
    update?:UpdateQuery<TDocument>;
    options?:QueryOptions<TDocument>|null;
}):Promise<HydratedDocument<TDocument>|null>{
    return this.model.findOneAndUpdate(filter,{
        ...update,$inc:{__v:1}
    },options)
}


    async  create({
        data,
        options,
    }:{
        data:Partial<TDocument>;
    
        options?:CreateOptions|undefined
    }):Promise<HydratedDocument<TDocument>> {
      if (options) {
        const created = await this.model.create([data], options);
        return created[0] as HydratedDocument<TDocument>;
      } else {
        return await this.model.create(data) as HydratedDocument<TDocument>;
      }
    }

    async  createMany({
        data,
        options,
    }:{
        data:Partial<TDocument>[];
    
        options?:CreateOptions|undefined
    }):Promise<HydratedDocument<TDocument>[]> {
      return  await this.model.create(data,options) as HydratedDocument<TDocument>[];
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

