import { z } from "zod";
export declare const signup: {
    body: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
        confirmPassword: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodEnum<typeof import("../../DB/model/User.model").GenderEnum>>;
    }, z.core.$strict>;
};
export declare const login: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
export declare const confirmEmail: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
    }, z.core.$strict>;
};
//# sourceMappingURL=auth.validation.d.ts.map