import { CreateOptions, HydratedDocument, Model, ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";

export abstract class DataBaseRepository<TDocument>{
    constructor(protected readonly model:Model<TDocument>){}

async findOne({filter,select}:{filter?:RootFilterQuery<TDocument>,select?:ProjectionType<TDocument>|null,options?:QueryOptions<TDocument>|null}):Promise<HydratedDocument<TDocument>|null>{
    return await this.model.findOne(filter).select(select||"")
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


    

}
