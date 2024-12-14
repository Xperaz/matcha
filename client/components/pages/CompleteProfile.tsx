"use client";
import withProtectedRoute from "@/auth/withProtectedRoute";
import React from "react";
import CompleteProfileForm from "../organisms/complete-profile/CompleteProfileForm";

const CompleteProfile = () => {
  return (
    <div className="">
      <CompleteProfileForm />
    </div>
  );
};

export default withProtectedRoute(CompleteProfile);
