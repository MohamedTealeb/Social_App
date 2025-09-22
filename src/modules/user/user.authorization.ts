import { RoleEnum } from "../../DB/model/User.model";


export const endpoint={
    profile:[RoleEnum.user],
    dashboard:[RoleEnum.admin,RoleEnum.superAdmin]
}