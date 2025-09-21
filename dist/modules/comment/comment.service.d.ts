import { Request, Response } from "express";
declare class CommentService {
    private commentModel;
    private postModel;
    constructor();
    createComment: (req: Request, res: Response) => Promise<Response>;
    replyComment: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: CommentService;
export default _default;
//# sourceMappingURL=comment.service.d.ts.map