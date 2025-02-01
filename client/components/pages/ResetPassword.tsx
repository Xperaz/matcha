"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  ResetPasswordSchema,
  ResetPasswordType,
} from "@/schemas/ForgotAngResetPassword";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  resetPassword,
  verifyResetPassword,
} from "@/services/requests/passwordReset";
import { useRouter, useSearchParams } from "next/navigation";
import { QUERY_KEYS } from "@/constants/query_keys";
import { toast } from "@/hooks/use-toast";
import VerifyingResetLink from "../organisms/reset-password/VerifyingResetLink";
import InvalidResetLink from "../organisms/reset-password/InvalidResetLink";

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

const ResetPassword = () => {
  const searchPrams = useSearchParams();
  const token = searchPrams.get("token");
  const router = useRouter();

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isLoading: isVerifying, isError: isTokenInvalid } = useQuery({
    queryKey: [QUERY_KEYS.verifyResetToken, token],
    queryFn: () =>
      token ? verifyResetPassword(token) : Promise.reject("No token provided"),
    enabled: !!token,
    retry: false,
    gcTime: 0,
  });

  const {
    mutate: resetPasswordMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: "Password reset successfully",
      });
      router.push("/login");
    },
  });

  const onSubmit = async (data: ResetPasswordType) => {
    if (token) {
      const payload = {
        password: data.password,
        token: token,
      };
      resetPasswordMutation(payload);
    }
  };

  if (isVerifying) {
    return <VerifyingResetLink />;
  }

  if (isTokenInvalid) {
    return <InvalidResetLink />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset password
          </CardTitle>
          <CardDescription className="text-center"></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your new password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                Reset password
              </Button>

              {isSuccess && (
                <p className="text-green-500 text-center">
                  Reset instructions sent to your email
                </p>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
