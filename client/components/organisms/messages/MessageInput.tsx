"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MessageFormValue, messageSchema } from "@/schemas/MessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import React, { FC } from "react";
import { useForm } from "react-hook-form";

interface MessageInputprops {
  receiverId: string;
}

// eslint-disable-next-line no-unused-vars
const MessageInput: FC<MessageInputprops> = ({ receiverId }) => {
  const form = useForm<MessageFormValue>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = false;

  return (
    <Form {...form}>
      <form onSubmit={() => {}} className="p-4 flex gap-2 bg-background z-20">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1 w-full">
              <FormControl>
                <Input
                  placeholder="Type a message..."
                  {...field}
                  disabled={isLoading}
                  className="focus-visible:ring-0"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default MessageInput;
