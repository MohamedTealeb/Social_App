import { Request, Response } from "express";
import { availabilityEnum } from "../../DB/model/post.model";
import { Types } from "mongoose";
export declare const postAvailability: (req: Request) => ({
    availability: availabilityEnum;
    createdBy?: never;
    tags?: never;
} | {
    availability: availabilityEnum;
    createdBy: {
        $in: (Types.ObjectId | undefined)[];
    };
    tags?: never;
} | {
    availability: {
        $ne: availabilityEnum;
    };
    tags: {
        $in: (Types.ObjectId | undefined)[];
    };
    createdBy?: never;
} | {
    availability: availabilityEnum;
    createdBy: Types.ObjectId | undefined;
    tags?: never;
})[];
declare class PostService {
    private userModel;
    private postModel;
    constructor();
    createPost: (req: Request, res: Response) => Promise<Response>;
    likePost: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: PostService;
export default _default;
//# sourceMappingURL=post.service.d.ts.map