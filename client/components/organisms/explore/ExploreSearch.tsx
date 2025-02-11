"use client";
import { useExploreContext } from "@/context/exploreContext";
import { useEffect, useState } from "react";
import { AdvancedSearch } from "./AdvancedSearchModal";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { explore } from "@/services/requests/explore";
import { QUERY_KEYS } from "@/constants/query_keys";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IUserType } from "@/types/user";
import UserCard from "./UserCard";
import { useInView } from "react-intersection-observer";

const ExploreSearch = () => {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const { filters } = useExploreContext();

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [QUERY_KEYS.explore],
      queryFn: ({ pageParam = 1 }) => explore(filters, pageParam),
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
        <h1 className="text-2xl font-bold">Explore</h1>
        <Button
          onClick={() => setIsAdvancedSearchOpen((prev) => !prev)}
          className="bg-primary text-white"
        >
          {isAdvancedSearchOpen ? "Close Filters" : "Advanced Search"}
        </Button>
      </div>

      {isAdvancedSearchOpen && (
        <div className="mb-6">
          <AdvancedSearch onClose={() => setIsAdvancedSearchOpen(false)} />
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-6">
        {filters.ageRange[0] !== 18 || filters.ageRange[1] !== 100 ? (
          <Badge variant="secondary">
            Age: {filters.ageRange[0]}-{filters.ageRange[1]}
          </Badge>
        ) : null}
        {filters.interests.map((interest) => (
          <Badge key={interest} variant="secondary">
            {interest}
          </Badge>
        ))}
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

          {/* Intersection observer target */}
          <div ref={ref} className="h-10" />
        </>
      )}

      {users.length === 0 && status === "success" && (
        <div className="text-center py-12">
          <div className="text-xl font-semibold mb-2">No matches found</div>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
};

export default ExploreSearch;
