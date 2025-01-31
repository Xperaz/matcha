import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import HistoryItem from "./HistoryItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getLikesHistory } from "@/services/requests/profile";
import { useInView } from "react-intersection-observer";
import { IHistoryItem } from "@/types/profile";
import Loader from "../Loader";

const LikesHistoryTab = () => {
  const {
    data: likesHistory,
    status,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.likesHistory],
    queryFn: ({ pageParam = 1 }) => getLikesHistory(pageParam),
    initialPageParam: 1,
    enabled: true,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.data.length > 0) {
        return allPages.length + 1;
      }
      return null;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
        <Loader />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex justify-center items-center">
        Error fetching data please try again later
      </div>
    );
  }

  if (!likesHistory.pages.length || !likesHistory.pages[0].data.data.length) {
    return (
      <div className="flex justify-center items-center">
        No likes history found 😢
      </div>
    );
  }

  return (
    <TabsContent value="views" className="h-full m-0">
      <div className="space-y-4 pr-4">
        {likesHistory.pages.map((page, i) => (
          <div key={i}>
            {page.data.data.map((item: IHistoryItem) => (
              <HistoryItem key={item.id} data={item} />
            ))}
          </div>
        ))}
      </div>

      {isFetchingNextPage && <div>Loading more...</div>}
      <div ref={ref}></div>
    </TabsContent>
  );
};

export default LikesHistoryTab;
