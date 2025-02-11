import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const getMatches = async (page: number, limit: number) =>
  await axiosInstance.get(API_ENDPOINTS.matches, { params: { page, limit } });
