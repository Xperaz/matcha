import { LoginSchemaType } from "@/schemas/SignupSchema";
import { axiosPublicInstance } from "@/services/config";
import { API_ENDPOINTS } from "@/services/endpoints";

export const userLogin = async (data: LoginSchemaType) => {
  const res = await axiosPublicInstance.post(API_ENDPOINTS.login, {
    ...data,
  });

  // TODO: add jwt to browser

  return res.data;
};
