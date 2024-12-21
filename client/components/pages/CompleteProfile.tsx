"use client";
// import withProtectedRoute from "@/auth/withProtectedRoute";
import React from "react";
import CompleteProfileForm from "../organisms/complete-profile/CompleteProfileForm";
import { FormProvider } from "@/context/completeFormContext";

const CompleteProfile = () => {
  return (
    <div className="">
      <FormProvider>
        <CompleteProfileForm />
      </FormProvider>
    </div>
  );
};

// export default withProtectedRoute(CompleteProfile);

export default CompleteProfile;
