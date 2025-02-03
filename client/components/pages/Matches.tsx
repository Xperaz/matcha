"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import UserInfoCard from "../organisms/common/UserInfoCard";
import { IUserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getMatches } from "@/services/requests/mathches";

const LIMIT = 10;

const Matches = () => {
  const [page, setPage] = useState(1);
  const [allUsers, setAllUsers] = useState<IUserType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.matches, page],
    queryFn: async () => {
      const response = await getMatches(page, LIMIT);
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
      setAllUsers((prev) => [...prev, ...data]);
    }
  }, [data]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Matches</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allUsers.map((user) => (
          <UserInfoCard key={user.id} user={user} />
        ))}
      </div>

      <div ref={loaderRef} className="mt-4 p-4">
        {isLoading && <div className="flex justify-center">Loading ...</div>}
      </div>

      {!hasMore && allUsers.length > 0 && (
        <p className="text-center mt-4 text-gray-600">
          No more matches to show.
        </p>
      )}
      {!isLoading && allUsers.length === 0 && (
        <p className="text-center mt-4 text-gray-600">No matches found</p>
      )}
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Matches));
