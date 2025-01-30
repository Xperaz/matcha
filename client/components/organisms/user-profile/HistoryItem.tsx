import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface HistoryItemProps {
  data: {
    id: string;
    sender_name: string;
    created_at: string;
  };
}

const HistoryItem = ({ data }: HistoryItemProps) => {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg border">
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>
          {data.sender_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium">{data.sender_name}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(data.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default HistoryItem;
