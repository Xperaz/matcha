import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { getMyProfile, getUserProfile } from "../controllers/profile.controller";
import { usableProfile } from "../middlewares/usableProfile";

const router: Router = Router();

router.get("/me", protectRoutes, usableProfile, getMyProfile);
router.get("/:userId", protectRoutes, usableProfile, getUserProfile);

export default router;
