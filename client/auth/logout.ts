import { axiosPublicInstance } from "@/services/config";
import { API_ENDPOINTS } from "@/services/endpoints";
import Cookies from "js-cookie";

export const logout = async () => {
  const res = await axiosPublicInstance.post(API_ENDPOINTS.logout);

  if (res.status === 200) {
    Cookies.remove("jwt", { sameSite: "Lax", secure: true });
  }
  return res;
};
