import { Request, Response } from "express";
declare class UserService {
    private userModel;
    private postModel;
    private friendRequestModel;
    constructor();
    profile: (req: Request, res: Response) => Promise<Response>;
    dashboard: (req: Request, res: Response) => Promise<Response>;
    profileImage: (req: Request, res: Response) => Promise<Response>;
    logout: (req: Request, res: Response) => Promise<Response>;
    refreshToken: (req: Request, res: Response) => Promise<Response>;
    friendRequest: (req: Request, res: Response) => Promise<Response>;
    acceptFriendRequest: (req: Request, res: Response) => Promise<Response>;
    updateEmail: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map