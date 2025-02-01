"use client";

import withAppLayout from "../templates/layout/withAppLayout";
import ConversationLayout from "../templates/layout/ConversationLayout";
import useSocketSetup from "@/hooks/useSocketSetup";
import { useEffect, useState } from "react";
import FriendList from "../organisms/messages/FriendList";
import Conversations from "../organisms/messages/Conversation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { IMessageType } from "@/types/messages";

const Conversation = () => {
  const socket = useSocketSetup();
  const queryClient = useQueryClient();
  const [hasFriend, setHasFriend] = useState(false);

  useEffect(() => {
    const onNewMessage = (message: IMessageType) => {
      queryClient.setQueryData<IMessageType[] | null>(
        [QUERY_KEYS.messagesHistory, message.receiver_id],
        (oldMessages) => {
          if (!oldMessages) return [message];
          return [...oldMessages, message];
        },
      );

      queryClient.setQueryData<IMessageType[] | null>(
        [QUERY_KEYS.messagesHistory, message.sender_id],
        (oldMessages) => {
          if (!oldMessages) return [message];
          return [...oldMessages, message];
        },
      );

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.chatList] });
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [socket, queryClient]);

  return (
    <ConversationLayout>
      <div className="grid grid-cols-[2fr,20fr] gap-4 h-full overflow-hidden">
        <FriendList setHasFriend={setHasFriend} hasFriend={hasFriend} />
        {hasFriend && <Conversations />}
      </div>
    </ConversationLayout>
  );
};

export default withAppLayout(Conversation);
