const NewNotification = ({
  notifCount,
  onRefresh,
}: {
  notifCount: number;
  onRefresh: () => void;
}) => {
  return (
    <div
      onClick={onRefresh}
      className="sticky top-0 w-full flex justify-center mb-4"
    >
      <div
        className="bg-white hover:bg-pink-50 px-6 py-2.5 
          rounded-full cursor-pointer transition-all duration-200 
          shadow-sm border border-pink-100 flex items-center gap-2
          group"
      >
        <span className="text-pink-500 font-medium">
          {notifCount} new notification{notifCount > 1 ? "s" : ""}
        </span>
        <span className="text-pink-200">•</span>
        <span className="text-gray-500 group-hover:text-pink-400 transition-colors">
          Click to see
        </span>
      </div>
    </div>
  );
};

export default NewNotification;
