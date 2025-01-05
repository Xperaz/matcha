import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { query } from "../config/db";
import { UserMatchesDto } from "../dtos/user/userMatchesDto";
import { UserProfilesToSwipeDto } from "../dtos/user/userProfilesToSwipeDto";

const mapUserMatches = (rows: any[]): UserMatchesDto[] => {
  return rows.map((row) => {
    const user: UserMatchesDto = {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      profile_picture: row.profile_picture,
      latitude: row.latitude,
      longtitude: row.longtitude,
    };
    return user;
  });
};

const mapUserProfilesToSwipe = (rows: any[]): UserProfilesToSwipeDto[] => {
  return rows.map((row) => {
    const user: UserProfilesToSwipeDto = {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      profile_picture: row.profile_picture,
      latitude: row.latitude,
      longtitude: row.longtitude,
      age: row.age,
      biography: row.biography,
    };
    return user;
  });
};

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
    const existingDislikeQuery: string = `
            SELECT initiator_id, receiver_id, status FROM likes
            WHERE initiator_id = $1 AND receiver_id = $2 AND status = 'DISLIKED';
        `;
    const { rows: existingDislikeRows } = await query(existingDislikeQuery, [
      userId,
      receiverId,
    ]);

    if (existingDislikeRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User has already swiped left",
      });
    }

    const swipeLeftQuery: string = `
            INSERT INTO likes (initiator_id, receiver_id, status)
            VALUES ($1, $2, 'DISLIKED');
        `;
    await query(swipeLeftQuery, [userId, receiverId]);

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
        message: "User has already swiped right",
      });
    }

    // check if the receiver has already swiped the user right
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
      //TODO: send notification to both users and add it to the notification table
      return res.status(200).json({
        success: true,
        message: "Match created successfully",
      });
    }

    const swipeRightQuery: string = `
            INSERT INTO likes (initiator_id, receiver_id, status)
            VALUES ($1, $2, 'LIKED');
        `;
    await query(swipeRightQuery, [userId, receiverId]);

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

//get user matches [users], user{f_name, l_name, photo, locatiion?}
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

    const getMatchesQuery: string = `
            SELECT DISTINCT u.id, u.first_name, u.last_name, u.profile_picture, u.latitude, u.longtitude
            FROM likes l
            JOIN users u 
                ON (u.id = l.initiator_id AND l.receiver_id = $1)
                OR (u.id = l.receiver_id AND l.initiator_id = $1)
            WHERE l.status = 'MATCH'
            LIMIT $2
            SKIP $3;
        `;

    const { rows } = await query(getMatchesQuery, [userId, limit, (page - 1) * limit]);

    if (!rows) {
      return res.status(200).json({
        success: true,
        message: "No matches found",
        data: [],
      });
    }

    const userMatches: UserMatchesDto[] = mapUserMatches(rows);

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
export const getUsersProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // get a list of users to choose from where:
  // 1. the user has not already swiped left
  // 2. the user has not already swiped right
  // 3. the user has not already matched with the user
  // 4. the user is not the current user
  // 5. the user is within the user's preferred distance
  // 6. the user is within the user's preferred age range
  // 7. the user is within the user's sexual preference
  // 8. the user is not blocked by the user
  // 9. the user is not blocking the user
  // iwa aji nta 9ad had lquery machakiiiiiiil

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
    // get users that didn't swipe left or right or match with the current user
    // and are not blocked by the user or blocking the user

    const getUsersQuery: string = `
            SELECT u.id, u.first_name, u.last_name, u.profile_picture, u.age, u.gender, u.longtitude, u.latitude, u.biography
            FROM users u
            WHERE u.id != $1
            AND u.id NOT IN (
                SELECT l.receiver_id FROM likes l WHERE l.initiator_id = $1
                UNION
                SELECT l.initiator_id FROM likes l WHERE l.receiver_id = $1
            )
            AND u.id NOT IN (
                SELECT b.blocked_id FROM blocks b WHERE b.blocker_id = $1
                UNION
                SELECT b.blocker_id FROM blocks b WHERE b.blocked_id = $1
            )
            LIMIT 10;
        `;

    const { rows } = await query(getUsersQuery, [userId]);

    if (!rows) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    const usersProfiles: UserProfilesToSwipeDto[] =
      mapUserProfilesToSwipe(rows);
    //TODO: filter the users based on the user's specs
    //TODO: add functions for that
    // const usersProfilesPaginated: UserProfilesToSwipeDto[] = usersProfiles.slice((page - 1) * limit, page * limit);

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

    const unlikeUserQuery: string = `
            DELETE FROM likes
            WHERE status = 'LIKED' 
            AND initiator_id = $1 
            AND receiver_id = $2;
        `;
    await query(unlikeUserQuery, [userId, receiverId]);

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

export const unmatchedUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId: string = req.user?.id;
    const receiverId: string = req.params.userId;

    console.log("receiverId", receiverId);

    if (!userId || !receiverId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    const unmatchedUserQuery: string = `
            DELETE FROM likes
            WHERE status = 'MATCH' 
            AND (initiator_id = $1 AND receiver_id = $2) OR (initiator_id = $2 AND receiver_id = $1);
        `;
    await query(unmatchedUserQuery, [userId, receiverId]);

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
