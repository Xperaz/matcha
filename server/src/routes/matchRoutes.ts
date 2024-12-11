import { Router } from "express";
import { getUsersProfile, swipeLeft, swipeRight, getUserMatches } from "../controllers/matchController";
import { protectRoutes } from "../middlewares/auth";

const router: Router = Router();

router.post("/swipe-left/:userId", protectRoutes, swipeLeft);
router.post("/swipe-right/:userId", protectRoutes, swipeRight);
router.get("/users-profile", protectRoutes, getUsersProfile);
router.get("/", protectRoutes, getUserMatches);

export default router;
