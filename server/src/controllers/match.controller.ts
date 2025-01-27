import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { query } from "../config/db";
import { UserMatchesDto } from "../dtos/user/userMatchesDto";
import { UserProfilesToSwipeDto } from "../dtos/user/userProfilesToSwipeDto";
import { createNotificationAndSendMessage } from "../services/notif.service";
import * as matchService from "../services/match.service";
import {
  validateAgeRange,
  validateDistanceRange,
  validateFameRatingRange,
} from "../services/search.service";
import { userEsists, isValidUserId } from "../services/user.service";

export const swipeLeft = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId: string = req.user?.id;
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
        message: "Invalid receiver ID",
      });
    }

    if (!(await userEsists(receiverId))) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cantDislike: boolean = await matchService.cantSwipe(userId, receiverId);

    if (cantDislike === true) {
      return res.status(409).json({
        success: false,
        message: "you can not swipe left this user",
      });
    }

    await matchService.insertSwipe(userId, receiverId, "DISLIKED");

    return res.status(200).json({
      success: true,
      message: "User swiped left successfully",
    });
  } catch (ex) {
    console.error("Error swiping left", ex);

    return res.status(500).json({
      success: false,
      message: "An error occurred while swiping left",
    });
  }
};

export const swipeRight = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId: string = req.user?.id;
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
        message: "Invalid receiver ID",
      });
    }

    if (!(await userEsists(receiverId))) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if the user has already swiped the receiver right
    // for safety
    const cantLike: boolean = await matchService.cantSwipe(userId, receiverId);

    if (cantLike === true) {
      return res.status(409).json({
        success: false,
        message: "you can not swipe right this user",
      });
    }

    // check if the receiver has already swiped the user right
    const mutualLike: boolean = await matchService.checkExistSwipe(
      receiverId,
      userId,
      "LIKED"
    );

    if (mutualLike === true) {
      // create a match
      await matchService.insertMatch(userId, receiverId);
      await createNotificationAndSendMessage(
        userId,
        receiverId,
        "is your match now! Say hi to start a conversation."
      );
      await createNotificationAndSendMessage(
        receiverId,
        userId,
        "is your match now! Say hi to start a conversation."
      );
      return res.status(200).json({
        success: true,
        message: "Match created successfully",
      });
    }
    await matchService.insertSwipe(userId, receiverId, "LIKED");
    await createNotificationAndSendMessage(
      userId,
      receiverId,
      "liked you! check them out."
    );

    return res.status(200).json({
      success: true,
      message: "User swiped right successfully",
    });
  } catch (ex) {
    console.error("Error swiping right", ex);

    return res.status(500).json({
      success: false,
      message: "An error occurred while swiping right",
    });
  }
};

export const getUserMatches = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId: string = req.user?.id;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const page: number = parseInt(req.query.page as string) || 1;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    const userMatches: UserMatchesDto[] = await matchService.getUserMatches(
      userId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "User matches retrieved successfully",
      data: userMatches,
    });
  } catch (ex) {
    console.error("Error getting user matches", ex);

    return res.status(500).json({
      success: false,
      message: "An error occurred while getting user matches",
    });
  }
};

