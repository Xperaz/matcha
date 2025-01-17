"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { QUERY_KEYS } from "@/constants/query_keys";
import { MessageFormValue, messageSchema } from "@/schemas/MessageSchema";
import { sendMessage } from "@/services/requests/messages";
import { IUserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

interface MessageInputprops {
  receiverId: string;
  userData: IUserType;
  containerRef: React.RefObject<HTMLDivElement>;
}

const MessageInput: FC<MessageInputprops> = ({
  receiverId,
  userData,
  containerRef,
}) => {
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      if (
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 150
      ) {
        scrollToBottom();
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [containerRef]);

  const form = useForm<MessageFormValue>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      receiver_id: receiverId,
    },
  });

  const { mutate: sendMessageMutate, isPending } = useMutation({
    mutationFn: async (payload: MessageFormValue) => {
      return sendMessage(payload);
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.messagesHistory, receiverId],
      });

      const previousMessages = queryClient.getQueryData([
        QUERY_KEYS.messagesHistory,
        receiverId,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.messagesHistory, receiverId],
        (old: any[]) => {
          const optimisticMessage = {
            id: Date.now().toString(),
            content: newMessage.content,
            timestamp: new Date().toISOString(),
            sender_id: userData?.id,
            sender_first_name: userData?.first_name,
            sender_last_name: userData?.last_name,
            receiver_id: receiverId,
          };
          return [...(old || []), optimisticMessage];
        },
      );

      requestAnimationFrame(scrollToBottom);

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.messagesHistory, receiverId],
        context?.previousMessages,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.messagesHistory, receiverId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.chatList],
      });
      form.reset();
      requestAnimationFrame(scrollToBottom);
    },
  });

  const handleSendMessage = (value: MessageFormValue) => {
    const payload = {
      ...value,
      receiver_id: receiverId,
    };

    sendMessageMutate(payload);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSendMessage)();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSendMessage)}
        className="flex gap-2 bg-background z-20 sticky bottom-4 px-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1 w-full">
              <FormControl>
                <Textarea
                  placeholder="Type a message..."
                  {...field}
                  disabled={isPending}
                  className="focus-visible:ring-0 resize-none min-h-[40px] max-h-[120px] py-2"
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
      {form.formState.errors.content && (
        <p className="text-red-500 px-4">
          {form.formState.errors.content.message}
        </p>
      )}
    </Form>
  );
};

export default MessageInput;
