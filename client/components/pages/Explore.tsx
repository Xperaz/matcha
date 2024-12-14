"use client";
import withAppLayout from "../templates/layout/withAppLayout";
import withProtectedRoute from "@/auth/withProtectedRoute";

const Explore = () => {
  return <div>Explore</div>;
};

export default withAppLayout(withProtectedRoute(Explore));
