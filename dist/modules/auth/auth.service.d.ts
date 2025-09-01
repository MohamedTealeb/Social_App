import type { Request, Response } from 'express';
declare class AuthenticationService {
    private userModel;
    constructor();
    private verifyGmailAccount;
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
    signupWithGmail: (req: Request, res: Response) => Promise<Response>;
    LoginWithGmail: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: AuthenticationService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map