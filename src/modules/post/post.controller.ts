import { Router } from 'express'
import { authentication } from '../../middleware/authentication.middlewar'
import postService from './post.service'

const router=Router()

 router.post("/",authentication(),postService.createPost)

export default router
