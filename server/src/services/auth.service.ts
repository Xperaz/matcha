import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { query } from "../config/db";
import {
  userSignupRequest,
  isValidGender,
} from "../dtos/requests/userSignupRequest";
import { userSigninRequest } from "../dtos/requests/userSigninRequest";

export const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const matchPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const checkAvailableEmail = async (email: string) => {
  const emailCheckQuery = `SELECT email FROM users WHERE email = $1;`;

  const { rows } = await query(emailCheckQuery, [email]);

  if (rows.length > 0) {
    return true;
  }
  return false;
};

export const insertUser = async (userData: userSignupRequest) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const insertUserQuery = `
          INSERT INTO users (first_name, last_name, password, email, gender, age)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id;
        `;
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
};
