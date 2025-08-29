import { CreateOptions, HydratedDocument, Model } from "mongoose";
import { IUser } from "../model/User.model";
import { DataBaseRepository } from "./database.repository";
export declare class UserRepository extends DataBaseRepository<IUser> {
    protected readonly model: Model<IUser>;
    constructor(model: Model<IUser>);
    creaeUser({ data, options, }: {
        data: Partial<IUser>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<IUser>[] | undefined>;
}
//# sourceMappingURL=user.reository.d.ts.map