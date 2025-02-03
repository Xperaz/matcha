import { SearchFilters } from "@/context/exploreContext";
import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const explore = async (
  searchQuery: SearchFilters,
  pageParam: number,
) => {
  const formattedFilters = {
    ageRange: searchQuery.ageRange.join(","),
    fameRatingRange: searchQuery.fameRange.join(","),
    distanceRange: searchQuery.distance.join(","),
    interests: searchQuery.interests.join(","),
    sort: searchQuery.sortBy,
  };

  return await axiosInstance.get(
    `${API_ENDPOINTS.explore}?limit=12&page=${pageParam}`,
    {
      params: formattedFilters,
    },
  );
};
