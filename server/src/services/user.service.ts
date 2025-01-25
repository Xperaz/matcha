import { query } from "../config/db";
import cloudinary from "../config/cloudinary";
import { Response } from "express";
import {
  completeProfileReqeuest,
  isValidInterest,
  isValidPreference,
} from "../dtos/requests/completeProfileRequest";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import bcrypt from "bcryptjs";

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
