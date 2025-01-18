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
import { updateEmail } from "@/services/requests/profile";
import { CustomError } from "@/auth/types";
import {
  emailUpdateSchema,
  EmailUpdateSchemaType,
} from "@/schemas/EmailUpdateSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";

const EmailSection = ({ email }: { email: string }) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<EmailUpdateSchemaType>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const { mutate: updateEmailMutation, error } = useMutation<
    unknown,
    CustomError,
    EmailUpdateSchemaType
  >({
    mutationFn: async (data) => {
      await updateEmail(data.newEmail, data.password);
    },
    onSuccess: () => {
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profileData] });
    },
  });

  const onSubmit = (data: EmailUpdateSchemaType) => {
    if (data.newEmail === email) {
      form.setError("newEmail", {
        message: "New email must be different from current email",
      });
      return;
    }

    updateEmailMutation(data);
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between ">
        <span className="text-sm text-gray-500">Email</span>
        <span className="text-sm w-[300px] overflow-hidden">{email}</span>
      </div>
      <div className="flex items-center justify-end mr-10">
        <Dialog
          open={open}
          onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="h-8 px-2 text-sm">Edit Email</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Email</DialogTitle>
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
                  name="newEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new email"
                          {...field}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
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
                  <Button type="submit">Update Email</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmailSection;
