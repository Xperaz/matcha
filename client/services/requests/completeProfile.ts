import { CompleteFormData } from "@/schemas/CompleteFormSchema";
import { axiosInstance } from "../config";
import { API_ENDPOINTS } from "../endpoints";
import { AxiosResponse } from "axios";

export const completeProfile = (
  data: CompleteFormData,
): Promise<AxiosResponse> =>
  axiosInstance.post(API_ENDPOINTS.completeProfile, data);
