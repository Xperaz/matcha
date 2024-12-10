import { Router } from "express";
import { getUsersProfile, swipeLeft, swipeRight, getUserMatches } from "../controllers/matchController";

const router: Router = Router();

router.post("/swipe-left/:userId", swipeLeft);
router.post("/swipe-right/:userId", swipeRight);
router.get("/users-profile", getUsersProfile);
router.get("/", getUserMatches);

export default router;
