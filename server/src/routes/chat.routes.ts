import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import {
  getChatList,
  getMessages,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/chat.controller";
import { usableProfile } from "../middlewares/usableProfile";

const router = Router();

router.get("/messages/:receiverId", protectRoutes, usableProfile, getMessages);

router.get("/list", protectRoutes, usableProfile, getChatList);

router.post("/send", protectRoutes, usableProfile, sendMessage);

router.put("/read/:senderId", protectRoutes, usableProfile, markMessagesAsRead);

export default router;
