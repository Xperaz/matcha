import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import {
  completeProfile,
  updatePassword,
  updateProfile,
  getUserMe,
} from "../controllers/user.controller";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { updateEmail } from "../controllers/user.controller";
import { Response } from "express";
import { usableProfile } from "../middlewares/usableProfile";

const router: Router = Router();

router.post("/complete-profile", protectRoutes, completeProfile);

router.get("/me", protectRoutes, getUserMe);

router.put("/update-password", protectRoutes, usableProfile, updatePassword);
router.put("/update-email", protectRoutes, usableProfile, updateEmail);
router.patch("/update-profile", protectRoutes, usableProfile, updateProfile);

export default router;
