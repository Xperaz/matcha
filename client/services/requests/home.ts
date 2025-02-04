import { Filters } from "@/types/filters";
import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getUser = async () => await axiosInstance.get(API_ENDPOINTS.user);

export const swipeRightReq = async (userId: string) =>
  await axiosInstance.post(`${API_ENDPOINTS.swipeRight}/${userId}`);

export const swipeLeftReq = async (userId: string) =>
  await axiosInstance.post(`${API_ENDPOINTS.swipeLeft}/${userId}`);

export const getProfilesToSwipeReq = async (filters: Filters) => {
  const formattedFilters = {
    ageRange: filters.ageRange.join(","),
    distanceRange: filters.distanceRange.join(","),
    fameRatingRange: filters.fameRatingRange.join(","),
    commonInterests: filters.commonInterests,
    sort: filters.sortBy,
  };

  return await axiosInstance.get(API_ENDPOINTS.profilesToSwipe, {
    params: formattedFilters,
  });
};
