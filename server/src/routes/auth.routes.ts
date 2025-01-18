import { Router } from "express";
import { signup, signin, singout } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", singout);

export default router;
