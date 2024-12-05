import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { query } from "../config/db";

const signToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const matchPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


export async function signup(req: Request, res: Response): Promise<Response> {

  const { first_name, last_name, password, email, gender, age } = req.body;

  try {
    // Validate request data
    if (!first_name || !last_name || !password || !email || !gender || !age) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "You are under age",
      });
    }

    const emailCheckQuery = `SELECT email FROM users WHERE email = $1;`;
    const { rows } = await query(emailCheckQuery, [email]);

    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
      INSERT INTO users (first_name, last_name, password, email, gender, age)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const values = [first_name, last_name, hashedPassword, email, gender, age];
    const result = await query(insertUserQuery, values);

    const user_id = result.rows[0].id;

    const token = signToken(user_id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error from signup:", error);
    return res.status(500).json({
      success: false,
      message: "Error from signup",
    });
  }
};


export async function signin(req: Request, res: Response): Promise<Response> {
  
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailCheckQuery = `SELECT id, email, password FROM users WHERE email = $1;`;
    const { rows } = await query(emailCheckQuery, [email]);

    if (rows.length !== 1 || !(await matchPassword(password, rows[0].password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken(rows[0].id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Signin successful",
    });
  } catch (error) {
    console.error("Error from signin:", error);
    return res.status(500).json({
      success: false,
      message: "Error from signin",
    });
  }
};
