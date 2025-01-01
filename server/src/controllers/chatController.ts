import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";

export const getMessages = (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Signout successful",
  });
};
