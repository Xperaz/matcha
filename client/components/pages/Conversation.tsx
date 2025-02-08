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
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CustomError from "../organisms/common/CustomError";

const Conversation = () => {
  const socket = useSocketSetup();
  const queryClient = useQueryClient();
  const [hasFriend, setHasFriend] = useState(false);
  const params = useParams();
  const conversationId = params.conversationId as string | undefined;
  const router = useRouter();

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
      <div className="h-full w-full">
        <div className="h-full flex flex-col md:flex-row">
          <div
            className={`
            ${conversationId ? "hidden md:block" : "block"} 
            md:w-70 lg:w-96 h-full border-r
          `}
          >
            <FriendList setHasFriend={setHasFriend} hasFriend={hasFriend} />
          </div>

          <div
            className={`
            flex-1 h-full
            ${!conversationId ? "hidden md:block" : "block"}
          `}
          >
            {conversationId ? (
              <div className="h-full flex flex-col">
                <div className="md:hidden p-4 border-b">
                  <button
                    onClick={() => router.push("/messages")}
                    className="flex items-center gap-2 text-sm"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to conversations
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  {hasFriend && <Conversations />}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center h-full w-full">
                <CustomError
                  title="Select a message"
                  error="Choose from your existing conversations, start a new one, or just keep swimming."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ConversationLayout>
  );
};

export default withAppLayout(Conversation);
