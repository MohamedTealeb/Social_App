import { DataBaseRepository } from "./database.repository";

import { Model } from 'mongoose';
import { IChat as TDocument } from './../model/chat.model';


export class ChatRepository extends DataBaseRepository<TDocument>{
    constructor(protected override readonly model:Model<TDocument>){
        super(model)
    }

}









