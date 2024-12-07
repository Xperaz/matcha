import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { completeProfile } from "../controllers/userController";


const router: Router = Router();

router.post("/complete-profile", protectRoutes, completeProfile);

export default router;