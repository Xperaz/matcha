import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { getMessages } from "../controllers/chatController";

const router = Router();

router.get("/messages", protectRoutes, getMessages);

export default router;
