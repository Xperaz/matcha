import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const getNotifications = async (page: number, limit: number) =>
  await axiosInstance.get(API_ENDPOINTS.notifications, {
    params: { page, limit },
  });
