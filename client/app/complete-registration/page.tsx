import withProtectedRoute from "@/auth/withProtectedRoute";
import React from "react";

const page = () => {
  return <div>page</div>;
};

export default withProtectedRoute(page);
