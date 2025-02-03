import { query } from "../config/db";
import cloudinary from "../config/cloudinary";
import { Response } from "express";
import {
  completeProfileReqeuest,
  isValidInterest,
} from "../dtos/requests/completeProfileRequest";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import bcrypt from "bcryptjs";
import * as userService from "../services/user.service";

export const completeProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userData: completeProfileReqeuest = req.body;
    const userId: any = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    if (
      !userData.biography ||
      !userData.interests ||
      !userData.latitude ||
      !userData.longitude ||
      !userData.preferences ||
      !userData.pictures ||
      !userData.profile_picture ||
      !userData.city ||
      !userData.country
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isValidUserData: string | null =
      userService.isValidCompleteProfileData(userData);
    if (isValidUserData) {
      return res.status(400).json({
        success: false,
        message: isValidUserData,
      });
    }
    let result: any;
    let profilePictureUrl: string;
    let pictures_urls: string[] = [];
    try {
      result = await cloudinary.uploader.upload(userData.profile_picture);
      profilePictureUrl = result.secure_url;

      for (const image of userData.pictures) {
        const imageResult: any = await cloudinary.uploader.upload(image);
        const imageUrl: string = imageResult.secure_url;
        pictures_urls.push(imageUrl);
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "can not open image",
      });
    }

    await query("BEGIN");

    const insertUserInfoQuery = `
          UPDATE users
          SET biography = $1,
              latitude = $2,
              longitude = $3,
              sexual_preferences = $4,
              profile_picture = $5,
              city = $6,
              country = $7,
              profile_completed = $8
          WHERE id = $9;
        `;
    await query(insertUserInfoQuery, [
      userData.biography,
      userData.latitude,
      userData.longitude,
      userData.preferences,
      profilePictureUrl,
      userData.city,
      userData.country,
      true,
      userId,
    ]);

    const insertUserImagesQuery = `
          INSERT INTO pictures (user_id, picture_url)
          VALUES ($1, unnest($2::text[]));
        `;
    await query(insertUserImagesQuery, [userId, pictures_urls]);

    const insertUserInterestsQuery = `
            INSERT INTO interests (user_id, interest_id)
            SELECT $1, id
            FROM interest_tags
            WHERE tag = ANY($2::text[])
            ON CONFLICT DO NOTHING;
        `;
    await query(insertUserInterestsQuery, [userId, userData.interests]);

    await query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
    });
  } catch (ex) {
    console.error("Error completing profile:", ex);

    await query("ROLLBACK");

    return res.status(500).json({
      success: false,
      message: "An error occurred while completing the profile",
    });
  }
};

export const updateEmail = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const userId = req.user?.id;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!userService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const checkUserQuery: string = `
      SELECT is_google, email FROM users
      WHERE id = $1;
    `;
    const { rows: user } = await query(checkUserQuery, [userId]);

    if (user[0].is_google) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be updated for google accounts",
      });
    }

    if (email === user[0].email) {
      return res.status(400).json({
        success: false,
        message: "Email is the same",
      });
    }

    const checkEmailQuery: string = `
      SELECT id FROM users
      WHERE email = $1;
    `;

    const { rows: checkEmail } = await query(checkEmailQuery, [email]);

    if (checkEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const getPasswordQuery: string = `
      SELECT password FROM users
      WHERE id = $1;
    `;
    const { rows } = await query(getPasswordQuery, [userId]);

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const userPassword: string = rows[0].password;

    const isMatch: boolean = await bcrypt.compare(password, userPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const updateEmailQuery: string = `
      UPDATE users
      SET email = $1, email_verified = false
      WHERE id = $2;
    `;
    await query(updateEmailQuery, [email, userId]);

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
    });
  } catch (ex) {
    console.error("Error updating email:", ex);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the email",
    });
  }
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user?.id;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!userService.isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "invalid password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "pssword don't match",
      });
    }

    const checkIsGoogleQuery: string = `
      SELECT is_google FROM users
      WHERE id = $1;
    `;
    const { rows: isGoogle } = await query(checkIsGoogleQuery, [userId]);

    if (isGoogle[0].is_google) {
      return res.status(400).json({
        success: false,
        message: "Password cannot be updated for google accounts",
      });
    }

    const getPasswordQuery: string = `
      SELECT password FROM users
      WHERE id = $1;
    `;
    const { rows } = await query(getPasswordQuery, [userId]);

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const userPassword: string = rows[0].password;

    const isMatch: boolean = await bcrypt.compare(oldPassword, userPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);

    const updatePasswordQuery: string = `
      UPDATE users
      SET password = $1
      WHERE id = $2;
    `;
    await query(updatePasswordQuery, [hashedPassword, userId]);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (ex) {
    console.error("Error updating password:", ex);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the password",
    });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await query("BEGIN");

    const { userId, updates, values, paramCounter, interests } =
      await userService.updateProfileValues(req, res);

    if (updates.length > 0) {
      const updateUserQuery = `
        UPDATE users
        SET ${updates.join(", ")}
        WHERE id = $${paramCounter}
      `;

      await query(updateUserQuery, values);
    }

    if (interests && Array.isArray(interests) && interests.length > 0) {
      for (const interest of interests) {
        if (!isValidInterest(interest)) {
          return res.status(400).json({
            error: "Invalid interests",
            invalidInterests: [interest],
          });
        }
      }
    }

    if (interests && Array.isArray(interests) && interests.length > 0) {
      await query("DELETE FROM interests WHERE user_id = $1", [userId]);
      for (const interest of interests) {
        const insertTagResult = await query(
          `SELECT id FROM interest_tags WHERE tag = $1`,
          [interest]
        );

        const tagId = insertTagResult.rows[0].id;

        await query(
          "INSERT INTO interests (user_id, interest_id) VALUES ($1, $2)",
          [userId, tagId]
        );
      }
    }

    await query("COMMIT");
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    await query("ROLLBACK");
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
