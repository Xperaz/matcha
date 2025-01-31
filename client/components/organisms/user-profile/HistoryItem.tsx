import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPassedHours } from "@/helpers/dates";
import { IHistoryItem } from "@/types/profile";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface HistoryItemProps {
  data: IHistoryItem;
}

const HistoryItem: FC<HistoryItemProps> = ({ data }) => {
  const router = useRouter();

  const displayUserProfile = () => {
    router.push(`/${data.sender_id}`);
  };
  return (
    <div
      className="flex items-center space-x-4 p-3 rounded-lg border"
      onClick={displayUserProfile}
    >
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
          {getPassedHours(data.created_at) + " ago"}
        </p>
      </div>
    </div>
  );
};

export default HistoryItem;
