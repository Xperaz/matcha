import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import * as searchService from "../services/search.service";

export const searchForUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId: string = req.user?.id;
    const { ageRange, distanceRange, fameRatingRange, interests, sort } =
      req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    console.log("searching for users with filters", req.query);
    // Parse and validate optional parameters
    const ageRangeArray: number[] | undefined = ageRange
      ? (ageRange as string).split(",").map(Number)
      : undefined;
    const distanceRangeArray: number[] | undefined = distanceRange
      ? (distanceRange as string).split(",").map(Number)
      : undefined;
    const fameRatingRangeArray: number[] | undefined = fameRatingRange
      ? (fameRatingRange as string).split(",").map(Number)
      : undefined;
    const interestsTags: string[] | undefined = interests
      ? (interests as string).split(",")
      : undefined;
    const sortVar: string = sort ? (sort as string) : "distance";

    // Validate parameters if they exist
    if (ageRangeArray && !searchService.validateAgeRange(ageRangeArray)) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid age range",
      });
    }

    if (
      distanceRangeArray &&
      !searchService.validateDistanceRange(distanceRangeArray)
    ) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid distance range",
      });
    }

    if (
      fameRatingRangeArray &&
      !searchService.validateFameRatingRange(fameRatingRangeArray)
    ) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid fame rating range",
      });
    }

    if (interestsTags && !searchService.validateInterests(interestsTags)) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid interests",
      });
    }

    if (sort !== "distance" && sort !== "fame_rating" && sort !== "age" && sort !== "interests") {
      return res.status(400).json({
        success: false,
        message: "Bad request: Invalid sort parameter",
      });
    }

    const results = await searchService.getUsersSearched(userId, {
      minAge: ageRangeArray ? ageRangeArray[0] : undefined,
      maxAge: ageRangeArray ? ageRangeArray[1] : undefined,
      minDistance: distanceRangeArray ? distanceRangeArray[0] : undefined,
      maxDistance: distanceRangeArray ? distanceRangeArray[1] : undefined,
      minFameRating: fameRatingRangeArray ? fameRatingRangeArray[0] : undefined,
      maxFameRating: fameRatingRangeArray ? fameRatingRangeArray[1] : undefined,
      interests: interestsTags,
      sortBy: sortVar,
    });

    console.log("search results", results.length);

    return res.status(200).json({
      success: true,
      message: "Search for users successful",
      data: results,
    });
  } catch (error) {
    console.error("error searching for users", error);
    return res.status(500).json({
      success: false,
      message: "error searching for users",
    });
  }
};
