import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { isValidUserId, userEsists } from "../services/user.service";
import * as blockService from "../services/blockReport.service";

export const blockUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId: string = req.user.id;
    const receiverId: string = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!isValidUserId(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    if (!userEsists(receiverId)) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (await blockService.isUserBlocked(userId, receiverId)) {
      return res.status(400).json({
        success: false,
        message: "User already blocked",
      });
    }

    await blockService.blockUser(userId, receiverId);

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    console.error("Error blocking user: ", error);
    return res.status(500).json({
      success: false,
      message: "Error blocking user",
    });
  }
};

export const reportUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId: string = req.user.id;
    const receiverId: string = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!isValidUserId(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    if (!userEsists(receiverId)) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (await blockService.isUserReported(userId, receiverId)) {
      return res.status(400).json({
        success: false,
        message: "User already reported",
      });
    }

    await blockService.reportUser(userId, receiverId);

    return res.status(200).json({
      success: true,
      message: "User reported successfully",
    });
  } catch (error) {
    console.error("Error reporting user: ", error);
    return res.status(500).json({
      success: false,
      message: "Error reporting user",
    });
  }
};
