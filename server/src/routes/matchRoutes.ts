import { Router } from "express";
import { getUsersProfile, swipeLeft, swipeRight, getUserMatches, unlikeUser, likeUser, unmatchedUser } from "../controllers/matchController";
import { protectRoutes } from "../middlewares/auth";

const router: Router = Router();

router.post("/swipe-left/:userId", protectRoutes, swipeLeft);
router.post("/swipe-right/:userId", protectRoutes, swipeRight);
router.post("/like/:userId", protectRoutes, likeUser);
router.put("/unlike/:userId", protectRoutes, unlikeUser); // for a user that has been swiped right
router.put("/unmatch/:userId", protectRoutes, unmatchedUser);
router.get("/users-profile", protectRoutes, getUsersProfile);
router.get("/", protectRoutes, getUserMatches);

export default router;
