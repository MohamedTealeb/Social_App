import { DataBaseRepository } from "./database.repository";
import { IfriendRequest as TDocument } from '../model/friendRequest.model';
import { Model } from 'mongoose';
export declare class FriendRequestRepository extends DataBaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=friendRequest.repository.d.ts.map