"use client";
import React from "react";
import withAppLayout from "../templates/layout/withAppLayout";
import withProtectedRoute from "@/auth/withProtectedRoute";

const Profile = () => {
  return <div>Profile</div>;
};

export default withAppLayout(withProtectedRoute(Profile));
