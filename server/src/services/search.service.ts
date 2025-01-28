import { query } from "../config/db";
import { isValidInterest } from "../dtos/requests/completeProfileRequest";
import { mapUserProfilesToSwipe } from "./match.service";

export const getUsersSearched = async (
  userId: string,
  filters?: {
    minAge?: number;
    maxAge?: number;
    minFameRating?: number;
    maxFameRating?: number;
    minDistance?: number;
    maxDistance?: number;
    interests?: string[];
    sortBy?: string;
    page?: number;
    limit?: number;
  }
) => {
  const userDataQuery = `
    WITH user_data AS (
      SELECT 
        sexual_preferences,
        latitude,
        longitude
      FROM users 
      WHERE id = $1
    ),
  `;

  const baseUsersQuery = `
    potential_users AS (
      SELECT DISTINCT
        u.id,
        u.first_name,
        u.last_name,
        u.profile_picture,
        u.age,
        u.gender,
        u.fame_rating,
        u.latitude,
        u.longitude,
        (
          6371 * acos(
            cos(radians((SELECT latitude FROM user_data))) * 
            cos(radians(u.latitude)) * 
            cos(radians(u.longitude) - radians((SELECT longitude FROM user_data))) + 
            sin(radians((SELECT latitude FROM user_data))) * 
            sin(radians(u.latitude))
          )
        ) as distance
      FROM users u
      WHERE u.id != $1
      AND u.profile_completed = true
  `;

  const blockUsersFilter = `
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
    `;

  const params: any[] = [userId];
  let paramCounter = 2;
  let dynamicFilters = "";

  if (filters?.minAge || filters?.maxAge) {
    dynamicFilters += ` AND age BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minAge ?? 18, filters.maxAge ?? 100);
    paramCounter += 2;
  }

  if (filters?.minFameRating || filters?.maxFameRating) {
    dynamicFilters += ` AND fame_rating BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minFameRating ?? 0, filters.maxFameRating ?? 100);
    paramCounter += 2;
  }

  if (filters?.interests && filters.interests.length > 0) {
    dynamicFilters += `
      AND (
        SELECT COUNT(DISTINCT it.tag)        -- Count unique matching tags
        FROM interests i                     -- Start from interests table
        JOIN interest_tags it                -- Join with interest_tags table
          ON i.interest_id = it.id          -- Match interest_id with interest_tags id
        WHERE i.user_id = u.id              -- For the current user being evaluated
        AND it.tag = ANY($${paramCounter}::varchar[])  -- Match against array of requested tags
      ) = $${paramCounter + 1}`;

    params.push(filters.interests, filters.interests.length);

    paramCounter += 2;
  }

  let finalSelection = `SELECT * FROM potential_users WHERE 1=1`;

  if (filters?.minDistance || filters?.maxDistance) {
    finalSelection += ` AND distance BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minDistance ?? 0, filters.maxDistance ?? 20000);
    paramCounter += 2;
  }

  const sorting = `
    ORDER BY
      CASE
        WHEN $${paramCounter} = 'distance' THEN distance
        WHEN $${paramCounter} = 'age' THEN age::float
        WHEN $${paramCounter} = 'fame_rating' THEN fame_rating::float
        ELSE distance
      END DESC
  `;
  params.push(filters?.sortBy ?? "distance");
  paramCounter++;

  const pagination = `
    LIMIT $${paramCounter} OFFSET $${paramCounter + 1};
  `;
  params.push(filters?.limit ?? 50);
  params.push(
    (filters?.page ?? 1) * (filters?.limit ?? 50) - (filters?.limit ?? 50)
  );

  const fullQuery = `
    ${userDataQuery}
    ${baseUsersQuery}
    ${blockUsersFilter}
    ${preferencesFilter}
    ${dynamicFilters}
    )
    ${finalSelection}
    ${sorting}
    ${pagination}
  `;

  try {
    const { rows } = await query(fullQuery, params);
    return mapUserProfilesToSwipe(rows);
  } catch (error) {
    console.error("Error in getUsersSearched:", error);
    throw error;
  }
};

export const validateAgeRange = (ageRange: number[]): boolean => {
  if (ageRange.length !== 2) return false;
  const [minAge, maxAge] = ageRange;
  return minAge >= 18 && maxAge <= 100 && minAge <= maxAge;
};

export const validateDistanceRange = (distanceRange: number[]): boolean => {
  if (distanceRange.length !== 2) return false;
  const [minDistance, maxDistance] = distanceRange;
  return minDistance >= 0 && maxDistance <= 20000 && minDistance <= maxDistance;
};

export const validateFameRatingRange = (fameRatingRange: number[]): boolean => {
  if (fameRatingRange.length !== 2) return false;
  const [minFameRating, maxFameRating] = fameRatingRange;
  return (
    minFameRating >= 0 && maxFameRating <= 100 && minFameRating <= maxFameRating
  );
};

export const validateInterests = (interests: string[]): boolean => {
  if (interests.length === 0 || interests.length > 10) return false;
  for (const interest of interests) {
    if (!isValidInterest(interest)) return false;
  }
  return true;
};
