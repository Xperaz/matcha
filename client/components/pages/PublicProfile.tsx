"use client";
import React, { useEffect, useState } from "react";
import withAppLayout from "../templates/layout/withAppLayout";
import withProtectedRoute from "@/auth/withProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Flag,
  X,
  UserMinus,
  MapPin,
  Star,
  ShieldBan,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { useParams } from "next/navigation";
import { getUserProfile } from "@/services/requests/profile";
import {
  blockUser,
  likeUser,
  reportUser,
  unlikeUser,
  unmatchUser,
} from "@/services/requests/publicProfile";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { IPublicProfileType } from "@/types/user";
import { ProfileGallery } from "../organisms/public-profile/ProfileGallery";
import { ProfileHeader } from "../organisms/public-profile/ProfileHeader";

export type MatchStatusType = "MATCHED" | "LIKED" | "NONE";

const getMatchStatus = (user: IPublicProfileType) => {
  if (user.is_match) return "MATCHED";
  if (user.is_like) return "LIKED";
  return "NONE";
};

export const PublicProfile = () => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const userId = params.userId as string | undefined;

  const { isLoading, data: user } = useQuery<IPublicProfileType>({
    queryKey: [QUERY_KEYS.publicProfile, userId],
    queryFn: async () => {
      if (!userId) return;
      const data = await getUserProfile(userId);
      return data.data.data;
    },
  });

  const { mutate: reportUserMutation } = useMutation({
    mutationFn: reportUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.chatList,
          QUERY_KEYS.matches,
          QUERY_KEYS.usersToSwipe,
          QUERY_KEYS.explore,
        ],
      });
      router.replace("/home");
      toast({
        title: "Success",
        description: "User reported successfully",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to report user",
        variant: "destructive",
      });

      // eslint-disable-next-line no-console
      console.error("Failed to report user: ", err);
    },
  });

  const { mutate: blockUserMutation } = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.chatList,
          QUERY_KEYS.matches,
          QUERY_KEYS.usersToSwipe,
          QUERY_KEYS.explore,
        ],
      });
      router.replace("/home");
      toast({
        title: "Success",
        description: "User blocked successfully",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      });

      // eslint-disable-next-line no-console
      console.error("Failed to block user: ", err);
    },
  });

  const { mutate: likeUserMutation } = useMutation({
    mutationFn: likeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.usersToSwipe, QUERY_KEYS.explore],
      });
      toast({
        title: "Success",
        description: "You Liked user successfully",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to like user",
        variant: "destructive",
      });

      // eslint-disable-next-line no-console
      console.error("Failed to like user: ", err);
    },
  });

  const { mutate: unlikeUserMutation } = useMutation({
    mutationFn: unlikeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.usersToSwipe, QUERY_KEYS.explore],
      });
      toast({
        title: "Success",
        description: "You Unliked user successfully",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to unlike user",
        variant: "destructive",
      });

      // eslint-disable-next-line no-console
      console.error("Failed to unlike user: ", err);
    },
  });

  const { mutate: unmatchUserMutation } = useMutation({
    mutationFn: unmatchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.matches,
          QUERY_KEYS.usersToSwipe,
          QUERY_KEYS.explore,
        ],
      });
      toast({
        title: "Success",
        description: "You Unmatched user successfully",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to unmatch user",
        variant: "destructive",
      });

      // eslint-disable-next-line no-console
      console.error("Failed to unmatch user: ", err);
    },
  });

  const [matchStatus, setMatchStatus] = useState<MatchStatusType>("NONE");

  useEffect(() => {
    if (user) {
      setMatchStatus(getMatchStatus(user));
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user && !isLoading) return null;

  // Helper function to format last connection time

  const renderMatchButton = () => {
    switch (matchStatus) {
      case "MATCHED":
        return (
          <Button variant="destructive" onClick={() => handleUnmatch()}>
            <UserMinus className="mr-2 h-4 w-4" />
            Unmatch
          </Button>
        );

      case "LIKED":
        return (
          <Button variant="outline" onClick={() => handleDislike()}>
            <X className="mr-2 h-4 w-4" />
            Unlike
          </Button>
        );

      case "NONE":
        return (
          <Button variant="outline" onClick={() => handleLike()}>
            <Heart className="mr-2 h-4 w-4" />
            Like
          </Button>
        );

      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    console.log("Sending message...");
    // TODO: Implement send message functionality, and redirect to chat page
  };

  const handleLike = () => {
    setMatchStatus("LIKED");
    if (!user) return;
    likeUserMutation(user?.id);
  };

  const handleDislike = () => {
    setMatchStatus("NONE");
    if (!user) return;
    unlikeUserMutation(user?.id);
  };

  const handleUnmatch = () => {
    setMatchStatus("NONE");
    if (!user) return;
    unmatchUserMutation(user?.id);
  };

  const handleReport = () => {
    if (!user) return;
    reportUserMutation(user?.id);
  };

  const handleBlock = () => {
    if (!user) return;
    blockUserMutation(user?.id);
  };

  const handleMatchAction = () => {
    console.log("Match action...");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Image Gallery */}
      {user && (
        <ProfileGallery
          profilePicture={user?.profile_picture}
          pictures={user?.pictures}
          isActive={user?.is_active}
          lastConnection={user?.last_connection}
        />
      )}

      {/* Profile Info */}
      <div className="space-y-6">
        {user && (
          <ProfileHeader
            user={user}
            matchStatus={matchStatus}
            setMatchStatus={setMatchStatus}
          />
        )}
        {/* <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
              {user?.first_name}, {user?.age}
            </h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {user?.city}, {user?.country}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Fame: {user?.fame_rating}/100
              </div>
            </div>
            {user?.has_liked_you && (
              <Badge
                variant="secondary"
                className="bg-pink-500/10 text-pink-500"
              >
                <Heart className="w-3 h-3 mr-1 fill-current" />
                Likes you
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {renderMatchButton()}
            {user?.is_match && (
              <Button variant="default">
                <MessageCircle
                  className="mr-2 h-4 w-4"
                  onClick={() => handleSendMessage()}
                />
                Send Message
              </Button>
            )}
          </div>
        </div> */}

        <div>
          <h2 className="text-lg font-semibold mb-2">
            About {user?.first_name}
          </h2>
          <p className="text-gray-600">{user?.biography}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user?.interests.map((interest, idx) => (
              <Badge key={idx} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleReport()}
          >
            <Flag className="mr-1 h-4 w-4" />
            Report
          </Button>

          <Button
            onClick={() => handleBlock()}
            variant="ghost"
            className="text-red-600 hover:text-red-700"
          >
            <ShieldBan className="mr-1 h-4 w-4" />
            Block
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(PublicProfile));
