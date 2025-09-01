import { Request, Response } from "express";
declare class UserService {
    private userModel;
    private tokenModel;
    constructor();
    profile: (req: Request, res: Response) => Promise<Response>;
    logout: (req: Request, res: Response) => Promise<Response>;
    refreshToken: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map