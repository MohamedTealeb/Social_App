import type { NextFunction, Request, Response } from 'express';
import z, { ZodType } from 'zod';
import { GenderEnum } from '../DB/model/User.model';
type KetReqType = keyof Request;
type SchemaType = Partial<Record<KetReqType, ZodType>>;
export declare const validation: (schema: SchemaType) => (req: Request, res: Response, next: NextFunction) => Response | NextFunction;
export declare const generalFields: {
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    gender: z.ZodOptional<z.ZodEnum<typeof GenderEnum>>;
    otp: z.ZodString;
};
export {};
//# sourceMappingURL=validation.middleware.d.ts.map