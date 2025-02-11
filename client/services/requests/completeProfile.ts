import { CompleteFormData } from "@/schemas/CompleteFormSchema";
import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";
import { AxiosResponse } from "axios";

export const completeProfile = async (
  data: CompleteFormData,
): Promise<AxiosResponse> =>
  await axiosInstance.post(API_ENDPOINTS.completeProfile, data);
