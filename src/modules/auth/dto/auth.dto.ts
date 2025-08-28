import* as validtors from "../auth.validation"
import {z} from "zod"
export interface ISignupBodyInputs{
    username:string,
    email:string,
    password:string,
    phone:string,
    gender:string
}
export type ISignupBody=z.infer<typeof validtors.signup.body>