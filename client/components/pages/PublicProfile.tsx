"use client";
import React, { useEffect, useState } from "react";
import withAppLayout from "../templates/layout/withAppLayout";
import withProtectedRoute from "@/auth/withProtectedRoute";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { useParams } from "next/navigation";
import { getUserProfile } from "@/services/requests/profile";
import { useRouter } from "next/navigation";
import { IPublicProfileType } from "@/types/user";
import { ProfileGallery } from "../organisms/public-profile/ProfileGallery";
import { ProfileHeader } from "../organisms/public-profile/ProfileHeader";
import ProfileInfo from "../organisms/public-profile/ProfileInfo";
import ProfileActions from "../organisms/public-profile/ProfileActions";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { CustomError } from "@/auth/types";

export type MatchStatusType = "MATCHED" | "LIKED" | "NONE";

const getMatchStatus = (user: IPublicProfileType) => {
  if (user.is_match) return "MATCHED";
  if (user.is_like) return "LIKED";
  return "NONE";
};

export const PublicProfile = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string | undefined;

  const {
    isLoading,
    data: user,
    error,
  } = useQuery<IPublicProfileType>({
    queryKey: [QUERY_KEYS.publicProfile, userId],
    queryFn: async () => {
      if (!userId) return;
      const data = await getUserProfile(userId);
      return data.data.data;
    },
  });

  const [matchStatus, setMatchStatus] = useState<MatchStatusType>("NONE");

  useEffect(() => {
    if (user) {
      setMatchStatus(getMatchStatus(user));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    const customError = error as CustomError;
    if (customError.response?.status === 403) {
      toast({
        title: "Error",
        description: "You are not authorized to view this profile",
        variant: "destructive",
      });
      router.replace("/home");
    }
  }
  if (!user && !isLoading) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {user && (
        <ProfileGallery
          profilePicture={user?.profile_picture}
          pictures={user?.pictures}
          isActive={user?.is_active}
          lastConnection={user?.last_connection}
        />
      )}

      <div className="space-y-6">
        {user && (
          <ProfileHeader
            user={user}
            matchStatus={matchStatus}
            setMatchStatus={setMatchStatus}
          />
        )}

        {user && <ProfileInfo user={user} />}

        {user && <ProfileActions user={user} />}
      </div>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(PublicProfile));
