import { z } from 'zod';
import { allowCommentsEnum, availabilityEnum } from '../../DB/model/post.model';
export declare const createPost: {
    body: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        availability: z.ZodDefault<z.ZodEnum<typeof availabilityEnum>>;
        allowComments: z.ZodDefault<z.ZodEnum<typeof allowCommentsEnum>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const likePost: {
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strict>;
};
//# sourceMappingURL=post.validation.d.ts.map