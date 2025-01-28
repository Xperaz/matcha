import { SearchFilters } from "@/context/exploreContext";
import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const explore = async (searQuery: SearchFilters) => {
  const formattedFilters = {
    ageRange: searQuery.ageRange.join(","),
    fameRatingRange: searQuery.fameRange.join(","),
    distanceRange: searQuery.distance.join(","),
    interests: searQuery.interests.join(","),
  };
  return await axiosInstance.get(`${API_ENDPOINTS.explore}`, {
    params: formattedFilters,
  });
};
