import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { UserProfileDTO } from "../dtos/user/userProfileDto";
import * as profileService from "../services/profile.service";

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
