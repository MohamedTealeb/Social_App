import { LogoutEnum } from '../../utils/security/token.security';
import { z } from 'zod';
export declare const logout: {
    body: z.ZodObject<{
        flag: z.ZodDefault<z.ZodEnum<typeof LogoutEnum>>;
    }, z.core.$strict>;
};
//# sourceMappingURL=user.validation.d.ts.map