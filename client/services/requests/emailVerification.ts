import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const confirmEamil = async () =>
  axiosInstance.post(`${API_ENDPOINTS.confirmEamil}`);

export const verifyEmail = async (token: string) =>
  axiosInstance.get(`${API_ENDPOINTS.verifyEmail}/?token=${token}`);
