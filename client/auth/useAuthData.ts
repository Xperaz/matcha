/* eslint-disable no-unused-vars */
import { useState } from "react";

export const useAuthData = () => {
  // TODO: Temp state until, user api get ready
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return {
    userData,
    isAuthenticated,
    isLoading,
  };
};
