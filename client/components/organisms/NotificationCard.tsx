import { Notification } from "@/types/notification";
import Link from "next/link";

const NotificationCard = ({ notifData }: { notifData: Notification }) => {
  return (
    <div className="bg-pink-100 border border-gray-200 shadow-sm rounded-lg p-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <span className="text-sm text-gray-500">{notifData.createdAt}</span>
        </div>
        <p className="text-gray-700 font-medium">
          <Link
            href={`/profile/${notifData.sender_id}`}
            className="font-bold text-black hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            {notifData.sender_name}{" "}
          </Link>
          <span>{notifData.message}</span>
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
