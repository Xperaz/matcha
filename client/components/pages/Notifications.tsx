/* eslint-disable no-unused-vars */
"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import { Notification } from "@/types/notification";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getNotifications } from "@/services/requests/notifications";
import NotificationCard from "../organisms/NotificationCard";
import useSocketSetup from "@/hooks/useSocketSetup";

const LIMIT = 10;

interface NotificationResponse {
  data: {
    data: Notification[];
  };
}

const Notifications = () => {
  const queryClient = useQueryClient();
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const socket = useSocketSetup();

  const {
    data: notificationPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.notifications],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response: NotificationResponse = await getNotifications(
        pageParam,
        LIMIT,
      );
      return response.data.data;
    },
    getNextPageParam: (
      lastPage: Notification[],
      allPages: Notification[][],
    ) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length + 1;
    },
  });

  const notifications = notificationPages?.pages.flat() ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isLoading, fetchNextPage]);

  useEffect(() => {
    const onNewNotification = (notificationData: Notification) => {
      queryClient.setQueryData<InfiniteData<Notification[]>>(
        [QUERY_KEYS.notifications],
        (oldData) => {
          if (!oldData) {
            return {
              pages: [[notificationData]],
              pageParams: [1],
            };
          }

          return {
            ...oldData,
            pages: [
              [notificationData, ...oldData.pages[0]],
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    };

    socket.on("new_notification", onNewNotification);

    return () => {
      socket.off("new_notification", onNewNotification);
    };
  }, [socket, queryClient]);

  if (!notifications.length && !isLoading) {
    return <div>No notifications</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 items-start w-full">
        {notifications?.map((notification) => (
          <NotificationCard notifData={notification} key={notification.id} />
        ))}
      </div>

      <div ref={loaderRef} className="mt-4 p-4">
        {isLoading && <div className="flex justify-center">Loading ...</div>}
      </div>

      {!hasMore && notifications?.length !== 0 && (
        <p className="text-center mt-4 text-gray-600">
          No more notifications to show.
          {notifications?.length}
        </p>
      )}
      {!isLoading && notifications?.length === 0 && (
        <p className="text-center mt-4 text-gray-600">No Notification</p>
      )}
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Notifications));
