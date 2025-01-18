import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import {
  getChatList,
  getMessages,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/chatController";

const router = Router();

router.get("/messages/:receiverId", protectRoutes, getMessages);

router.get("/list", protectRoutes, getChatList);

router.post("/send", protectRoutes, sendMessage);

router.put("/read/:senderId", protectRoutes, markMessagesAsRead);

export default router;
