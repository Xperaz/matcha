import { EditProfileSchemaType } from "@/schemas/EditProfileSchema";
import { axiosInstance } from "../config";

import { API_ENDPOINTS } from "../endpoints";

export const getMyProfile = async () =>
  await axiosInstance.get(API_ENDPOINTS.myProfile);

export const getUserProfile = async (userId: string) =>
  await axiosInstance.get(`${API_ENDPOINTS.userProfile}/${userId}`);

export const updateEmail = async (email: string, password: string) =>
  await axiosInstance.put(API_ENDPOINTS.updateEmail, { email, password });

export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
) =>
  await axiosInstance.put(API_ENDPOINTS.updatePassword, {
    oldPassword,
    newPassword,
    confirmPassword,
  });

export const updateProfile = async (data: Partial<EditProfileSchemaType>) =>
  axiosInstance.patch(API_ENDPOINTS.updateProfile, data);

export const getLikesHistory = async (pageParam: number) =>
  await axiosInstance.get(
    `${API_ENDPOINTS.likesHistory}?limit=10&page=${pageParam}`,
  );

export const getVisitsHistory = async (pageParam: number) =>
  await axiosInstance.get(
    `${API_ENDPOINTS.visitsHistory}?limit=10&page=${pageParam}`,
  );
