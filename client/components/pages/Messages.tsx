"use client";
import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import useSocketSetup from "@/hooks/useSocketSetup";

const Messages = () => {
  useSocketSetup();
  return <div>Messages</div>;
};

export default withAppLayout(withProtectedRoute(Messages));
