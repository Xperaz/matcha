import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { Notification } from "../types/notif";
import * as notifService from "../services/notif.service";

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id;
    const limit: number = parseInt(req.query.limit as string) || 10;
    let last_notif: string | null = req.query.last_notif as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    if (!last_notif) {
      last_notif = null;
    }

    const notifications: Notification[] =
      await notifService.getAllNotifications(userId, limit, last_notif);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting notifications",
    });
  }
};

export const getUnreadNotificationsCount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    const notifications: number = await notifService.getUnreadNotifications(
      userId
    );

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error getting unread notifications: ", error);
    return res.status(500).json({
      success: false,
      message: "Error getting unread notifications",
    });
  }
};
