import { SignupSchemaType } from "@/schemas/SignupSchema";
import { axiosPublicInstance } from "@/services/config";
import { API_ENDPOINTS } from "@/services/endpoints";
import Cookies from "js-cookie";

export const registerUser = async (data: SignupSchemaType) => {
  const res = await axiosPublicInstance.post(API_ENDPOINTS.register, {
    ...data,
  });

  if (res.data.accessToken) {
    const access_token = res.data.accessToken;
    Cookies.set("jwt", access_token);
  }

  return res.data;
};
