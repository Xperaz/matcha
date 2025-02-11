import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { usableProfile } from "../middlewares/usableProfile";
import { blockUser } from "../controllers/blockReport.controller";


const router: Router = Router();

router.post("/", protectRoutes, usableProfile, blockUser);

export default router;