
import { Router } from "express";
import { authentication } from "../../middleware/authentication.middlewar";
import { validation } from "../../middleware/validation.middleware";
import * as Validators from "./chat.validation";
import { ChatService } from "./chat.service";
const router=Router({mergeParams:true})
const chatService:ChatService=new ChatService()
router.get("/",authentication(),validation(Validators.getChat),chatService.getChat)


export default router