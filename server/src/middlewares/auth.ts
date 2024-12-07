import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { query } from "../config/db";

interface AuthenticatedRequest extends Request {
  user?: any; // TODO: Adjust `any` to your user type if defined
}

export const protectRoutes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded || !decoded.id) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
      return;
    }

    const getUserQuery = `SELECT * FROM users WHERE id = $1;`;
    const { rows } = await query(getUserQuery, [decoded.id]);

    if (rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = rows[0];

    next();
  } catch (error) {
    console.error("Error from authMiddleware:", error);
    res.status(500).json({
      success: false,
      message: "Error from authentication",
    });
  }
};
