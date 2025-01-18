import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getUser = () => axiosInstance.get(API_ENDPOINTS.user);
export const swipeRightReq = (userId: string) =>
  axiosInstance.post(`${API_ENDPOINTS.swipeRight}/${userId}`);
export const swipeLeftReq = (userId: string) =>
  axiosInstance.post(`${API_ENDPOINTS.swipeLeft}/${userId}`);
export const getProfilesToSwipeReq = () =>
  axiosInstance.get(API_ENDPOINTS.profilesToSwipe);
