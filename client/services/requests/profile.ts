import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getMyProfile = () => axiosInstance.get(API_ENDPOINTS.myProfile);
export const getUserProfile = (userId: string) =>
  axiosInstance.get(`${API_ENDPOINTS.userProfile}/${userId}`);
export const updateEmail = (email: string, password: string) =>
  axiosInstance.put(API_ENDPOINTS.updateEmail, { email, password });
