import { DataBaseRepository } from "./database.repository";

import { IPost as TDocument } from '../model/post.model';
import { HydratedDocument, Model, PopulateOptions, ProjectionType, QueryOptions, RootFilterQuery } from 'mongoose';
import { CommentModel } from './../model/comment.model';
import { CommentRepository } from "./comment.repository";


export class PostRepository extends DataBaseRepository<TDocument>{
    private commentModel = new CommentRepository(CommentModel);
    constructor(protected override readonly model:Model<TDocument>){
        super(model)
    }

    async findcursor({
        filter,
        select,
        options,
        page = 1,
        size = 5,
      }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
        page?: number | "all";
        size?: number;
      }): Promise<{decsCount?: number, limit?: number, pages?: number, currentPage?: number, resault: any[]}> {
          let resault = []
          let decsCount = undefined;
          let pages = undefined;
          let limit = undefined;
          let currentPage = 1;

          if (page != "all") {
            currentPage = Math.floor(page < 1 ? 1 : page);
            limit = Math.floor(size < 1 || !size ? 5 : size);
            const skip = Math.floor((currentPage - 1) * limit);
            decsCount = await this.model.countDocuments(filter ?? {});
            pages = Math.ceil(decsCount / limit);
            
            // Use regular find with limit and skip instead of cursor
            const docs = await this.model
              .find(filter ?? {}, null, { ...options, limit, skip })
              .select(select ?? "")
              .populate(options?.populate as PopulateOptions[])
              .exec();
              
            for(let doc of docs){
              const comments = await this.commentModel.find({
                filter:{postId:doc._id,commentId:{$exists:false}},
                options:{populate:[{path:"reply"}]}
              });
              resault.push({post:doc,comments});
            }
          } else {
            // For "all", use cursor without limit
            const cursor = this.model
              .find(filter ?? {}, null, options)
              .select(select ?? "").populate(options?.populate as PopulateOptions[]).cursor()
              
            for(let doc =await cursor.next(); doc!=null; doc=await cursor.next()){
              const comments = await this.commentModel.find({
                filter:{postId:doc._id,commentId:{$exists:false}},
                options:{populate:[{path:"reply"}]}
              });
             resault.push({post:doc,comments});
            }
          }
        
        return {
          decsCount: decsCount || 0,
          limit: limit || 0,
          pages: pages || 0,
          currentPage,
          resault
        }
      }

}