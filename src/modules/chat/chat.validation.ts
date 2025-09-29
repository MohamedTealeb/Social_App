import {z} from "zod"

export const getChat ={
    params:z.strictObject({
        userId:z.string()
    })
}

