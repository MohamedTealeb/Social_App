import { Router } from 'express'
import { authentication } from '../../middleware/authentication.middlewar'
import postService from './post.service'

const router=Router()

 router.post("/add",authentication(),postService.createPost)
 router.patch("/like/:postId",authentication(),postService.likePost)

export default router
