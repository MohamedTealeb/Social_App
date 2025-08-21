import type { Request, Response } from 'express';
declare class AuthenticationService {
    constructor();
    signup: (req: Request, res: Response) => Promise<Response>;
    login: (req: Request, res: Response) => Response;
}
declare const _default: AuthenticationService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map