import { formatMessageTime } from "@/helpers/dates";
import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface MessageProps {
  content: string;
  timestamp: string;
  senderId: string;
  currentUserId: string;
  senderName: string;
}

const MessageCard: FC<MessageProps> = ({
  content,
  timestamp,
  senderId,
  currentUserId,
  senderName,
}) => {
  const isCurrentUser = senderId === currentUserId;

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isCurrentUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl p-3",
          isCurrentUser
            ? "bg-primary text-primary-foreground ml-auto rounded-tr-none"
            : "bg-secondary mr-auto rounded-tl-none",
        )}
      >
        {!isCurrentUser && (
          <p className="text-xs text-muted-foreground mb-1">{senderName}</p>
        )}
        <p className="break-words">{content}</p>
        <p className="text-xs mt-1 opacity-70">
          {formatMessageTime(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
