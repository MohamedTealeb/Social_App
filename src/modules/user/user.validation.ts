import { LogoutEnum } from '../../utils/security/token.security'
import {z} from 'zod'

export const logout={
    body:z.strictObject({
        flag:z.enum(LogoutEnum).default(LogoutEnum.only)
    })
}

export const friendRequest={

params:z.strictObject({
    userId:z.string()
})




}
    export const acceptFriendRequest={

params:z.strictObject({
    requestId:z.string()
})




}

export const updateEmail={
    body:z.strictObject({
        email:z.string().email("Invalid email format").min(1,"Email is required")
    })
}