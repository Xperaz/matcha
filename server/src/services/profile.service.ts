import { query } from "../config/db";
import { publicProfileDto, UserProfileDTO } from "../dtos/user/userProfileDto";

const mapUser = (user: any, interests: any): UserProfileDTO => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    biography: user.biography,
    fame_rating: user.fame_rating,
    sexual_preferences: user.sexual_preferences,
    age: user.age,
    city: user.city,
    country: user.country,
    interests: interests.map((interest: any) => interest.tag),
    profile_picture: user.profile_picture,
    gender: user.gender,
    profile_completed: user.profile_completed,
    is_google: user.is_google,
  };
};

const mapPublicProfile = (
  user: any,
  interests: any,
  images: string[],
  is_like: boolean,
  is_match: boolean,
  has_liked_you: boolean
): publicProfileDto => {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    biography: user.biography,
    fame_rating: user.fame_rating,
    sexual_preferences: user.sexual_preferences,
    age: user.age,
    city: user.city,
    country: user.country,
    interests: interests.map((interest: any) => interest.tag),
    profile_picture: user.profile_picture,
    pictures: images,
    gender: user.gender,
    is_active: user.is_active,
    last_connection: user.last_connection,
    is_like: is_like,
    is_match: is_match,
    has_liked_you: has_liked_you,
  };
};

const getUserImages = async (userId: string): Promise<string[]> => {
  const getUserImagesQuery: string = `
    SELECT picture_url FROM pictures
    WHERE user_id = $1;
  `;
  try {
    const { rows: images } = await query(getUserImagesQuery, [userId]);
    return images.map((image: any) => image.image_url);
  } catch (error) {
    console.error("Error getting user images: ", error);
    throw error;
  }
};

export const getMyProfile = async (
  userId: string
): Promise<UserProfileDTO | null> => {
  const getMyProfileQuery = `
    SELECT id, email, first_name, last_name, biography, fame_rating, age, city, country, profile_picture, sexual_preferences, gender, profile_completed, is_google 
    FROM users WHERE id = $1;
    `;
  const getInterestsQuery = `
    SELECT it.tag
    FROM interests i
    JOIN interest_tags it ON i.interest_id = it.id
    WHERE i.user_id = $1;
    `;
  try {
    const { rows: user } = await query(getMyProfileQuery, [userId]);
    const { rows: interests } = await query(getInterestsQuery, [userId]);

    if (user.length === 0) {
      return null;
    }

    return mapUser(user[0], interests);
  } catch (error) {
    console.error("Error getting my profile", error);
    throw error;
  }
};

const getLikeStatus = async (userId: string, receiverId: string) => {
  const checkLikeQuery = `
    SELECT status FROM likes
    WHERE initiator_id = $1 AND receiver_id = $2;
  `;

  const checkLikeBackQuery = `
    SELECT status FROM likes
    WHERE initiator_id = $2 AND receiver_id = $1;
  `;
  try {
    let liked: boolean = false;
    let likedYou: boolean = false;
    let match: boolean = false;

    const { rows: like } = await query(checkLikeQuery, [userId, receiverId]);
    const { rows: likeBack } = await query(checkLikeBackQuery, [
      userId,
      receiverId,
    ]);

    if (like.length > 0 && like[0].status === "LIKED") {
      liked = true;
    }
    if (likeBack.length > 0 && likeBack[0].status === "LIKED") {
      likedYou = true;
    }
    if (
      (like.length > 0 && like[0].status === "MATCH") ||
      (likeBack.length > 0 && likeBack[0].status === "MATCH")
    ) {
      match = true;
    }

    return { liked, likedYou, match };
  } catch (error) {
    console.error("Error getting like status", error);
    throw error;
  }
};

export const getUserProfile = async (
  userId: string,
  visitorId: string
): Promise<publicProfileDto | null> => {
  const getUserProfileQuery = `
    SELECT id, email, first_name, last_name, biography, fame_rating, age, city, country, profile_picture, sexual_preferences,
    gender, is_google, is_active, last_connection
    FROM users WHERE id = $1;
  `;

  const getInterestsQuery = `
    SELECT it.tag
      FROM interests i
      JOIN interest_tags it ON i.interest_id = it.id
      WHERE i.user_id = $1;
  `;

  try {
    const { rows: user } = await query(getUserProfileQuery, [userId]);
    const { rows: interests } = await query(getInterestsQuery, [userId]);
    const { liked, likedYou, match } = await getLikeStatus(visitorId, userId);
    const images = await getUserImages(userId);

    if (user.length === 0) {
      return null;
    }

    return mapPublicProfile(user[0], interests, images, liked, likedYou, match);
  } catch (error) {
    console.error("Error getting user profile", error);
    throw error;
  }
};

export const checkBlockedUser = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const checkBlockedQuery: string = `
    SELECT id FROM blocks
    WHERE blocker_id = $1 AND blocked_id = $2 OR blocker_id = $2 AND blocked_id = $1;
  `;
  try {
    const { rows: blockedUsers } = await query(checkBlockedQuery, [
      userId,
      receiverId,
    ]);

    if (blockedUsers.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking blocked user: ", error);
    throw error;
  }
};

export const updateProfileViews = async (
  userId: string,
  receiverId: string
): Promise<void> => {
  const updateProfileViewsQuery: string = `
    INSERT INTO visits (visitor_id, visited_id)
    VALUES ($1, $2);
  `;
  try {
    await query(updateProfileViewsQuery, [userId, receiverId]);
  } catch (error) {
    console.error("Error updating profile views: ", error);
    throw error;
  }
};
