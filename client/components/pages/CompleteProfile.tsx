"use client";
import withProtectedRoute from "@/auth/withProtectedRoute";
import React from "react";
import CompleteProfileForm from "../organisms/complete-profile/CompleteProfileForm";
import { FormProvider } from "@/context/completeFormContext";
import { useAuthData } from "@/auth/useAuthData";
import { useRouter } from "next/navigation";
import Loader from "../organisms/common/Loader";

const CompleteProfile = () => {
  const { isAuthenticated, isLoading, userData } = useAuthData();
  const router = useRouter();

  if (isAuthenticated && userData?.profile_completed) {
    router.replace("/home");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="">
      <FormProvider>
        <CompleteProfileForm />
      </FormProvider>
    </div>
  );
};

export default withProtectedRoute(CompleteProfile);
