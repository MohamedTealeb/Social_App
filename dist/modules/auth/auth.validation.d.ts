import { z } from "zod";
export declare const signup: {
    body: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=auth.validation.d.ts.map