 import { Router } from "express";
import userService from "./user.service";
import {  authorization } from "../../middleware/authentication.middlewar";
import { endpoint } from "./user.authorization";
import { authentication } from './../../middleware/authentication.middlewar';
import * as validator from './user.validation';
import { validation } from "../../middleware/validation.middleware";

 const router=Router()

router.get("/",authorization(endpoint.profile),userService.profile)
router.post("/logout",authentication(),validation(validator.logout),userService.logout)

 export default router