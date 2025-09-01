import type { Request, Response, NextFunction } from 'express';
import { TokenEnum } from '../utils/security/token.security';
import { RoleEnum } from '../DB/model/User.model';
export declare const authentication: (tokenType?: TokenEnum) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorization: (accessRoles?: RoleEnum[], tokenType?: TokenEnum) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authentication.middlewar.d.ts.map