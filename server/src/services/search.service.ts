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
    interests?: string[]; // Changed from tags to interests
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
      OR (initiator_id = u.id AND receiver_id = $1)
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
  // AND (
  //   CASE
  //     WHEN u.sexual_preferences = 'BOTH'
  //     OR u.sexual_preferences IS NULL THEN true
  //     ELSE u.sexual_preferences::text = (SELECT gender FROM user_data)::text
  //   END
  // )

  const params: any[] = [userId];
  let paramCounter = 2;
  let dynamicFilters = "";

  // Age filter
  if (filters?.minAge || filters?.maxAge) {
    dynamicFilters += ` AND age BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minAge ?? 18, filters.maxAge ?? 100);
    paramCounter += 2;
  }

  // Fame rating filter
  if (filters?.minFameRating || filters?.maxFameRating) {
    dynamicFilters += ` AND fame_rating BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minFameRating ?? 0, filters.maxFameRating ?? 100);
    paramCounter += 2;
  }

  // Interests filter
  if (filters?.interests && filters.interests.length > 0) {
    // Add to the SQL WHERE clause
    dynamicFilters += `
      AND (
        SELECT COUNT(DISTINCT it.tag)        -- Count unique matching tags
        FROM interests i                     -- Start from interests table
        JOIN interest_tags it                -- Join with interest_tags table
          ON i.interest_id = it.id          -- Match interest_id with interest_tags id
        WHERE i.user_id = u.id              -- For the current user being evaluated
        AND it.tag = ANY($${paramCounter}::varchar[])  -- Match against array of requested tags
      ) = $${paramCounter + 1}`; // Must equal the number of requested tags

    // Add two parameters to the query params array:
    params.push(
      filters.interests, // First param: The array of tags ['hiking', 'photography']
      filters.interests.length // Second param: The length of the array (2)
    );

    // Increment counter by 2 because we added two parameters
    paramCounter += 2;
  }

  // Distance filter
  let finalSelection = `SELECT * FROM potential_users WHERE 1=1`;

  if (filters?.minDistance || filters?.maxDistance) {
    finalSelection += ` AND distance BETWEEN $${paramCounter} AND $${
      paramCounter + 1
    }`;
    params.push(filters.minDistance ?? 0, filters.maxDistance ?? 20000);
    paramCounter += 2;
  }

  const sorting = `ORDER BY distance ASC LIMIT 50;`;

  const fullQuery = `
    ${userDataQuery}
    ${baseUsersQuery}
    ${blockUsersFilter}
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
    console.error("Error in getUsersSearched:", error);
    throw error;
  }
};

export const validateSearchFilters = (
  ageRange: number[],
  distanceRange: number[],
  fameRatingRange: number[],
  interests: string[]
): boolean => {
  try {
    if (
      ageRange.length !== 2 ||
      distanceRange.length !== 2 ||
      fameRatingRange.length !== 2 ||
      interests.length === 0 ||
      interests.length > 10
    ) {
      return false;
    }
    if (ageRange[0] < 18 || ageRange[1] > 100 || ageRange[0] > ageRange[1]) {
      return false;
    }
    if (
      distanceRange[0] < 0 ||
      distanceRange[1] > 20000 ||
      distanceRange[0] > distanceRange[1]
    ) {
      return false;
    }
    if (
      fameRatingRange[0] < 0 ||
      fameRatingRange[1] > 100 ||
      fameRatingRange[0] > fameRatingRange[1]
    ) {
      return false;
    }
    for (const interest of interests) {
      if (!isValidInterest(interest)) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error in validateSearchFilters:", error);
    throw error;
  }
};
