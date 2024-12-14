"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";

const Messages = () => {
  return <div>Messages</div>;
};

export default withAppLayout(withProtectedRoute(Messages));
