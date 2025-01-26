import { useExploreContext } from "@/context/exploreContext";
import { useState } from "react";
import { AdvancedSearch } from "./AdvancedSearchModal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { explore } from "@/services/requests/explore";
import { QUERY_KEYS } from "@/constants/query_keys";
import { Loader2, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tilt } from "react-tilt";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  distance: string;
  fame_rating: number;
  profile_picture: string;
  latitude: string;
  longitude: string;
}

const tiltOptions = {
  reverse: false, // reverse the tilt direction
  max: 35, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
  scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
  speed: 1000, // Speed of the enter/exit transition
  transition: true, // Set a transition on enter/exit.
  axis: null, // What axis should be disabled. Can be X or Y.
  reset: true, // If the tilt effect has to be reset on exit.
  easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
};

const ExploreSearch = () => {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const { filters } = useExploreContext();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.explore],
    queryFn: async () => {
      const res = await explore(filters);
      return res.data.data;
    },
  });

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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">
          Error loading results. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.map((user: User) => (
            <Tilt key={user.id} opeions={tiltOptions}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={user.profile_picture}
                      alt={`${user.first_name}'s profile`}
                      className="object-cover w-full h-full"
                      width={300}
                      height={300}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <CardTitle className="text-white">
                        {user.first_name}, {user.age}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.distance} miles away
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {user.fame_rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Tilt>
          ))}
        </div>
      )}

      {data?.length === 0 && (
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
