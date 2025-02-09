import { query } from "../config/db";
import cloudinary from "../config/cloudinary";
import { Response } from "express";
import {
  completeProfileReqeuest,
  isValidInterest,
  isValidPreference,
} from "../dtos/requests/completeProfileRequest";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";

export const updateProfileValues = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const {
    first_name,
    last_name,
    biography,
    interests,
    gender,
    sexual_preferences,
    profile_picture,
  } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      message: "User not found",
    });
  }

  const updates = [];
  const values = [];
  let paramCounter = 1;

  if (first_name) {
    updates.push(`first_name = $${paramCounter}`);
    values.push(first_name);
    paramCounter++;
  }
  if (last_name) {
    updates.push(`last_name = $${paramCounter}`);
    values.push(last_name);
    paramCounter++;
  }

  if (biography) {
    updates.push(`biography = $${paramCounter}`);
    values.push(biography);
    paramCounter++;
  }

  if (gender) {
    updates.push(`gender = $${paramCounter}`);
    values.push(gender);
    paramCounter++;
  }

  if (sexual_preferences) {
    if (!isValidPreference(sexual_preferences)) {
      res.status(400).json({
        error: "Invalid sexual preferences",
        invalidPreferences: [sexual_preferences],
      });
    }
    updates.push(`sexual_preferences = $${paramCounter}`);
    values.push(sexual_preferences);
    paramCounter++;
  }

  if (profile_picture) {
    const result = await cloudinary.uploader.upload(profile_picture);
    const profilePictureUrl = result.secure_url;
    updates.push(`profile_picture = $${paramCounter}`);
    values.push(profilePictureUrl);
    paramCounter++;
  }

  values.push(userId);

  return { userId, updates, values, paramCounter, interests };
};

export const isValidEmail = (email: string): boolean => {
  try {
    const emailRegex = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailRegex.test(email);
    return validEmail;
  } catch (error) {
    console.error("Error from validatin email:", error);
    return false;
  }
};

export const isValidPassword = (password: string): boolean => {
  try {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  } catch (error) {
    console.error("Error from validatin password:", error);
    return false;
  }
};

export const isValidImage = (image: string): boolean => {
  try {
    const imageRegex = /^data:image\/(png|jpg|jpeg);base64,/;
    return imageRegex.test(image);
  } catch (error) {
    console.error("Error from validatin image:", error);
    return false;
  }
};

export const isValidCompleteProfileData = (
  userData: completeProfileReqeuest
): string | null => {
  if (userData.biography.length < 10 || userData.biography.length > 500) {
    return "Biography should be between 10 and 500 characters";
  }

  if (userData.city.length < 2 || userData.city.length > 50) {
    return "City should be between 3 and 50 characters";
  }

  if (userData.country.length < 2 || userData.country.length > 50) {
    return "Country should be between 3 and 50 characters";
  }

  if (userData.interests.length < 3 || userData.interests.length > 10) {
    return "Interests should be between 3 and 10";
  }

  if (!isValidPreference(userData.preferences)) {
    return "invalid preference";
  }

  const invalidInterests: string[] = userData.interests.filter(
    (interest) => !isValidInterest(interest)
  );

  if (invalidInterests.length > 0) {
    return "Invalid interests";
  }

  if (userData.pictures.length !== 4) return "Images should be exactly 4";

  if (!userData.pictures.every((image) => isValidImage(image))) {
    return "Invalid images";
  }

  if (!isValidImage(userData.profile_picture)) {
    return "Invalid profile picture";
  }
  return null;
};

export const userEsists = async (id: string): Promise<boolean> => {
  const user = await query("SELECT email FROM users WHERE id = $1", [id]);
  return user.rows.length > 0;
};

export const isValidUserId = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
};

export const increaseFameRating = async (
  userId: string,
  ammount: number
): Promise<void> => {
  const increaseFameQuery = `
  UPDATE users
  SET fame_rating = 
    CASE 
      WHEN fame_rating = 100 THEN 100 
      WHEN fame_rating + $2 > 100 THEN 100
      ELSE fame_rating + $2
    END
  WHERE id = $1;
  `;
  try {
    await query(increaseFameQuery, [userId, ammount]);
  } catch (error) {
    console.error("Error increasing fame rating: ", error);
    throw error;
  }
};

export const decreaseFameRating = async (
  userId: string,
  ammount: number
): Promise<void> => {
  const decreaseFameQuery = `
  UPDATE users
  SET fame_rating = 
    CASE 
      WHEN fame_rating = 1 THEN 1 
      WHEN fame_rating - $2 < 1 THEN 1
      ELSE fame_rating - $2
    END
  WHERE id = $1;
  `;
  try {
    await query(decreaseFameQuery, [userId, ammount]);
  } catch (error) {
    console.error("Error decreasing fame rating: ", error);
    throw error;
  }
};

export const setUserOnline = async (userId: string): Promise<void> => {
  const setUserOnlineQuery = `
  UPDATE users
  SET is_active = true
  WHERE id = $1;
  `;
  try {
    await query(setUserOnlineQuery, [userId]);
  } catch (error) {
    console.error("Error setting user online: ", error);
    throw error;
  }
};

export const setUserOffline = async (userId: string): Promise<void> => {
  const setUserOfflineQuery = `
  UPDATE users
  SET is_active = false, last_connection = $1
  WHERE id = $2;
  `;
  try {
    const nowTime = new Date().toISOString();
    await query(setUserOfflineQuery, [userId, nowTime]);
  } catch (error) {
    console.error("Error setting user offline: ", error);
    throw error;
  }
};

const mapBasicInfo = (data: any): any => {
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    biography: data.biography,
    fame_rating: data.fame_rating,
    age: data.age,
    profile_completed: data.profile_completed,
    email_verified: data.email_verified,
    gender: data.gender,
    sexual_preferences: data.sexual_preferences,
    has_new_messages: data.new_messages_count > 0,
    has_new_notifications: data.new_notifications_count > 0,
    profile_picture: data.profile_picture,
  };
};

export const getBasicInfo = async (userId: string): Promise<any> => {
  const getUserInfoWithCountsQuery = `
SELECT
  u.id,
  u.first_name,
  u.last_name,
  u.profile_picture,
  u.email,
  u.biography,
  u.fame_rating,
  u.age,
  u.profile_completed,
  u.email_verified,
  u.gender,
  u.sexual_preferences,
  (
    SELECT COUNT(*)
    FROM messages m
    WHERE m.receiver_id = u.id AND m.is_read = false
  ) AS new_messages_count,
  (
    SELECT COUNT(*)
    FROM notifications n
    WHERE n.receiver_id = u.id AND n.is_read = false
  ) AS new_notifications_count
FROM users u
WHERE u.id = $1;
`;

  try {
    const { rows } = await query(getUserInfoWithCountsQuery, [userId]);
    return mapBasicInfo(rows[0]);
  } catch (error) {
    console.error("Error getting basic info: ", error);
    throw error;
  }
};
