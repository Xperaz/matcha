import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { seedDb } from "../controllers/seedController";

const router: Router = Router();

router.get("/", protectRoutes, seedDb);

export default router;
