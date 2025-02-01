import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { query } from "../config/db";
import {
  isValidGender,
  userSignupRequest,
} from "../dtos/requests/userSignupRequest";
import { userSigninRequest } from "../dtos/requests/userSigninRequest";
import { sendMail } from "../config/mailer";
import { randomBytes, createHash } from "crypto";
import { isValidEmail, isValidPassword } from "./user.service";

export const checkUser = async (userData: userSigninRequest) => {
  try {
    const emailCheckQuery = `SELECT id, email, password, is_google FROM users WHERE username = $1;`;
    const { rows } = await query(emailCheckQuery, [userData.username]);
    if (rows.length !== 1) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error("error signin", error);
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

export const checkAvailableEmail = async (
  email: string,
  username: string
): Promise<string | null> => {
  const emailCheckQuery = `SELECT email FROM users WHERE email = $1;`;
  const usernameCheckQuery = `SELECT username FROM users WHERE username = $1;`;

  try {
    const { rows: emailExit } = await query(emailCheckQuery, [email]);
    const { rows: userenameExist } = await query(usernameCheckQuery, [
      username,
    ]);

    if (emailExit.length > 0) {
      return "email already in use";
    }

    if (userenameExist.length > 0) {
      return "username already in use";
    }

    return null;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
};

export const insertUser = async (userData: userSignupRequest) => {
  const insertUserQuery = `
  INSERT INTO users (first_name, last_name, username, password, email, gender, age)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id;
  `;
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const values = [
      userData.first_name,
      userData.last_name,
      userData.username,
      hashedPassword,
      userData.email,
      userData.gender,
      userData.age,
    ];
    const { rows: result } = await query(insertUserQuery, values);
    const token: string = await generateToken(
      result[0].id,
      "email_verification"
    );
    await sendVerificationEmail(userData.email, token);
    return result[0].id;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  const getUserQuery = `
  SELECT id, first_name, last_name, email, is_google, email_verified
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

export const verifyEmail = async (userId: string, tokenId: string) => {
  const verifyEmailQuery = `
    UPDATE users
    SET email_verified = true
    WHERE id = $1;
  `;

  const updateTokenQuery = `
    UPDATE email_verification_tokens
    SET used = true
    WHERE id = $1;
  `;

  try {
    await query("BEGIN");

    await query(verifyEmailQuery, [userId]);
    await query(updateTokenQuery, [tokenId]);

    await query("COMMIT");
  } catch (error) {
    await query("ROLLBACK");
    console.error("Error verifying email:", error);
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

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const emailContent = `
    <h1>Email Verification</h1>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire in 1 hour.</p>
  `;
  try {
    await sendMail(email, "Verify Email", emailContent, emailContent);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const generateToken = async (
  userId: string,
  tokenType: "password_reset" | "email_verification"
): Promise<string> => {
  const invalidateTokensQuery = `
    UPDATE ${tokenType}_tokens
    SET used = true
    WHERE user_id = $1 AND used = false;
  `;
  const insertTokenQuery = `
      INSERT INTO ${tokenType}_tokens (user_id, token, token_expiration)
      VALUES ($1, $2, $3);
    `;

  try {
    await query(invalidateTokensQuery, [userId]);

    const token = randomBytes(48).toString("hex");

    const hashedToken = createHash("sha256").update(token).digest("hex");

    const expireTime = new Date(Date.now() + 3600000); // 1 hour

    await query(insertTokenQuery, [userId, hashedToken, expireTime]);

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

const compareTokens = (token: string, hashedToken: string): boolean => {
  const hashedTokenCompare = createHash("sha256").update(token).digest("hex");
  return hashedToken === hashedTokenCompare;
};

export const verifyToken = async (
  token: string,
  tokenType: "password_reset" | "email_verification"
): Promise<{ userId: string; tokenId: string } | null> => {
  const nowData = new Date(Date.now());

  const verifyTokenQuery = `
    SELECT user_id, id, token
    FROM ${tokenType}_tokens
    WHERE token_expiration > $1
    AND used = false
  `;

  try {
    const { rows } = await query(verifyTokenQuery, [nowData]);

    if (rows.length === 0) {
      return null;
    }

    for (const row of rows) {
      const isMatch = compareTokens(token, row.token);
      if (isMatch) {
        return { userId: row.user_id, tokenId: row.id };
      }
    }
    return null;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

export const checkRateLimit = async (
  userId: string,
  action: "email_verification" | "password_reset"
): Promise<boolean> => {
  const checkRateLimitQuery = `
    SELECT id, token, token_expiration
    FROM ${action}_tokens
    WHERE user_id = $1
    AND token_expiration > $2
    AND used = false;
  `;
  try {
    const dateNow = new Date(Date.now());
    const { rows } = await query(checkRateLimitQuery, [userId, dateNow]);
    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking rate limit:", error);
    throw error;
  }
};

export const isValidSignupData = (
  userData: userSignupRequest
): string | null => {
  if (userData.first_name.length < 2 || userData.first_name.length > 50) {
    return "First name must be between 2 and 50 characters";
  }

  if (userData.last_name.length < 2 || userData.last_name.length > 50) {
    return "Last name must be between 2 and 50 characters";
  }

  if (userData.username.length < 2 || userData.username.length > 50) {
    return "Username must be between 2 and 50 characters";
  }

  if (!isValidPassword(userData.password)) {
    return "Password is not valid";
  }

  if (userData.age < 18) {
    return "You are under age";
  }

  if (!isValidGender(userData.gender)) {
    return "invalid gender";
  }

  if (!isValidEmail(userData.email)) {
    return "Email is not valid";
  }
  return null;
};
