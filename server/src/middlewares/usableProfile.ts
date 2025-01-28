import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./ahthenticatedRequest";

export const usableProfile =  (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user_profile_completed = req.user?.profile_completed;
    const user_email_verified = req.user?.email_verified;

    if (!user_profile_completed) {
      res.status(403).json({
        success: false,
        message: "Please complete your profile",
      });
      // res.redirect(`${process.env.CLIENT_URL}/complete-profile`);
      return;
    }

    if (!user_email_verified) {
      res.status(403).json({
        success: false,
        message: "Please verify your email",
      });
      // res.redirect(`${process.env.CLIENT_URL}/verify-email`);
      return;
    }

    next();
  } catch (error) {
    console.error("Error from completeProfile middleware:", error);
    res.status(500).json({
      success: false,
      message: "error from completeProfile middleware",
    });
  }
};
