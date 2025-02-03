"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import { IUserType } from "@/types/user";
import { useEffect } from "react";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getMatches } from "@/services/requests/mathches";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import UserCard from "../organisms/explore/UserCard";
import { Loader2 } from "lucide-react";

const LIMIT = 10;

const Matches = () => {
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [QUERY_KEYS.matches],
      queryFn: ({ pageParam = 1 }) => getMatches(pageParam, LIMIT),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.data.length > 0) {
          return allPages.length + 1;
        }
        return null;
      },
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage]);

  if (status === "error") {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading results. Please try again.
      </div>
    );
  }

  const users = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Matches</h1>
      </div>

      {status === "pending" && users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user: IUserType) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {!hasNextPage && users.length > 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No more users to show
            </div>
          )}

          <div ref={ref} className="h-10" />
        </>
      )}

      {users.length === 0 && status === "success" && (
        <div className="text-center py-12">
          <div className="text-xl font-semibold mb-2">No matches found</div>
        </div>
      )}
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Matches));
