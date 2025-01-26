import { useExploreContext } from "@/context/exploreContext";
import React, { useState } from "react";
import { AdvancedSearch } from "./AdvancedSearchModal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { explore } from "@/services/requests/explore";
import { QUERY_KEYS } from "@/constants/query_keys";

const ExploreSearch = () => {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const { filters } = useExploreContext();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.explore, filters],
    queryFn: async () => {
      const res = await explore(filters);

      return res.data;
    },
  });

  console.log(data, isLoading, error);
  console.log(filters);

  return (
    <>
      <div>
        <Button
          onClick={() => setIsAdvancedSearchOpen((prev) => !prev)}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          {isAdvancedSearchOpen ? "Close" : "Advanced Search"}
        </Button>
        {isAdvancedSearchOpen && (
          <AdvancedSearch onClose={() => setIsAdvancedSearchOpen(false)} />
        )}
      </div>
    </>
  );
};

export default ExploreSearch;
