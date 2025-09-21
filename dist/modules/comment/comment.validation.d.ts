import { z } from 'zod';
export declare const createComment: {
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strict>;
    body: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const replyComment: {
    params: z.ZodObject<{
        postId: z.ZodString;
        commentId: z.ZodString;
    }, z.core.$strict>;
    body: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
};
//# sourceMappingURL=comment.validation.d.ts.map