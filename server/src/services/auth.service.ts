import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { query } from "../config/db";
import { userSignupRequest } from "../dtos/requests/userSignupRequest";
import { userSigninRequest } from "../dtos/requests/userSigninRequest";

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
