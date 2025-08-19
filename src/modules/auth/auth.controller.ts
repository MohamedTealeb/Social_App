import authService from './auth.service';
import {Router} from 'express';

const router:Router=Router();

router.post("/signup",authService.signup)
router.post("/login",authService.login)
export default router;