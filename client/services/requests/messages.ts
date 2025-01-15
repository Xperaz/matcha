import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const getChatList = () => axiosInstance.get(API_ENDPOINTS.chatList);

export const getMessagesHisotry = (otherUserId: string) =>
  axiosInstance.get(`${API_ENDPOINTS.messagesHisotry}/${otherUserId}`);
