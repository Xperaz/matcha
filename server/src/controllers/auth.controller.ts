import { Request, Response } from "express";
import {
  userSignupRequest,
  isValidGender,
} from "../dtos/requests/userSignupRequest";
import { userSigninRequest } from "../dtos/requests/userSigninRequest";
import * as authService from "../services/auth.service";
import * as googleService from "../services/google.service";

export async function signup(req: Request, res: Response): Promise<Response> {
  try {
    const userData: userSignupRequest = req.body;
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.password ||
      !userData.email ||
      !userData.gender ||
      !userData.age
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (userData.password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (userData.age < 18) {
      return res.status(400).json({
        success: false,
        message: "You are under age",
      });
    }

    if (!isValidGender(userData.gender)) {
      return res.status(400).json({
        success: false,
        message: "invalid gender",
      });
    }

    const emailExist = await authService.checkAvailableEmail(userData.email);

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const user_id = await authService.insertUser(userData);

    const token = authService.signToken(user_id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error from signup:", error);
    return res.status(500).json({
      success: false,
      message: "Error from signup",
    });
  }
}

export async function signin(req: Request, res: Response): Promise<Response> {
  const userData: userSigninRequest = req.body;

  try {
    if (!userData.email || !userData.password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const dbUser = await authService.checkUser(userData);

    if (dbUser && dbUser.is_google === true) {
      return res.status(400).json({
        success: false,
        message: "this email is registered with google",
      });
    }

    if (
      !dbUser ||
      !(await authService.matchPassword(userData.password, dbUser.password))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = authService.signToken(dbUser.id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error from signin:", error);
    return res.status(500).json({
      success: false,
      message: "Error from signin",
    });
  }
}


export const googleOauthHandler = async (req: Request, res: Response) => {
  try {
    const code: string = req.query.code as string;
    const { id_token, access_token } = await googleService.getGoogleAauthTokens({ code });
    const googleUser: googleService.GoogleUserInfo = await googleService.getGoogleUser({
      id_token,
      access_token,
    });

    const token = await googleService.generateToken(googleUser);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    res.redirect("http://localhost:3000/home");
  } catch (error) {
    console.error("error getting google auth credentials", error);
    res.redirect("http://localhost:3000/login");
  }
};

export const singout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  res.clearCookie("jwt");
  return res.status(200).json({
    success: true,
    message: "Signout successful",
  });
};
