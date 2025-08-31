import type { Secret, SignOptions } from 'jsonwebtoken';
export declare const generarteToken: ({ payload, secret, options }: {
    payload: object;
    secret?: Secret;
    options?: SignOptions;
}) => Promise<string>;
//# sourceMappingURL=token.security.d.ts.map