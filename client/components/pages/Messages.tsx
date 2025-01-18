"use client";
import withProtectedRoute from "@/auth/withProtectedRoute";
import Conversation from "./Conversation";

const Messages = () => {
  return <Conversation />;
};

export default withProtectedRoute(Messages);
