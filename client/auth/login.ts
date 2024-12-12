import { LoginSchemaType } from "@/schemas/SignupSchema";
import { axiosPublicInstance } from "@/services/config";
import { API_ENDPOINTS } from "@/services/endpoints";
import Cookies from "js-cookie";

export const userLogin = async (data: LoginSchemaType) => {
  const res = await axiosPublicInstance.post(API_ENDPOINTS.login, {
    ...data,
  });

  if (res.data.accessToken) {
    const access_token = res.data.accessToken;
    Cookies.set("jwt", access_token);
  }

  return res.data;
};
