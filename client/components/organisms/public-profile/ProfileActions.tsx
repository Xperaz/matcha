import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/constants/query_keys";
import { toast } from "@/hooks/use-toast";
import { blockUser, reportUser } from "@/services/requests/publicProfile";
import { IPublicProfileType } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag, ShieldBan } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface ProfileActionsProps {
  user: IPublicProfileType;
}

const ProfileActions: FC<ProfileActionsProps> = ({ user }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

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

  const handleReport = () => {
    if (!user) return;
    reportUserMutation(user?.id);
  };

  const handleBlock = () => {
    if (!user) return;
    blockUserMutation(user?.id);
  };
  return (
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
  );
};

export default ProfileActions;
