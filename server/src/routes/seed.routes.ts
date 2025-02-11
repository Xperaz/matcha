import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { seedDb } from "../controllers/seed.controller";

const router: Router = Router();

router.get("/", protectRoutes, seedDb);

export default router;
