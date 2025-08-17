import type { NextFunction, Request, Response } from 'express';
declare class AuthenticationService {
    constructor();
    signup: (req: Request, res: Response, next: NextFunction) => Response;
    login: (req: Request, res: Response, next: NextFunction) => Response;
}
declare const _default: AuthenticationService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map