import { QUERY_KEYS } from "@/constants/query_keys";
import { getMessagesHisotry } from "@/services/requests/messages";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import MessageCard from "./MessageCard";
import { IMessageType } from "@/types/messages";
import MessageInput from "./MessageInput";
import { getUser } from "@/services/requests/home";

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

  if (isLoading) {
    // TODO: add shimmer UI
    return <p>Loading...</p>;
  }

  if (error || !messagesHistory || !userData) {
    return null;
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
