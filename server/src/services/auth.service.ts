import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { query } from "../config/db";
import { userSignupRequest } from "../dtos/requests/userSignupRequest";
import { userSigninRequest } from "../dtos/requests/userSigninRequest";
import { sendMail } from "../config/mailer";
import { randomBytes } from "crypto";

export const checkUser = async (userData: userSigninRequest) => {
  try {
    const emailCheckQuery = `SELECT id, email, password, is_google FROM users WHERE email = $1;`;
    const { rows } = await query(emailCheckQuery, [userData.email]);
    if (rows.length !== 1) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error("error signin toke", error);
    throw error;
  }
};

export const signToken = (id: string): string => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("error signin toke", error);
    throw error;
  }
};

export const matchPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("error matching password", error);
    throw error;
  }
};

export const checkAvailableEmail = async (email: string): Promise<boolean> => {
  const emailCheckQuery = `SELECT email FROM users WHERE email = $1;`;

  try {
    const { rows } = await query(emailCheckQuery, [email]);

    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
};

export const insertUser = async (userData: userSignupRequest) => {
  const insertUserQuery = `
      INSERT INTO users (first_name, last_name, password, email, gender, age)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
      `;
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const values = [
      userData.first_name,
      userData.last_name,
      hashedPassword,
      userData.email,
      userData.gender,
      userData.age,
    ];
    const { rows: result } = await query(insertUserQuery, values);
    return result[0].id;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  const getUserQuery = `
    SELECT id, first_name, last_name, email, is_google
    FROM users
    WHERE email = $1;
  `;
  try {
    const { rows } = await query(getUserQuery, [email]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

export const generateResetToken = async (userId: string): Promise<string> => {
  const insertResetTokenQuery = `
    INSERT INTO password_reset_tokens (user_id, token, token_expiration)
    VALUES ($1, $2, $3)
    RETURNING token;
  `;

  try {
    const resetToken = randomBytes(48).toString("hex");

    const hasedToken = bcrypt.hashSync(resetToken, 10);

    const expireTime = new Date(Date.now() + 3600000); // 1 hour

    await query(insertResetTokenQuery, [userId, hasedToken, expireTime]);

    return resetToken;
  } catch (error) {
    console.error("Error generating reset token:", error);
    throw error;
  }
};

export const verifyResetToken = async (
  token: string
): Promise<{ userId: string; tokenId: string } | null> => {
  const nowData = new Date(Date.now());

  const verifyResetTokenQuery = `
    SELECT user_id, id, token
    FROM password_reset_tokens
    WHERE token_expiration > $1
    and used = false
  `;

  try {
    const { rows } = await query(verifyResetTokenQuery, [nowData]);

    if (rows.length === 0) {
      return null;
    }

    for (const row of rows) {
      const isMatch = await bcrypt.compare(token, row.token);

      if (isMatch) {
        return { userId: row.user_id, tokenId: row.id };
      }
    }
    return null;
  } catch (error) {
    console.error("Error verifying reset token:", error);
    throw error;
  }
};

export const updatePassword = async (
  userId: string,
  tokenId: string,
  password: string
) => {
  const checkIsGoogleQuery: string = `
      SELECT is_google FROM users
      WHERE id = $1;
    `;
  const updatePasswordQuery: string = `
      UPDATE users
      SET password = $1
      WHERE id = $2;
    `;
  const updateTokenQuery: string = `
      UPDATE password_reset_tokens
      SET used = true
      WHERE id = $1;
    `;
  try {
    await query("BEGIN");

    const { rows: isGoogle } = await query(checkIsGoogleQuery, [userId]);

    if (isGoogle[0].is_google) {
      return;
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);
    await query(updatePasswordQuery, [hashedPassword, userId]);
    await query(updateTokenQuery, [tokenId]);
    await query("COMMIT");

  } catch (error) {
    await query("ROLLBACK");
    console.error("Error updating password:", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  console.log("Sending reset password email to:", email);
  const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const emailContent = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetPasswordLink}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  try {
    await sendMail(email, "Reset Password", emailContent, emailContent);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};
