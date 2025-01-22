import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { Response, Request } from "express";
import {
  getNotifications,
  getUnreadNotificationsCount,
} from "../controllers/notif.controller";
import { sendNotificationTest } from "../services/notif.service";

const router: Router = Router();

router.get("/", protectRoutes, getNotifications);
router.get("/unread", protectRoutes, getUnreadNotificationsCount);
router.get("/send", protectRoutes, async (req: Request, res: Response) => {
  await sendNotificationTest();
  return res.status(200).json({
    success: true,
    message: "Notification sent",
  });
});

export default router;
