import { Router } from "express";
import { getUsersProfileToSwipe, swipeLeft, swipeRight, getUserMatches, unlikeUser, likeUser, unmatcheUser } from "../controllers/match.controller";
import { protectRoutes } from "../middlewares/auth";
import { usableProfile } from "../middlewares/usableProfile";

const router: Router = Router();

router.post("/swipe-left/:userId", protectRoutes, usableProfile, swipeLeft);
router.post("/swipe-right/:userId", protectRoutes, usableProfile, swipeRight);
router.post("/like/:userId", protectRoutes, usableProfile, likeUser);
router.put("/unlike/:userId", protectRoutes, usableProfile, unlikeUser); // for a user that has been swiped right
router.put("/unmatch/:userId", protectRoutes, usableProfile, unmatcheUser);
router.get("/users-profile", protectRoutes, usableProfile, getUsersProfileToSwipe);
router.get("/", protectRoutes, usableProfile, getUserMatches);

export default router;
