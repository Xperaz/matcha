"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";

const Notifications = () => {
  return <div>Notifications</div>;
};

export default withAppLayout(withProtectedRoute(Notifications));
