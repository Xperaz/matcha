import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { usableProfile } from "../middlewares/usableProfile";
import { getLikes, getVisits } from "../controllers/history.controller";

const router: Router = Router();

router.get("/visits", protectRoutes, usableProfile, getVisits);
router.get("/likes", protectRoutes, usableProfile, getLikes);

export default router;