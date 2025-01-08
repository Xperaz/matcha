"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import UserInfoCard from "../organisms/UserInfoCard";
import { IUserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getMatches } from "@/services/requests/mathches";

const Matches = () => {
  const [users, setUsers] = useState<IUserType[]>([]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [QUERY_KEYS.matches],
    queryFn: async () => {
      const resData = await getMatches(page, 10);
      return resData.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setUsers(...users);
    }
  }, [data, isSuccess]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Matches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserInfoCard
            key={user.id}
            name={user.first_name + " " + user.last_name}
            bio={user.biography}
            profilePicture={user.profile_picture}
            age={user.age}
          />
        ))}
        <div>
          {isLoading && <p>Loading...</p>}
          {isSuccess && data && data.length === 0 && (
            <p className="text-center">No matches yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Matches));
