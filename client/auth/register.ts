import { SignupSchemaType } from "@/schemas/SignupSchema";
import { axiosPublicInstance } from "@/services/config";
import { API_ENDPOINTS } from "@/services/endpoints";

export const registerUser = async (data: SignupSchemaType) => {
  const res = await axiosPublicInstance.post(API_ENDPOINTS.register, {
    ...data,
  });

  return res.data;
};
