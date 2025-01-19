import { Router } from "express";
import { search } from "../controllers/search.controller";
import { protectRoutes } from "../middlewares/auth";

const router = Router();

router.get("/", protectRoutes, search);

export default router;
