import { z } from "zod";
export declare const getChat: {
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strict>;
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        size: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strict>;
};
export declare const getChatgroup: {
    params: z.ZodObject<{
        groupId: z.ZodString;
    }, z.core.$strict>;
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        size: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strict>;
};
export declare const createGroup: {
    body: z.ZodObject<{
        participants: z.ZodArray<z.ZodString>;
        group: z.ZodString;
    }, z.core.$strict>;
};
//# sourceMappingURL=chat.validation.d.ts.map