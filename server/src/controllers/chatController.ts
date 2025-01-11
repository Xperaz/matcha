import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";

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

export const sendMessage = (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "send message",
  });
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
