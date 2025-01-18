const ShimmerCard = () => {
  return (
    <div className="p-4 w-full">
      <div className="flex items-center space-x-4">
        {/* Avatar shimmer */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>

        <div className="flex-1">
          {/* Name shimmer */}
          <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer mb-2"></div>
          {/* Message preview shimmer */}
          <div className="h-3 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerCard;
