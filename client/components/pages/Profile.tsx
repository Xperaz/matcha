"use client";
import React from "react";
import withAppLayout from "../templates/layout/withAppLayout";
import withProtectedRoute from "@/auth/withProtectedRoute";
import  UserProfile from "@/components/organisms/UserProfile"; 

const Profile = () => {
  return <div>
    <UserProfile />
    {/* Profile

    we need 

    profile picture
    fame rating ===- non editable
    first name
    last name
    gender
    sexual preferences
    biography
    email
    password
    tags
    4 pictures */}
  </div>;
};

export default withAppLayout(withProtectedRoute(Profile));
