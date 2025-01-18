import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";

export const getMatches = (page: number, limit: number) =>
  axiosInstance.get(API_ENDPOINTS.matches, { params: { page, limit } });
