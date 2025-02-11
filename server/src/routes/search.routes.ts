import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { searchForUsers } from "../controllers/search.controller";
import { usableProfile } from "../middlewares/usableProfile";


const router: Router = Router();

router.get("/", protectRoutes, usableProfile, searchForUsers);

export default router;