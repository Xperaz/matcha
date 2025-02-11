import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { Response, Request } from "express";
import {
  getNotifications,
  getUnreadNotificationsCount,
} from "../controllers/notif.controller";
import { usableProfile } from "../middlewares/usableProfile";

const router: Router = Router();

router.get("/", protectRoutes, usableProfile, getNotifications);
router.get("/unread", protectRoutes, usableProfile, getUnreadNotificationsCount);

export default router;
