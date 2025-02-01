import { forgotPasswordType } from "@/schemas/ForgotAngResetPassword";
import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";
import { ResetPasswordPayload } from "@/components/pages/ResetPassword";

export const forgotPassword = async (data: forgotPasswordType) =>
  axiosInstance.post(`${API_ENDPOINTS.forgotPassword}`, data);

export const verifyResetPassword = async (token: string) =>
  axiosInstance.get(`${API_ENDPOINTS.resetPassword}?token=${token}`);

export const resetPassword = async (data: ResetPasswordPayload) =>
  axiosInstance.post(`${API_ENDPOINTS.resetPassword}`, data);
