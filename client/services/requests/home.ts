import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getUser = () => axiosInstance.get(API_ENDPOINTS.user);
