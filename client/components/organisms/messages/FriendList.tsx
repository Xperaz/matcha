import React from "react";
import FriendCard from "./FriendCard";
import { IReceivedMessage } from "@/types/messages";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getChatList } from "@/services/requests/messages";

const FriendList = () => {
  const {
    data: friends,
    isLoading,
    error,
  } = useQuery<IReceivedMessage[]>({
    queryKey: [QUERY_KEYS.chatList],
    queryFn: async () => {
      const data = await getChatList();
      return data.data;
    },
  });

  if (isLoading) {
    // TODO: add Loader
    return null;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error("error while fetching the chatList", error);
  }

  return (
    <div className="border border-r-2 w-full px-2">
      {friends?.map((friend) => (
        <div key={friend.other_user_id} className="flex flex-col w-full gap-4">
          <FriendCard friend={friend} />
        </div>
      ))}
    </div>
  );
};

export default FriendList;
