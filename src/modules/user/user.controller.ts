 import { Router } from "express";
import userService from "./user.service";
import { authentication } from './../../middleware/authentication.middlewar';
import * as validator from './user.validation';
import { validation } from "../../middleware/validation.middleware";
import { TokenEnum } from '../../utils/security/token.security'

 const router=Router()

router.get("/",authentication(),userService.profile)
router.post("/refresh-token",authentication(TokenEnum.refresh),userService.refreshToken)
router.post("/logout",authentication(),validation(validator.logout),userService.logout)

 export default router