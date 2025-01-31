import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import HistoryItem from "./HistoryItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getVisitsHistory } from "@/services/requests/profile";
import { useInView } from "react-intersection-observer";
import { IHistoryItem, PaginatedResponse } from "@/types/profile";
import Loader from "../Loader";

const ViewsHistoryTab = () => {
  const {
    data: viewsHistory,
    status,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.visitsHistory],
    queryFn: getVisitsHistory,
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse) => {
      const { current_page, last_page } = lastPage.data;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled: true,
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

  if (!viewsHistory.pages.length || !viewsHistory.pages[0].data.data.length) {
    return (
      <div className="flex justify-center items-center">
        No views history found 😢
      </div>
    );
  }

  return (
    <TabsContent value="views" className="h-full m-0">
      <div className="space-y-4 pr-4">
        {viewsHistory.pages.map((page, i) => (
          <div key={i} className="flex flex-col gap-2">
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

export default ViewsHistoryTab;
