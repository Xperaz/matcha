import { useEffect, useState } from "react";
import { IUserType } from "@/types/user";
import Cookies from "js-cookie";
import { API_ENDPOINTS } from "@/services/endpoints";
import axios from "axios";

export const useAuthData = () => {
  const [userData, setUserData] = useState<IUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const access_token = Cookies.get("jwt");
    if (!access_token) {
      setIsLoading(false);
      // eslint-disable-next-line no-console
      console.error("token is missed or invalid");
      return;
    }
    const fetchUser = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        };

        const res = await axios.get(`${API_ENDPOINTS.user}`, {
          headers,
          withCredentials: true,
        });

        setUserData(res.data as IUserType);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching user data:", error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    userData,
    isAuthenticated: !!userData,
    isLoading,
  };
};
