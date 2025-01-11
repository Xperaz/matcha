import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getMyProfile = () => axiosInstance.get(API_ENDPOINTS.myProfile);
export const getUserProfile = (userId: string) =>
  axiosInstance.post(`${API_ENDPOINTS.userProfile}/${userId}`);
