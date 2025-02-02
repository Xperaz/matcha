"use client";
import withProtectedRoute from "@/auth/withProtectedRoute";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { confirmEamil } from "@/services/requests/emailVerification";
import { useAuthData } from "@/auth/useAuthData";
import { useRouter } from "next/navigation";
import Loader from "../organisms/common/Loader";

const ConfirmEmail = () => {
  const { isAuthenticated, userData, isLoading } = useAuthData();
  const router = useRouter();

  const {
    isPending,
    isSuccess,
    mutate: confirmEamilMutation,
  } = useMutation({
    mutationFn: confirmEamil,
  });

  useEffect(() => {
    if (isAuthenticated && userData?.email_verified) {
      router.replace("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userData]);

  const handleConfirmEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirmEamilMutation();
  };

  return (
    <>
      {!isLoading ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Confirm Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfirmEmail} className="space-y-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  Send Confirm Email
                </Button>

                {isSuccess && (
                  <p className="text-green-500 text-center">
                    Email has been sent successfully
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default withProtectedRoute(ConfirmEmail);
