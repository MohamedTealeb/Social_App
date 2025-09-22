 import { Router } from "express";
import userService from "./user.service";
import { authentication, authorization } from './../../middleware/authentication.middlewar';
import * as validator from './user.validation';
import { validation } from "../../middleware/validation.middleware";
import { TokenEnum } from '../../utils/security/token.security'
import { cloudFileUpload, fileValidation, storaeEnum } from "../../utils/multer/cloud.multer";
import { endpoint } from "./user.authorization";

 const router=Router()

router.get("/",authentication(),userService.profile)
router.get("/dashboard",authorization(endpoint.dashboard),userService.dashboard)
router.post("/:userId/send-friend-request",authentication(),validation(validator.friendRequest),userService.friendRequest)
router.patch("/accept-friend-request/:requestId",authentication(),validation(validator.acceptFriendRequest),userService.acceptFriendRequest)
router.patch("/profile-image",authentication(),cloudFileUpload({validation:fileValidation.image,storageApproach:storaeEnum.disk}).single("image"),userService.profileImage)
router.post("/refresh-token",authentication(TokenEnum.refresh),userService.refreshToken)
router.post("/logout",authentication(),validation(validator.logout),userService.logout)

 export default router