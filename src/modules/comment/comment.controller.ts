import { Router } from "express";
import commentService from "./comment.service"
import { createComment, replyComment } from "./comment.validation";
import { validation } from "../../middleware/validation.middleware";
import { authentication } from "../../middleware/authentication.middlewar";

const router=Router({mergeParams:true})
router.post("/",validation(createComment),commentService.createComment)
router.post("/:commentId/reply",validation(replyComment),commentService.replyComment)
router.patch("/:commentId",authentication(),commentService.updateComment)
router.patch("/:commentId/freeze",authentication(),commentService.freezeComment)
router.delete("/:commentId/hard",authentication(),commentService.hardDeleteComment)
router.get("/:commentId",authentication(),commentService.getCommentById)
router.get("/:commentId/with-replies",authentication(),commentService.getCommentWithReply)

export default router