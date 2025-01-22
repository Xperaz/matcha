"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import { Notification } from "@/types/notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getNotifications } from "@/services/requests/notifications";
import NotificationCard from "../organisms/notifications/NotificationCard";
import useSocketSetup from "@/hooks/useSocketSetup";
import NewNotification from "../organisms/notifications/NewNotification";

const LIMIT = 10;

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [newNotifCount, setnewNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const socket = useSocketSetup();
  const [latestNotif, setLatestNotif] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.notifications, page],
    queryFn: async () => {
      const response = await getNotifications(LIMIT, latestNotif);
      return response.data.data;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (data) {
      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setNotifications((prev) => {
        const updatedNotifications = [...prev, ...data];
        if (updatedNotifications.length > 0) {
          const lastNotif =
            updatedNotifications[updatedNotifications.length - 1];
          const dateN: string = lastNotif.createdAt;
          setLatestNotif(dateN);
        }
        return updatedNotifications;
      });
    }
  }, [data]);

  useEffect(() => {
    const onNewNotification = () => {
      setnewNotifCount((prev) => prev + 1);
    };

    socket.on("new_notification", onNewNotification);

    return () => {
      socket.off("new_notification");
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.notifications] });
    };
  }, [socket, queryClient]);

  const handleRefresh = () => {
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.notifications] });
    setLatestNotif(null);
    setNotifications([]);
    setnewNotifCount(0);
    setHasMore(true);
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      {newNotifCount > 0 && (
        <NewNotification notifCount={newNotifCount} onRefresh={handleRefresh} />
      )}
      <div className="flex flex-col gap-4 items-start w-full">
        {notifications.map((notification) => (
          <NotificationCard notifData={notification} key={notification.id} />
        ))}
      </div>

      <div ref={loaderRef} className="mt-4 p-4">
        {isLoading && <div className="flex justify-center">Loading ...</div>}
      </div>

      {!hasMore && notifications.length > 0 && (
        <p className="text-center mt-4 text-gray-600">
          No more notifications to show.
          {notifications.length}
        </p>
      )}
      {!isLoading && notifications.length === 0 && (
        <p className="text-center mt-4 text-gray-600">No Notification</p>
      )}
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Notifications));
