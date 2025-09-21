import { Router } from "express";
import commentService from "./comment.service"
import { createComment, replyComment } from "./comment.validation";
import { validation } from "../../middleware/validation.middleware";

const router=Router({mergeParams:true})
router.post("/",validation(createComment),commentService.createComment)
router.post("/:commentId/reply",validation(replyComment),commentService.replyComment)

export default router