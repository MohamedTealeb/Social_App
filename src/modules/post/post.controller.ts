import { Router } from 'express'
import { authentication } from '../../middleware/authentication.middlewar'
import postService from './post.service'
import commentRouter from '../comment/comment.controller'
const router=Router()

router.use("/:postId/comment",authentication(),commentRouter)
router.get("/",authentication(),postService.postList)
 router.post("/add",authentication(),postService.createPost)
 router.patch("/like/:postId",authentication(),postService.likePost)
 router.patch("/:postId",authentication(),postService.updatePost)

export default router
