"use client";

import withAppLayout from "../templates/layout/withAppLayout";
import ConversationLayout from "../templates/layout/ConversationLayout";
import useSocketSetup from "@/hooks/useSocketSetup";
import { useEffect } from "react";
import FriendList from "../organisms/messages/FriendList";
import Conversations from "../organisms/messages/Conversation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";

interface Message {
  id: number;
  content: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
}

const Conversation = () => {
  const socket = useSocketSetup();
  const queryClient = useQueryClient();

  useEffect(() => {
    const onNewMessage = (message: Message) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.messagesHistory] });
      // eslint-disable-next-line no-console
      console.log("New message received:", message);
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [socket, queryClient]);

  return (
    <ConversationLayout>
      <div className="grid grid-cols-[2fr,20fr] gap-4 h-full overflow-hidden">
        <FriendList />
        <Conversations />
      </div>
    </ConversationLayout>
  );
};

export default withAppLayout(Conversation);
