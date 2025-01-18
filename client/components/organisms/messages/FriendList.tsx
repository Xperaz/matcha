import React from "react";
import FriendCard from "./FriendCard";
import { IReceivedMessage } from "@/types/messages";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getChatList } from "@/services/requests/messages";
import { useParams } from "next/navigation";
import ShimmerCard from "../ShimmerCard";
import CustomError from "../CustomError";

const FriendList = () => {
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
