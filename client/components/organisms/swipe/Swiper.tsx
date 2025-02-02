import TinderCard from "react-tinder-card";
import { useSwipeCardContext } from "@/context/swipeCardContext";
import { useEffect, useState } from "react";
import { NoMoreUsers } from "../../atoms/NoMoreUsers";
import { Loader } from "lucide-react";
import Image from "next/image";
import { QUERY_KEYS } from "@/constants/query_keys";
import { useQuery } from "@tanstack/react-query";
import { getProfilesToSwipeReq } from "@/services/requests/home";
import { UserSwipeCard } from "@/types/userSwipeCard";

export function Swiper() {
  const { swipeRight, swipeLeft, filters } = useSwipeCardContext();
  const [usersCount, setUsersCount] = useState(0);
  const [userProfiles, setUserProfiles] = useState<UserSwipeCard[]>([]);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: [QUERY_KEYS.usersToSwipe, filters],
    queryFn: async () => {
      const retData = await getProfilesToSwipeReq(filters);

      return retData.data.data;
    },
  });

  useEffect(() => {
    const refetchData = async () => {
      await refetch();
    };
    refetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (data) {
      setUserProfiles(data);
      setNoMoreProfiles(false);
    }
    if (data && data.length === 0) {
      setNoMoreProfiles(true);
    }
  }, [data, isSuccess]);

  const handleSwipe = async (dir: String, user: UserSwipeCard) => {
    if (dir === "right") {
      swipeRight(user.id);
    } else {
      swipeLeft(user.id);
    }
    setUsersCount(usersCount + 1);
    if (usersCount === userProfiles.length - 1) {
      await refetch();
      setUsersCount(0);
    }
  };

  if (isSuccess && noMoreProfiles) {
    return <NoMoreUsers />;
  }

  if (isLoading || !userProfiles) {
    return (
      <div className="flex items-center justify-center h-[65vh] w-[75vw]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative w-[70vw] h-[55vh] rounded-lg max-w-lg overflow-hidden outline-none disableSelection">
      {userProfiles?.map((user) => (
        <TinderCard
          className="absolute h-full w-full p-4"
          key={user.id}
          onSwipe={(dir) => handleSwipe(dir, user)}
          swipeRequirementType="position"
          preventSwipe={["up", "down"]}
        >
          <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0">
              <Image
                src={user.profile_picture}
                alt={user.first_name + " " + user.last_name}
                className="h-full w-full object-cover"
                layout="fill"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h2>
                <span className="text-xl">{user.age}</span>
              </div>
              <p className="mt-2 ml-2 text-white/90 line-clamp-2">
                Away {user.distance} km
              </p>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
}
