import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const reportUser = (userId: string) =>
  axiosInstance.post(`${API_ENDPOINTS.reportUser}`, { userId });

export const blockUser = (userId: string) =>
  axiosInstance.post(`${API_ENDPOINTS.blockUser}`, { userId });

export const likeUser = (userId: string) =>
  axiosInstance.post(`${API_ENDPOINTS.likeUser}/${userId}`);

export const unlikeUser = (userId: string) =>
  axiosInstance.put(`${API_ENDPOINTS.unlikeUser}/${userId}`);

export const unmatchUser = (userId: string) =>
  axiosInstance.put(`${API_ENDPOINTS.unmatchUser}/${userId}`);
