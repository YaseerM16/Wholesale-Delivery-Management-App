import { Router } from "express";
import { adminAuthController } from "../controllers/admin/Admin.Auth.Controller";

const router = Router()

router.post('/admin/register', adminAuthController.adminRegister.bind(adminAuthController))
router.get('/admin/verify-email', adminAuthController.verifyEmail.bind(adminAuthController))
router.post('/admin/login', adminAuthController.login.bind(adminAuthController))

export const adminRouter = router