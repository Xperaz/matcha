import React, { FC } from "react";
import FriendCard from "./FriendCard";
import { IReceivedMessage } from "@/types/messages";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getChatList } from "@/services/requests/messages";
import { useParams } from "next/navigation";
import ShimmerCard from "../common/ShimmerCard";
import CustomError from "../common/CustomError";

export interface FriendListProps {
  setHasFriend: React.Dispatch<React.SetStateAction<boolean>>;
  hasFriend: boolean;
}

const FriendList: FC<FriendListProps> = ({ setHasFriend, hasFriend }) => {
  const params = useParams();
  const selectedId = params.conversationId as string | undefined;
  const {
    data: friends,
    isLoading,
    error,
  } = useQuery<IReceivedMessage[]>({
    queryKey: [QUERY_KEYS.chatList],
    queryFn: async () => {
      const data = await getChatList();
      if (data.data.length > 0) {
        setHasFriend(true);
      }
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="border border-r-2 w-full py-2">
        {[...Array(5)].map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-r-2 w-full py-2">
        <CustomError error="Something went wrong while trying to fetch your chat list, please try again" />
      </div>
    );
  }

  if (!hasFriend) {
    return (
      <div className="absolute h-full w-full py-2">
        <CustomError title="No chat started yet" error="" />
      </div>
    );
  }

  return (
    <div className="border border-r-2 w-full py-2">
      {friends?.map((friend) => (
        <div key={friend.other_user_id} className="flex flex-col w-full gap-4">
          <FriendCard friend={friend} selectedId={selectedId} />
        </div>
      ))}
    </div>
  );
};

export default FriendList;
