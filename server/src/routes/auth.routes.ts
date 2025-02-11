import { Router } from "express";
import {
  signup,
  signin,
  singout,
  googleOauthHandler,
  forgotPassword,
  resetPassword,
  getResetPassword,
  verifyEmail,
  sendVerificationEmail,
} from "../controllers/auth.controller";
import { protectRoutes } from "../middlewares/auth";

const router: Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", singout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/reset-password", getResetPassword);

router.get("/verify-email", verifyEmail);
router.post("/send-verification-email", protectRoutes, sendVerificationEmail);

router.get("/google/callback", googleOauthHandler);

export default router;