// get an array of users to choose from
export const getUsersProfileToSwipe = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId: string = req.user?.id;
    const { ageRange, distanceRange, fameRatingRange, commonInterests } =
      req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    const ageRangeArray: number[] | undefined = ageRange
      ? (ageRange as string).split(",").map(Number)
      : undefined;
    const distanceRangeArray: number[] | undefined = distanceRange
      ? (distanceRange as string).split(",").map(Number)
      : undefined;
    const fameRatingRangeArray: number[] | undefined = fameRatingRange
      ? (fameRatingRange as string).split(",").map(Number)
      : undefined;
    const commonInterestsCount: number | undefined = commonInterests
      ? parseInt(commonInterests as string)
      : undefined;

    if (ageRangeArray && !validateAgeRange(ageRangeArray)) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid age range",
      });
    }

    if (distanceRangeArray && !validateDistanceRange(distanceRangeArray)) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid distance range",
      });
    }

    if (
      fameRatingRangeArray &&
      !validateFameRatingRange(fameRatingRangeArray)
    ) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid fame rating range",
      });
    }

    if (commonInterestsCount && commonInterestsCount < 0) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid common interests count",
      });
    }

    const usersProfiles: UserProfilesToSwipeDto[] =
      await matchService.getProfilesToSwipe(userId, {
        minAge: ageRangeArray ? ageRangeArray[0] : undefined,
        maxAge: ageRangeArray ? ageRangeArray[1] : undefined,
        minDistance: distanceRangeArray ? distanceRangeArray[0] : undefined,
        maxDistance: distanceRangeArray ? distanceRangeArray[1] : undefined,
        minFameRating: fameRatingRangeArray ? fameRatingRangeArray[0]: undefined,
        maxFameRating: fameRatingRangeArray ? fameRatingRangeArray[1]: undefined,
        commonInterests: commonInterestsCount ? commonInterestsCount: undefined,
      });

    return res.status(200).json({
      success: true,
      message: "Users profiles retrieved successfully",
      data: usersProfiles,
    });
  } catch (ex) {
    console.error("Error getting users profile", ex);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting users profile",
    });
  }
};

// seperate the like/unlike from swqipe right/left in case we want to add more features
export const likeUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId: string = req.user?.id;
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
        message: "Invalid receiver ID",
      });
    }

    if (!(await userEsists(receiverId))) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if the user has already swiped the receiver right
    // for safety
    const cantLike: boolean = await matchService.cantSwipe(userId, receiverId);

    if (cantLike === true) {
      return res.status(409).json({
        success: false,
        message: "you can not swipe right this user",
      });
    }

    // check if the receiver has already swiped the user right
    const mutualLike: boolean = await matchService.checkExistSwipe(
      receiverId,
      userId,
      "LIKED"
    );

    if (mutualLike === true) {
      // create a match
      await matchService.insertMatch(userId, receiverId);
      await createNotificationAndSendMessage(
        userId,
        receiverId,
        "is your match now! Say hi to start a conversation."
      );
      await createNotificationAndSendMessage(
        receiverId,
        userId,
        "is your match now! Say hi to start a conversation."
      );
      return res.status(200).json({
        success: true,
        message: "Match created successfully",
      });
    }
    await matchService.insertSwipe(userId, receiverId, "LIKED");
    await createNotificationAndSendMessage(
      userId,
      receiverId,
      "liked you! check them out."
    );

    return res.status(200).json({
      success: true,
      message: "User liked successfully",
    });
  } catch (ex) {
    console.error("Error liking user", ex);

    return res.status(500).json({
      success: false,
      message: "An error occurred while liking user",
    });
  }
};

export const unlikeUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId: string = req.user?.id;
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
        message: "Invalid receiver ID",
      });
    }

    if (!(await userEsists(receiverId))) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await matchService.unlike(userId, receiverId);
    await createNotificationAndSendMessage(userId, receiverId, "unliked you.");

    return res.status(200).json({
      success: true,
      message: "User unliked successfully",
    });
  } catch (ex) {
    console.error("Error unliking user", ex);

    return res.status(500).json({
      success: false,
      message: "An error occurred while unliking user",
    });
  }
};

export const unmatcheUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId: string = req.user?.id;
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
        message: "Invalid receiver ID",
      });
    }

    if (!(await userEsists(receiverId))) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    await matchService.unmatch(userId, receiverId);

    return res.status(200).json({
      success: true,
      message: "User unmatched successfully",
    });
  } catch (ex) {
    console.error("Error unmatching user", ex);

    return res.status(500).json({
      success: false,
      message: "An error occurred while unmatching user",
    });
  }
};
