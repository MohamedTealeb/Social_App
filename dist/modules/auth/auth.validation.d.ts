import { z } from "zod";
export declare const signup: {
    body: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
        confirmPassword: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
};
export declare const login: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
//# sourceMappingURL=auth.validation.d.ts.map