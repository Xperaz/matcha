import VerifyEmail from "@/components/pages/VerifyEmail";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
};

export default page;
