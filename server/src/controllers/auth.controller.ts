import { Request, Response } from "express";
import { userSignupRequest } from "../dtos/requests/userSignupRequest";
import { userSigninRequest } from "../dtos/requests/userSigninRequest";
import * as authService from "../services/auth.service";
import * as googleService from "../services/google.service";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { isValidPassword } from "../services/user.service";

export async function signup(req: Request, res: Response): Promise<Response> {
  try {
    const userData: userSignupRequest = req.body;
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.password ||
      !userData.email ||
      !userData.gender ||
      !userData.age ||
      !userData.username
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isValidSignupData: string | null =
      authService.isValidSignupData(userData);

    if (isValidSignupData) {
      return res.status(400).json({
        success: false,
        message: isValidSignupData,
      });
    }

    const alreadyExist: string | null = await authService.checkAvailableEmail(
      userData.email,
      userData.username
    );

    if (alreadyExist) {
      return res.status(400).json({
        success: false,
        message: alreadyExist,
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
  try {
    const userData: userSigninRequest = req.body;
    if (!userData.username || !userData.password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const dbUser = await authService.checkUser(userData);

    if (dbUser && dbUser.is_google === true) {
      return res.status(400).json({
        success: false,
        message:
          "this user is registered with google, please login with google",
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
    const { id_token, access_token } = await googleService.getGoogleAauthTokens(
      { code }
    );
    const googleUser: googleService.GoogleUserInfo =
      await googleService.getGoogleUser({
        id_token,
        access_token,
      });

    const token = await googleService.generateToken(googleUser);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    res.redirect(`${process.env.CLIENT_URL}/home`);
  } catch (error) {
    console.error("error getting google auth credentials", error);
    res.redirect(`${process.env.CLIENT_URL}/login`);
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

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await authService.getUserByEmail(email);

    if (!user || user.is_google === true) {
      return res.status(200).json({
        success: true,
        message: "Reset password email sent",
      });
    }

    const reateLimit = await authService.checkRateLimit(
      user.id,
      "password_reset"
    );

    if (reateLimit) {
      return res.status(200).json({
        success: false,
        message: "Reset password email sent",
      });
    }

    const resetToken: string = await authService.generateToken(
      user.id,
      "password_reset"
    );

    await authService.sendResetPasswordEmail(user.email, resetToken);

    return res.status(200).json({
      success: true,
      message: "Reset password email sent",
    });
  } catch (error) {
    console.error("Error from reset password:", error);
    return res.status(500).json({
      success: false,
      message: "Error from reset password",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const validToken: {
      userId: string;
      tokenId: string;
    } | null = await authService.verifyToken(token as string, "password_reset");

    if (!validToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    await authService.updatePassword(
      validToken.userId,
      validToken.tokenId,
      password
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error from reset password:", error);
    return res.status(500).json({
      success: false,
      message: "Error from reset password",
    });
  }
};

export const getResetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const validToken: {
      userId: string;
      tokenId: string;
    } | null = await authService.verifyToken(token as string, "password_reset");

    if (!validToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Valid token",
    });
  } catch (error) {
    console.error("Error from get reset password:", error);
    return res.status(500).json({
      success: false,
      message: "Error from get reset password",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const validToken: {
      userId: string;
      tokenId: string;
    } | null = await authService.verifyToken(
      token as string,
      "email_verification"
    );

    if (!validToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    await authService.verifyEmail(validToken.userId, validToken.tokenId);

    return res.status(200).json({
      success: true,
      message: "Email verified",
    });
  } catch (error) {
    console.error("Error from verify email:", error);
    return res.status(500).json({
      success: false,
      message: "Error from verify email",
    });
  }
};

export const sendVerificationEmail = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { email, id } = req.user;

    if (!email || !id) {
      return res.status(400).json({
        success: false,
        message: "user don't have email",
      });
    }

    const user = await authService.getUserByEmail(email);

    if (!user || user.is_google === true || user.email_verified === true) {
      return res.status(200).json({
        success: true,
        message: "Verification email sent",
      });
    }

    const reateLimit = await authService.checkRateLimit(
      user.id,
      "email_verification"
    );

    if (reateLimit) {
      return res.status(200).json({
        success: false,
        message: "Verification email sent",
      });
    }

    const token: string = await authService.generateToken(
      id,
      "email_verification"
    );

    await authService.sendVerificationEmail(email, token);

    return res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Error from send verification email:", error);
    return res.status(500).json({
      success: false,
      message: "Error from send verification email",
    });
  }
};
