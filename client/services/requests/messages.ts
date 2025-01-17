import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";
import { MessageFormValue } from "@/schemas/MessageSchema";

export const getChatList = () => axiosInstance.get(API_ENDPOINTS.chatList);

export const getMessagesHisotry = (otherUserId: string) =>
  axiosInstance.get(`${API_ENDPOINTS.messagesHisotry}/${otherUserId}`);

export const sendMessage = (data: MessageFormValue) =>
  axiosInstance.post(API_ENDPOINTS.sendMessage, data);
