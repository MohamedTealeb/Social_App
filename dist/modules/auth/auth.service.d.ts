import type { Request, Response } from 'express';
declare class AuthenticationService {
    private userModel;
    constructor();
    /**
     *
     *  @param req Exress.Request
     *  @param res Express.Response
     *  @return Promise<Express.Response>
     *  @example()
     * return {messae: "Done",status:201,data:{}}
     */
    signup: (req: Request, res: Response) => Promise<Response>;
    login: (req: Request, res: Response) => Promise<Response>;
    confirmEmail: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: AuthenticationService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map