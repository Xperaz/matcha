import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import * as historyService from "../services/history.service";
import { likes, visits } from "../types/history";

export const getLikes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId: string = req.user.id;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const page: number = parseInt(req.query.page as string) || 1;

    const likes: likes[] = await historyService.getLikesHistory(userId, limit, page);

    return res.status(200).json({
      success: true,
      data: likes,
    });
  } catch (error) {
    console.error("Error getting likes: ", error);
    return res.status(500).json({
      success: false,
      message: "Error getting likes",
    });
  }
};

export const getVisits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId: string = req.user.id;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const page: number = parseInt(req.query.page as string) || 1;

    const visits: visits[] = await historyService.getVisitsHistory(userId, limit, page);

    return res.status(200).json({
      success: true,
      data: visits,
    });
  } catch (error) {
    console.error("Error getting visits: ", error);
    return res.status(500).json({
      success: false,
      message: "Error getting visits",
    });
  }
};