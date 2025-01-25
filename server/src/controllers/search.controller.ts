import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import * as searchService from "../services/search.service";

export const searchForUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const userId: string = req.user?.id;
  const { ageRange, distanceRange, fameRatingRange, interests } = req.query;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User ID not found",
    });
  }

  if (!ageRange || !distanceRange || !fameRatingRange || !interests) {
    return res.status(400).json({
      success: false,
      message: "Bad request: Missing search parameters",
    });
  }

  const ageRangeArray: number[] = (ageRange as string).split(",").map(Number);
  const distanceRangeArray: number[] = (distanceRange as string)
    .split(",")
    .map(Number);
  const fameRatingRangeArray: number[] = (fameRatingRange as string)
    .split(",")
    .map(Number);
  const interestsTags: string[] = (interests as string).split(",");

  const validFilters: boolean = searchService.validateSearchFilters(
    ageRangeArray,
    distanceRangeArray,
    fameRatingRangeArray,
    interestsTags
  );

  if (!validFilters) {
    return res.status(400).json({
      success: false,
      message: "Bad request: Invalid search parameters",
    });
  }

  const results = await searchService.getUsersSearched(userId, {
    minAge: ageRangeArray[0],
    maxAge: ageRangeArray[1],
    minFameRating: fameRatingRangeArray[0],
    maxFameRating: fameRatingRangeArray[1],
    minDistance: distanceRangeArray[0],
    maxDistance: distanceRangeArray[1],
    interests: interestsTags,
  });

  return res.status(200).json({
    success: true,
    message: "Search for users successful",
    data: results,
  });
};
