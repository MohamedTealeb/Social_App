import * as validtors from "../auth.validation"
import {z} from "zod"

export type ISignupBody=z.infer<typeof validtors.signup.body>
export type ILoginBody=z.infer<typeof validtors.login.body>
export type IForgotCode=z.infer<typeof validtors.sendForgotPasseordCode.body>
export type IVerifyCode=z.infer<typeof validtors.verifyForgotPasseordCode.body>
export type IRestyCode=z.infer<typeof validtors.restForgotPasseordCode.body>
export type IConfirmEmail=z.infer<typeof validtors.confirmEmail.body>
export type IGmail=z.infer<typeof validtors.signupWithGmail.body>