import { DataBaseRepository } from "./database.repository";

import { IfriendRequest as TDocument } from '../model/friendRequest.model';
import {  Model } from 'mongoose';



export class FriendRequestRepository extends DataBaseRepository<TDocument>{
    constructor(protected override readonly model:Model<TDocument>){
        super(model)
    }


}