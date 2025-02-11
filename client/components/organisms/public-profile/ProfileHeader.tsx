import { MatchStatusType } from "@/components/pages/PublicProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/constants/query_keys";
import { toast } from "@/hooks/use-toast";
import {
  likeUser,
  unlikeUser,
  unmatchUser,
} from "@/services/requests/publicProfile";
import { IPublicProfileType } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, MapPin, Star, UserMinus, X } from "lucide-react";
import React, { useState } from "react";
import { SendMessageModal } from "./SendMessageModal";

interface ProfileHeaderProps {
  user: IPublicProfileType;
  matchStatus: MatchStatusType;
  setMatchStatus: React.Dispatch<React.SetStateAction<MatchStatusType>>;
}

export const ProfileHeader = ({
  user,
  matchStatus,
  setMatchStatus,
}: ProfileHeaderProps) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const queryClient = useQueryClient();
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

  const { mutate: likeUserMutation } = useMutation({
    mutationFn: likeUser,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [
          QUERY_KEYS.usersToSwipe,
          QUERY_KEYS.explore,
          QUERY_KEYS.publicProfile,
          QUERY_KEYS.user,
        ],
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
        queryKey: [
          QUERY_KEYS.usersToSwipe,
          QUERY_KEYS.explore,
          QUERY_KEYS.publicProfile,
          QUERY_KEYS.user,
        ],
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
          QUERY_KEYS.publicProfile,
          QUERY_KEYS.user,
        ],
      });

      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.matches],
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

  return (
    <>
      {isMessageModalOpen && (
        <SendMessageModal
          recipientId={user.id}
          onClose={() => setIsMessageModalOpen(false)}
          recipientName={`${user.first_name} ${user.last_name}`}
          isOpen={isMessageModalOpen}
        />
      )}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {user.first_name}, {user.age}
          </h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {user.city}, {user.country}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Fame: {user.fame_rating}/100
            </div>
          </div>
          {user.has_liked_you && (
            <Badge variant="secondary" className="bg-pink-500/10 text-pink-500">
              <Heart className="w-3 h-3 mr-1 fill-current" />
              Likes you
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {renderMatchButton()}
          {user.is_match && matchStatus === "MATCHED" && (
            <Button
              variant="default"
              onClick={() => setIsMessageModalOpen(true)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
