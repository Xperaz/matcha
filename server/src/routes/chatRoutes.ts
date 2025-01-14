import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import {
  getChatList,
  getMessages,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/chatController";

const router = Router();

// Get all messages between two users
router.get("/messages/:receiverId", protectRoutes, getMessages);

// Get list of users with chat history
router.get("/list", protectRoutes, getChatList);

// Send a message
router.post("/send", protectRoutes, sendMessage);

// Mark messages as read
router.put("/read/:senderId", protectRoutes, markMessagesAsRead);

export default router;
