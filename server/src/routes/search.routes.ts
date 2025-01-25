import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { searchForUsers } from "../controllers/search.controller";


const router: Router = Router();

router.get("/", protectRoutes, searchForUsers);

export default router;