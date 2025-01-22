import { Notification } from "@/types/notification";
import Link from "next/link";
import { format } from "date-fns";

const NotificationCard = ({ notifData }: { notifData: Notification }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return format(date, "MMM dd yyyy hh:mm a");
  };

  return (
    <div
      className={`group relative rounded-lg p-4 transition-all duration-200
    ${
      notifData.is_read
        ? "bg-gradient-to-r from-pink-200/90 to-pink-100/90 hover:from-pink-200/80 hover:to-pink-100/80"
        : "bg-gradient-to-r from-pink-100/90 to-rose-100/90 hover:from-pink-100 hover:to-rose-50"
    }
    hover:shadow-sm hover:-translate-y-[1px]`}
    >
      <div className="space-y-2">
        <div className="flex justify-end">
          <span
            className={`text-sm ${notifData.is_read ? "text-gray-500" : "text-gray-600"}`}
          >
            {formatDate(notifData.createdAt)}
          </span>
        </div>

        <p
          className={`leading-relaxed ${notifData.is_read ? "text-gray-600" : "text-gray-700"}`}
        >
          <Link
            href={`/profile/${notifData.sender_id}`}
            className={`font-medium hover:text-pink-500 transition-colors duration-200
              ${notifData.is_read ? "text-gray-700" : "text-gray-900"}`}
          >
            {notifData.sender_name}
          </Link>{" "}
          <span>{notifData.message}</span>
        </p>
      </div>

      {!notifData.is_read && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] 
          bg-gradient-to-b from-pink-400/70 to-rose-300/70 
          rounded-l-lg"
        />
      )}
    </div>
  );
};

export default NotificationCard;
