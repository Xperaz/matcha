"use client";
import { QUERY_KEYS } from "@/constants/query_keys";
import { verifyEmail } from "@/services/requests/emailVerification";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import InvalidResetLink from "../organisms/reset-password/InvalidResetLink";
import VerifyingResetLink from "../organisms/reset-password/VerifyingResetLink";
import { useAuthData } from "@/auth/useAuthData";

const VerifyEmail = () => {
  const searchPrams = useSearchParams();
  const token = searchPrams.get("token");
  const router = useRouter();
  const { userData, isAuthenticated } = useAuthData();

  const {
    isLoading: isVerifying,
    isError: isTokenInvalid,
    isSuccess,
  } = useQuery({
    queryKey: [QUERY_KEYS.verifyEmail, token],
    queryFn: () =>
      token ? verifyEmail(token) : Promise.reject("No token provided"),
    enabled: !!token,
    retry: false,
    gcTime: 0,
  });

  useEffect(() => {
    if (isSuccess && !isVerifying) {
      router.replace("/home");
    }
    if (isAuthenticated && userData?.email_verified) {
      router.replace("/home");
    }
  }, [router, isSuccess, isVerifying, isAuthenticated, userData]);

  if (isVerifying) {
    return <VerifyingResetLink />;
  }

  if (isTokenInvalid) {
    return <InvalidResetLink />;
  }

  return null;
};

export default VerifyEmail;
