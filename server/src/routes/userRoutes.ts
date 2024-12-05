import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";


const router: Router = Router();

router.post("/complete-profile", protectRoutes);

export default router;