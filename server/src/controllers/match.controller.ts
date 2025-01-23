import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { query } from "../config/db";
import { UserMatchesDto } from "../dtos/user/userMatchesDto";
import { UserProfilesToSwipeDto } from "../dtos/user/userProfilesToSwipeDto";
import * as matchService from "../services/match.service";
import { createNotificationAndSendMessage } from "../services/notif.service";

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

    // check if the user has already swiped the receiver left
    const existingDislike: boolean = await matchService.checkExistSwipe(
      userId,
      receiverId,
      "DISLIKED"
    );

    if (existingDislike === true) {
      return res.status(409).json({
        success: false,
        message: "User has already swiped left",
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

    // check if the user has already swiped the receiver right
    // for safety
    const existingLike: boolean = await matchService.checkExistSwipe(
      userId,
      receiverId,
      "LIKED"
    );

    if (existingLike === true) {
      return res.status(409).json({
        success: false,
        message: "User has already swiped right",
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
// TODO maybe use pagination
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

    if (!ageRange || !distanceRange || !fameRatingRange || !commonInterests) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameters",
      });
    }

    const ageRangeArray: number[] = (ageRange as string).split(",").map(Number);
    const distanceRangeArray: number[] = (distanceRange as string)
      .split(",")
      .map(Number);
    const fameRatingRangeArray: number[] = (fameRatingRange as string)
      .split(",")
      .map(Number);
    const commonInterestsCount: number = parseInt(commonInterests as string);

    const usersProfiles: UserProfilesToSwipeDto[] =
      await matchService.getProfilesToSwipe(userId, {
        minAge: ageRangeArray[0],
        maxAge: ageRangeArray[1],
        minFameRating: fameRatingRangeArray[0],
        maxFameRating: fameRatingRangeArray[1],
        minDistance: distanceRangeArray[0],
        maxDistance: distanceRangeArray[1],
        commonInterests: commonInterestsCount,
      });

    console.log("usersProfiles", usersProfiles.length);

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

    // check if the user has already liked the receiver
    const existingLikeQuery: string = `
            SELECT initiator_id, receiver_id, status FROM likes
            WHERE initiator_id = $1 AND receiver_id = $2 AND status = 'LIKED';
        `;
    const { rows: existingLikeRows } = await query(existingLikeQuery, [
      userId,
      receiverId,
    ]);

    if (existingLikeRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User has already liked the user",
      });
    }

    const mutualLike: string = `
            SELECT initiator_id, receiver_id, status FROM likes
            WHERE initiator_id = $2 AND receiver_id = $1 AND status = 'LIKED';
        `;
    const { rows: mutualLikeRows } = await query(mutualLike, [
      userId,
      receiverId,
    ]);

    if (mutualLikeRows.length > 0) {
      // create a match
      const matchUsersQuery: string = `
                UPDATE likes SET status = 'MATCH'
                WHERE (initiator_id = $1 AND receiver_id = $2) OR (initiator_id = $2 AND receiver_id = $1);
            `;
      await query(matchUsersQuery, [userId, receiverId]);

      return res.status(200).json({
        success: true,
        message: "Match created successfully",
      });
    }

    const likeUserQuery: string = `
            INSERT INTO likes (initiator_id, receiver_id, status)
            VALUES ($1, $2, 'LIKED');
        `;
    await query(likeUserQuery, [userId, receiverId]);

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
