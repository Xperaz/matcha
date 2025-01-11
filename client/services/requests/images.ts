import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getImages = () => axiosInstance.get(API_ENDPOINTS.images);
export const deleteImage = (imageId: string) =>
  axiosInstance.delete(`${API_ENDPOINTS.deleteImage}/${imageId}`);
export const uploadImage = (data: FormData) =>
  axiosInstance.post(API_ENDPOINTS.uploadImage, data);
