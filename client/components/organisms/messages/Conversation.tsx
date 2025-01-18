import { QUERY_KEYS } from "@/constants/query_keys";
import { getMessagesHisotry } from "@/services/requests/messages";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import { IMessageType } from "@/types/messages";
import MessageInput from "./MessageInput";
import { getUser } from "@/services/requests/home";
import { Loader } from "lucide-react";
import CustomError from "../CustomError";

const Conversations = () => {
  const params = useParams();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: async () => {
      const data = await getUser();
      return data.data.user;
    },
  });
  const conversationId = params.conversationId as string;

  const {
    data: messagesHistory,
    isLoading,
    error,
  } = useQuery<IMessageType[] | null>({
    queryKey: [QUERY_KEYS.messagesHistory, conversationId],
    queryFn: async () => {
      if (!conversationId) {
        return null;
      }

      const data = await getMessagesHisotry(conversationId);

      return data.data;
    },
  });

  useEffect(() => {
    if (messagesContainerRef.current && messagesHistory?.length) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messagesHistory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (!messagesHistory) {
    return (
      <CustomError
        title="Select a message"
        error=" Choose from your existing conversations, start a new one, or just keep swimming."
      />
    );
  }

  if (error) {
    return (
      <CustomError
        title="Something went wrong"
        error="something went wrong while trying to get your messages"
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 xl:p-8"
      >
        {messagesHistory.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            senderId={message.sender_id}
            currentUserId={userData.id}
            senderName={`${message.sender_first_name} ${message.sender_last_name}`}
          />
        ))}
      </div>
      <MessageInput
        receiverId={conversationId}
        userData={userData}
        containerRef={messagesContainerRef}
      />
    </div>
  );
};

export default Conversations;
