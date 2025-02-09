import ForgotPassword from "@/components/pages/ForgotPassword";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ForgotPassword />
    </Suspense>
  );
};

export default page;
