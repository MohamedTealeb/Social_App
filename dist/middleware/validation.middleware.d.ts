import type { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
type KetReqType = keyof Request;
type SchemaType = Partial<Record<KetReqType, ZodType>>;
export declare const validation: (schema: SchemaType) => (req: Request, res: Response, next: NextFunction) => Response | NextFunction;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map