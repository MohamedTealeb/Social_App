import { Request, Response } from "express";
declare class PostService {
    private userModel;
    private postModel;
    constructor();
    createPost: (req: Request, res: Response) => Promise<Response>;
    likePost: (req: Request, res: Response) => Promise<Response>;
    updatePost: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: PostService;
export default _default;
//# sourceMappingURL=post.service.d.ts.map