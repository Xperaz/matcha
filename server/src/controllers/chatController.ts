import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { io } from "../server";
import { createMessage } from "./chatUtils";
import { socketMap } from "../middlewares/socketAuthrization";

export const getMessages = (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "user messages",
  });
};

export const getChatList = (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "list messages",
  });
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content, receiver_id } = req.body;
    const sender_id = req.user.id;

    console.log("rec:", receiver_id);
    console.log("sender: ", sender_id);
    console.log("socket map: ", socketMap);

    if (!content || !receiver_id) {
      return res
        .status(400)
        .json({ error: "Content and receiver_id are required" });
    }

    const message = await createMessage({
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

export const markMessagesAsRead = (
  req: AuthenticatedRequest,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    message: "mark message as read",
  });
};
