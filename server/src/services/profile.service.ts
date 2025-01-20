import { query } from "../config/db";
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { UserProfileDTO } from "../dtos/user/userProfileDto";

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
