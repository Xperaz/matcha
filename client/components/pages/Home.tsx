"use client";
import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";

const Home = () => {
  return <div>home page</div>;
};

export default withAppLayout(withProtectedRoute(Home));
