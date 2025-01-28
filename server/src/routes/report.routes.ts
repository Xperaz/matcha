import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { usableProfile } from "../middlewares/usableProfile";
import { reportUser } from "../controllers/blockReport.controller";


const router: Router = Router();

router.post("/", protectRoutes, usableProfile, reportUser);

export default router;