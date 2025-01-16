import { useAuthData } from "@/auth/useAuthData";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getMessagesHisotry } from "@/services/requests/messages";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import MessageCard from "./MessageCard";
import { IMessageType } from "@/types/messages";
import MessageInput from "./MessageInput";

const Conversations = () => {
  const params = useParams();
  const { userData: userData } = useAuthData();
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 xl:p-8">
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
      <MessageInput receiverId={conversationId} />
    </div>
  );
};

export default Conversations;
