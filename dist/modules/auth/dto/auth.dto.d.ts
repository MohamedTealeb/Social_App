import * as validtors from "../auth.validation";
import { z } from "zod";
export type ISignupBody = z.infer<typeof validtors.signup.body>;
export type ILoginBody = z.infer<typeof validtors.login.body>;
export type IConfirmEmail = z.infer<typeof validtors.confirmEmail.body>;
//# sourceMappingURL=auth.dto.d.ts.map