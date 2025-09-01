import { validation } from '../../middleware/validation.middleware';
import authService from './auth.service';
import * as validators from './auth.validation';
import {Router} from 'express';

const router:Router=Router();

router.post("/signup",validation(validators.signup),authService.signup)
router.post("/signup-gmail",validation(validators.signupWithGmail),authService.signupWithGmail)
router.post("/login-gmail",validation(validators.signupWithGmail),authService.LoginWithGmail)

router.post("/login",validation(validators.login),authService.login)
router.patch("/send-reset-password",validation(validators.sendForgotPasseordCode),authService.sendForgotCode)
router.patch("/verify-reset-password",validation(validators.verifyForgotPasseordCode),authService.verifyForgotPasseordCode)
router.patch("/reset-password",validation(validators.restForgotPasseordCode),authService.resetForgotPasseordCode)
router.patch("/confirm-email",validation(validators.confirmEmail),authService.confirmEmail)
export default router;