import { Router } from "express";
import { getUsersProfileToSwipe, swipeLeft, swipeRight, getUserMatches, unlikeUser, likeUser, unmatcheUser } from "../controllers/match.controller";
import { protectRoutes } from "../middlewares/auth";

const router: Router = Router();

router.post("/swipe-left/:userId", protectRoutes, swipeLeft);
router.post("/swipe-right/:userId", protectRoutes, swipeRight);
router.post("/like/:userId", protectRoutes, likeUser);
router.put("/unlike/:userId", protectRoutes, unlikeUser); // for a user that has been swiped right
router.put("/unmatch/:userId", protectRoutes, unmatcheUser);
router.get("/users-profile", protectRoutes, getUsersProfileToSwipe);
router.get("/", protectRoutes, getUserMatches);

export default router;
