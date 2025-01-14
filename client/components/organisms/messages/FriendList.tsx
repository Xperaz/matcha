import React from "react";
import FriendCard from "./FriendCard";
import { IReceivedMessage } from "@/types/messages";

const friends: IReceivedMessage[] = [
  {
    other_user_id: "87374b22-8d81-4c4d-b88e-5ef0deca72e4",
    content: "Hi !!",
    timestamp: "2025-01-14T11:27:06.131Z",
    sender_id: "07cfdf86-3b49-40b6-90c2-aee98b76b8bd",
    receiver_id: "87374b22-8d81-4c4d-b88e-5ef0deca72e4",
    is_read: false,
    first_name: "azedine",
    last_name: "ouhadou",
    profile_picture:
      "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg",
    unread_count: 5,
  },
  {
    other_user_id: "87374b22-8d81-4c4d-b88e-5ef0deca72e4",
    content: "hello !",
    timestamp: "2025-01-14T11:27:06.131Z",
    sender_id: "07cfdf86-3b49-40b6-90c2-aee98b76b8bd",
    receiver_id: "87374b22-8d81-4c4d-b88e-5ef0deca72e4",
    is_read: false,
    first_name: "Mock",
    last_name: "Test",
    profile_picture: null,
    unread_count: 0,
  },
  {
    other_user_id: "87374b22-8d81-4c4d-b88e-5ef0deca72e4",
    content: "Just test",
    timestamp: "2025-01-14T11:27:06.131Z",
    sender_id: "07cfdf86-3b49-40b6-90c2-aee98b76b8bd",
    receiver_id: "87374b22-8d81-4c4d-b88e-5ef0deca72e4",
    is_read: false,
    first_name: "azedine",
    last_name: "ouhadou",
    profile_picture:
      "https://images.pexels.com/photos/1704485/pexels-photo-1704485.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg",
    unread_count: 2,
  },
];

const FriendList = () => {
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
