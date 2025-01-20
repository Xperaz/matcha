"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updatePassword } from "@/services/requests/profile";
import { CustomError } from "@/auth/types";
import {
  PasswordUpdateSchema,
  PasswordUpdateSchemaType,
} from "@/schemas/PasswordUpdateShema";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

const PasswordSection = ({ is_google }: { is_google: boolean }) => {
  const [open, setOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordUpdateSchemaType>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: updatePasswordMutation, error } = useMutation<
    unknown,
    CustomError,
    PasswordUpdateSchemaType
  >({
    mutationFn: async (data) => {
      await updatePassword(
        data.oldPassword,
        data.newPassword,
        data.confirmPassword,
      );
    },
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const onSubmit = (data: PasswordUpdateSchemaType) => {
    if (data.newPassword === data.oldPassword) {
      form.setError("newPassword", {
        message: "New password must be different from current password",
      });
      return;
    }
    if (data.newPassword != data.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Password don't match",
      });
      return;
    }

    updatePasswordMutation(data);
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Password</span>
        <span className="text-sm w-[300px] overflow-hidden">********</span>
      </div>
      <div className="flex items-center justify-end mr-10">
        <Dialog
          open={open}
          onOpenChange={(newOpen) => {
            if (!is_google) {
              setOpen(newOpen);
              if (!newOpen) {
                form.reset();
              }
            }
          }}
        >
          {is_google ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-8 px-2 text-sm opacity-50">
                    Edit Password
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Password cannot be updated for google accounts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DialogTrigger asChild>
              <Button className="h-8 px-2 text-sm">Edit Password</Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Password</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-md">
                    {error.response?.data?.message}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 "
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 "
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
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
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 "
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PasswordSection;
