import { Router } from "express";
import { signup, signin, singout, googleOauthHandler } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", singout);
router.get("/google/callback", googleOauthHandler);

export default router;
