import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const getNotifications = async (
  limit: number,
  last_notif: string | null,
) =>
  await axiosInstance.get(API_ENDPOINTS.notifications, {
    params: { limit, last_notif },
  });
