import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { publicProfileDto, UserProfileDTO } from "../dtos/user/userProfileDto";
import * as profileService from "../services/profile.service";
import { isValidUserId, userEsists } from "../services/user.service";
import { createNotificationAndSendMessage } from "../services/notif.service";

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId: any = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }
    const userData: UserProfileDTO | null = await profileService.getMyProfile(
      userId
    );

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "error while retrieving my profile",
    });
  }
};

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id;
    const receiverId: string = req.params.userId;

    if (!userId || !receiverId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    if (!isValidUserId(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!userEsists(receiverId)) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userId === receiverId) {
      res.redirect(`${process.env.CLIENT_URL}/profile`);
    }

    if (await profileService.checkBlockedUser(userId, receiverId)) {
      return res.status(403).json({
        success: false,
        message: "You are blocked by this user",
      });
    }

    const userData: publicProfileDto | null =
      await profileService.getUserProfile(receiverId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await createNotificationAndSendMessage(
      userId,
      receiverId,
      "visited your profile"
    );

    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving user profile",
    });
  }
};
