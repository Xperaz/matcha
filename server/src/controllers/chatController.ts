import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { io } from "../server";

import { socketMap } from "../middlewares/socketAuthrization";
import * as chatService from "../services/chatService";

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserId = req.user.id;
    const receiverId = req.params.receiverId;

    if (!currentUserId || !receiverId) {
      return res.status(400).json({ error: "reciverId is required !" });
    }

    const messages = await chatService.getMessagesBetweenUsers(
      currentUserId,
      receiverId
    );

    res.json(messages);
  } catch (error) {
    console.error("Error getting messages: ", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getChatList = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const chatList = await chatService.getChatList(userId);

    res.json(chatList);
  } catch (error) {
    console.error("Error getting chat List: ", error);
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content, receiver_id } = req.body;
    const sender_id = req.user.id;

    if (!content || !receiver_id) {
      return res
        .status(400)
        .json({ error: "Content and receiver_id are required" });
    }

    const message = await chatService.createMessage({
      sender_id,
      receiver_id,
      content,
    });

    io.to(socketMap.get(receiver_id)).emit("new_message", message);
    io.to(sender_id).emit("new_message", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("error sending message: ", error);
    res.status(500).json({
      error: "Failed to send message",
    });
  }
};

export const markMessagesAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUserId = req.user.id;
    const sender_id = req.params.senderId;
    if (!sender_id) {
      return res.status(400).json({
        error: "The sender id is required",
      });
    }

    const updatedMessages = await chatService.markMessagesAsRead(
      currentUserId,
      sender_id
    );

    return res.status(200).json({
      success: true,
      data: {
        updatedMessages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error on mark Message as read",
    });
  }
};
