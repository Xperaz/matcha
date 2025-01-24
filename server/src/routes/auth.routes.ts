import { Router } from "express";
import {
  signup,
  signin,
  singout,
  googleOauthHandler,
  forgotPassword,
  resetPassword,
  getResetPassword,
} from "../controllers/auth.controller";

const router: Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", singout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/reset-password", getResetPassword);
router.get("/google", googleOauthHandler);
router.get("/google/callback", googleOauthHandler);

export default router;
