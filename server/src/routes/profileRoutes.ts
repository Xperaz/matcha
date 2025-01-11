import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { Response } from "express";
import { getMyProfile } from "../controllers/profileController";


const router: Router = Router();

router.get("/me", protectRoutes, getMyProfile);

export default router;