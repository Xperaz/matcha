import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getImages = async () =>
  await axiosInstance.get(API_ENDPOINTS.images);
export const deleteImage = async (imageId: string) =>
  await axiosInstance.delete(`${API_ENDPOINTS.deleteImage}/${imageId}`);
export const uploadImage = async (image: string) =>
  await axiosInstance.post(API_ENDPOINTS.uploadImage, { image });
