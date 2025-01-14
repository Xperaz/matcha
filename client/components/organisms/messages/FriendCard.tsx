import { IReceivedMessage } from "@/types/messages";
import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getMessagePassedHours } from "@/helpers/getMessagePassedHours";

interface FriendCardProps {
  friend: IReceivedMessage;
}

const FriendCard: FC<FriendCardProps> = ({ friend }) => {
  const isSelected = false;
  const timeAgo = getMessagePassedHours(friend?.timestamp);
  const initials =
    `${friend.first_name[0]}${friend.last_name[0]}`.toUpperCase();
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 cursor-pointer transition-colors rounded-lg",
        "hover:bg-secondary",
        isSelected && "bg-secondary",
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={friend.profile_picture || undefined}
          alt={`${friend.first_name} ${friend.last_name}`}
        />
        <AvatarFallback className="border">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1 items-center">
          <h3 className="font-medium truncate">
            {friend.first_name} {friend.last_name}
          </h3>
          <span className="text-xs text-[#964F66]  whitespace-nowrap ml-2 text-center">
            {timeAgo}h
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#964F66]  truncate max-w-[120px]">
            {friend.content}
          </p>
          {friend.unread_count > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {friend.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
