import { DataBaseRepository } from "./database.repository";

import { IPost as TDocument } from '../model/post.model';
import { Model } from 'mongoose';


export class PostRepository extends DataBaseRepository<TDocument>{
    constructor(protected override readonly model:Model<TDocument>){
        super(model)
    }

}