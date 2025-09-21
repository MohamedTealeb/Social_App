import { DataBaseRepository } from "./database.repository";

import { Icomment as TDocument } from '../model/comment.model';
import { Model } from 'mongoose';


export class CommentRepository extends DataBaseRepository<TDocument>{
    constructor(protected override readonly model:Model<TDocument>){
        super(model)
    }

}
