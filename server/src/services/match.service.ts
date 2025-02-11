import { query } from "../config/db";
import { UserMatchesDto } from "../dtos/user/userMatchesDto";
import { UserProfilesToSwipeDto } from "../dtos/user/userProfilesToSwipeDto";
import { socketMap } from "../middlewares/socketAuthrization";
import { io } from "../server";
import { increaseFameRating, decreaseFameRating } from "./user.service";

const mapUserMatches = (rows: any[]): UserMatchesDto[] => {
  return rows.map((row) => {
    const user: UserMatchesDto = {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      profile_picture: row.profile_picture,
      age: row.age,
      fame_rating: row.fame_rating,
      gender: row.gender,
    };
    return user;
  });
};

export const mapUserProfilesToSwipe = (
  rows: any[]
): UserProfilesToSwipeDto[] => {
  return rows.map((row) => {
    const user: UserProfilesToSwipeDto = {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      profile_picture: row.profile_picture,
      latitude: row.latitude,
      longitude: row.longitude,
      age: row.age,
      biography: row.biography,
      gender: row.gender,
      fame_rating: row.fame_rating,
      interests: row.interests.map((tag: string) => tag),
      distance: row.distance.toFixed(2),
    };
    return user;
  });
};

export const checkExistSwipe = async (
  userId: string,
  receiverId: string,
  status: string
): Promise<boolean> => {
  const checkExistQuery: string = `
    SELECT initiator_id, receiver_id, status FROM likes
    WHERE initiator_id = $1 AND receiver_id = $2 AND status = $3;
    `;

  try {
    const { rows: swipes } = await query(checkExistQuery, [
      userId,
      receiverId,
      status,
    ]);

    if (swipes.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking swipes: ", error);
    throw error;
  }
};

export const insertSwipe = async (
  userId: string,
  receiverId: string,
  status: string
): Promise<void> => {
  const insertSwipeQuery: string = `
        INSERT INTO likes (initiator_id, receiver_id, status)
        VALUES ($1, $2, $3);
        `;

  try {
    await query(insertSwipeQuery, [userId, receiverId, status]);
    if (status === "LIKED") {
      await increaseFameRating(receiverId, 5);
    } else {
      await decreaseFameRating(receiverId, 5);
    }
  } catch (error) {
    console.error("Error inserting swipe: ", error);
    throw error;
  }
};

export const insertMatch = async (
  userId: string,
  receiverId: string
): Promise<void> => {
  const matchUsersQuery: string = `
    UPDATE likes SET status = 'MATCH'
    WHERE (initiator_id = $1 AND receiver_id = $2 AND status = 'LIKED') OR (initiator_id = $2 AND receiver_id = $1 AND status = 'LIKED');
    `;
  try {
    await query(matchUsersQuery, [userId, receiverId]);
    await increaseFameRating(userId, 10);
    await increaseFameRating(receiverId, 10);
  } catch (error) {
    console.error("Error matching users: ", error);
    throw error;
  }
};

export const getUserMatches = async (
  userId: string,
  page: number,
  limit: number
): Promise<UserMatchesDto[]> => {
  const getMatchesQuery: string = `
    SELECT DISTINCT u.id, u.first_name, u.last_name, u.profile_picture, u.age, u.fame_rating, u.gender
    FROM likes l
    JOIN users u 
        ON (u.id = l.initiator_id AND l.receiver_id = $1)
        OR (u.id = l.receiver_id AND l.initiator_id = $1)
    WHERE l.status = 'MATCH'
    LIMIT $2
    OFFSET $3;
`;

  try {
    const { rows } = await query(getMatchesQuery, [
      userId,
      limit,
      (page - 1) * limit,
    ]);
    return mapUserMatches(rows);
  } catch (error) {
    console.error("Error getting matches: ", error);
    throw error;
  }
};

export const unlike = async (
  userId: string,
  receiverId: string
): Promise<void> => {
  const unlikeUserQuery: string = `
    DELETE FROM likes
    WHERE status = 'LIKED' 
    AND initiator_id = $1 
    AND receiver_id = $2;
`;
  try {
    await query(unlikeUserQuery, [userId, receiverId]);
    await decreaseFameRating(receiverId, 5);
  } catch (error) {
    console.error("Error unliking user: ", error);
    throw error;
  }
};

export const unmatch = async (
  userId: string,
  receiverId: string
): Promise<void> => {
  const unmatchedUserQuery: string = `
            DELETE FROM likes
            WHERE status = 'MATCH' 
            AND (initiator_id = $1 AND receiver_id = $2) OR (initiator_id = $2 AND receiver_id = $1);
        `;
  try {
    await query(unmatchedUserQuery, [userId, receiverId]);
    await decreaseFameRating(userId, 5);
    await decreaseFameRating(receiverId, 10);
  } catch (error) {
    console.error("Error unmatching user: ", error);
    throw error;
  }
};

//   -------------------------------------------------------------
// |                          MATCHING                           |
//   -------------------------------------------------------------

export const getProfilesToSwipe = async (
  userId: string,
  filters?: {
    minAge?: number;
    maxAge?: number;
    minFameRating?: number;
    maxFameRating?: number;
    minDistance?: number;
    maxDistance?: number;
    commonInterests?: number;
    sortBy?: string;
  }
) => {
  const userDataQuery = `
    WITH user_data AS (
      SELECT 
        sexual_preferences,
        gender,
        latitude,
        longitude,
        (SELECT array_agg(interest_id) FROM interests WHERE user_id = $1) as user_interests
      FROM users 
      WHERE id = $1
    ),
  `;

  const baseMatchQuery = `
    potential_matches AS (
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.profile_picture,
        u.age,
        u.gender,
        u.fame_rating,
        u.latitude,
        u.longitude,
        (SELECT array_agg(it.tag) 
         FROM interests i 
         JOIN interest_tags it ON i.interest_id = it.id 
         WHERE i.user_id = u.id
        ) AS interests,
        (
          6371 * acos(
            cos(radians((SELECT latitude FROM user_data))) * 
            cos(radians(u.latitude)) * 
            cos(radians(u.longitude) - radians((SELECT longitude FROM user_data))) + 
            sin(radians((SELECT latitude FROM user_data))) * 
            sin(radians(u.latitude))
          )
        ) as distance,
        (
          SELECT COUNT(*)
          FROM interests i1
          WHERE i1.user_id = u.id
          AND i1.interest_id IN (SELECT unnest(user_interests) FROM user_data)
        ) as common_tags_count
      FROM users u
      WHERE u.id != $1
      AND u.profile_completed = true
      AND u.email_verified = true
  `;

  const blockMatchFilter = `
    AND NOT EXISTS (
      SELECT 1 FROM blocks 
      WHERE (blocker_id = $1 AND blocked_id = u.id)
      OR (blocker_id = u.id AND blocked_id = $1)
    )
    AND NOT EXISTS (
      SELECT 1 FROM likes
      WHERE (initiator_id = $1 AND receiver_id = u.id)
      OR (initiator_id = u.id AND receiver_id = $1 AND status = 'MATCH')
    )
  `;

  const preferencesFilter = `
    AND (
      CASE 
        WHEN (SELECT sexual_preferences FROM user_data) = 'BOTH'
        OR (SELECT sexual_preferences FROM user_data) IS NULL THEN true
        ELSE u.gender::text = (SELECT sexual_preferences FROM user_data)::text
      END
    )
    AND (
      CASE
        WHEN u.sexual_preferences = 'BOTH'
        OR u.sexual_preferences IS NULL THEN true
        ELSE u.sexual_preferences::text = (SELECT gender FROM user_data)::text
      END
    )
    `;

  let dynamicFilters = "";
  const params: any[] = [userId];
  let paramCounter = 2;

  if (filters?.minAge || filters?.maxAge) {
    dynamicFilters += ` AND age BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minAge, filters.maxAge);
    paramCounter += 2;
  }

  if (filters?.minFameRating || filters?.maxFameRating) {
    dynamicFilters += ` AND fame_rating BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minFameRating, filters.maxFameRating);
    paramCounter += 2;
  }

  let finalSelection = `
    SELECT * FROM potential_matches
    WHERE 1=1
  `;

  if (filters?.minDistance || filters?.maxDistance) {
    finalSelection += ` AND distance BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minDistance, filters.maxDistance);
    paramCounter += 2;
  }

  if (filters?.commonInterests) {
    finalSelection += ` AND common_tags_count >= $${paramCounter}`;
    params.push(filters.commonInterests);
    paramCounter++;
  }

  let sorting = `
    ORDER BY
      CASE
        WHEN $${paramCounter} = 'distance' THEN distance
        WHEN $${paramCounter} = 'age' THEN age::float
        WHEN $${paramCounter} = 'fame_rating' THEN fame_rating::float
        WHEN $${paramCounter} = 'common_interests' THEN common_tags_count::float
        ELSE distance
      END 
  `;
  if (
    filters?.sortBy === "fame_rating" ||
    filters?.sortBy === "common_interests"
  )
    sorting += `ASC LIMIT 50;`;
  else sorting += `DESC LIMIT 50;`;

  params.push(filters?.sortBy ?? "distance");

  const fullQuery = `
    ${userDataQuery}
    ${baseMatchQuery}
    ${blockMatchFilter}
    ${preferencesFilter}
    ${dynamicFilters}
    )
    ${finalSelection}
    ${sorting}
  `;

  try {
    const { rows } = await query(fullQuery, params);
    return mapUserProfilesToSwipe(rows);
  } catch (error) {
    console.error("Error in getMatchingProfiles:", error);
    throw error;
  }
};

export const canSwipe = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const canSwipeQuery: string = `
    SELECT u.id
    FROM users u
    WHERE u.id = $2
    AND u.id != $1
    AND u.profile_completed = true
    AND u.email_verified = true
    AND NOT EXISTS (
      SELECT 1 FROM blocks 
      WHERE (blocker_id = $1 AND blocked_id = u.id)
      OR (blocker_id = u.id AND blocked_id = $1)
    )
    AND NOT EXISTS (
      SELECT 1 FROM likes
      WHERE (initiator_id = $1 AND receiver_id = u.id)
      OR (initiator_id = u.id AND receiver_id = $1 AND status = 'MATCH')
    );
  `;
  try {
    const { rows } = await query(canSwipeQuery, [userId, receiverId]);
    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error swiping user: ", error);
    throw error;
  }
};

export const canLike = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const canLikeQuery: string = `
  SELECT u.id
  FROM users u
  WHERE u.id = $2
  AND u.id != $1
  AND u.profile_completed = true
  AND u.email_verified = true
  AND NOT EXISTS (
    SELECT 1 FROM blocks 
    WHERE (blocker_id = $1 AND blocked_id = u.id)
    OR (blocker_id = u.id AND blocked_id = $1)
  )
  AND NOT EXISTS (
    SELECT 1 FROM likes
    WHERE (initiator_id = $1 AND receiver_id = u.id AND status IN ('LIKED', 'MATCH'))
    OR (initiator_id = u.id AND receiver_id = $1 AND status = 'MATCH')
  );
  `;
  try {
    const { rows } = await query(canLikeQuery, [userId, receiverId]);
    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error liking user: ", error);
    throw error;
  }
};

export const canDislike = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const canDislikeQuery: string = `
    SELECT u.id
    FROM users u
    WHERE u.id = $2
    AND NOT EXISTS (
      SELECT 1 FROM blocks 
      WHERE (blocker_id = $1 AND blocked_id = u.id)
      OR (blocker_id = u.id AND blocked_id = $1)
    )
    AND EXISTS (
      SELECT 1 FROM likes
      WHERE (initiator_id = $1 AND receiver_id = u.id AND status = 'LIKED')
    );
  `;
  try {
    const { rows } = await query(canDislikeQuery, [userId, receiverId]);
    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error disliking user: ", error);
    throw error;
  }
};

export const canUnmatch = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const canUnmatchQuery: string = `
    SELECT u.id
    FROM users u
    WHERE u.id = $2
    AND EXISTS (
      SELECT 1 FROM likes
      WHERE (initiator_id = $1 AND receiver_id = u.id AND status = 'MATCH')
      OR (initiator_id = u.id AND receiver_id = $1 AND status = 'MATCH')
    )
    AND NOT EXISTS (
      SELECT 1 FROM blocks 
      WHERE (blocker_id = $1 AND blocked_id = u.id)
      OR (blocker_id = u.id AND blocked_id = $1)
    );
  `;
  try {
    const { rows } = await query(canUnmatchQuery, [userId, receiverId]);
    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error unmatching user: ", error);
    throw error;
  }
};

export const insertLike = async (
  userId: string,
  receiverId: string
): Promise<void> => {
  const insertLikeQuery: string = `
    INSERT INTO likes (initiator_id, receiver_id, status)
    VALUES ($1, $2, 'LIKED')
    ON CONFLICT (initiator_id, receiver_id) DO UPDATE
    SET status = 'LIKED' WHERE likes.status = 'DISLIKED';
  `;

  try {
    await query(insertLikeQuery, [userId, receiverId]);
    await increaseFameRating(receiverId, 5);
  } catch (error) {
    console.error("Error inserting like: ", error);
    throw error;
  }
};

export const isMatch = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const isMatchQuery: string = `
    SELECT 1
    FROM likes
    WHERE (initiator_id = $1 AND receiver_id = $2 AND status = 'MATCH')
    OR (initiator_id = $2 AND receiver_id = $1 AND status = 'MATCH');
  `;
  try {
    const { rows } = await query(isMatchQuery, [userId, receiverId]);
    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking match: ", error);
    throw error;
  }
};

export const sendMatchEvent = (user_id: string) => {
  const recieverSocketId = socketMap.get(user_id);

  if (recieverSocketId) {
    io.to(recieverSocketId).emit("new_match", {});
  }
};
