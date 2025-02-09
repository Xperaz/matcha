import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditProfileSchemaType } from "@/schemas/EditProfileSchema";

import { IUserType } from "@/types/user";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import EditProfilePicture from "./EditProfilePicture";
import EditPersonalInfo from "./EditPersonalInfo";
import EditIntrests from "./EditIntrests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/requests/profile";
import { QUERY_KEYS } from "@/constants/query_keys";
import { toast } from "@/hooks/use-toast";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

interface EditProfileProps {
  user: IUserType;
  onClose: () => void;
}

const EditProfile: FC<EditProfileProps> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const { mutate: updateProfileMutation, isPending } = useMutation<
    unknown,
    unknown,
    Partial<EditProfileSchemaType>
  >({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profileData] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      onClose();
    },
  });
  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<EditProfileSchemaType>({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture: user.profile_picture,
      biography: user.biography ?? "",
      gender: user.gender,
      interests: user.interests ?? [],
      sexual_preferences: user.sexual_preferences ?? undefined,
      latitude: user.latitude ?? 0,
      longitude: user.longitude ?? 0,
    },
  });

  const onSubmit = (data: EditProfileSchemaType) => {
    const updatedFields: Partial<EditProfileSchemaType> = {};

    if (data.first_name !== user.first_name) {
      updatedFields.first_name = data.first_name;
    }
    if (data.last_name !== user.last_name) {
      updatedFields.last_name = data.last_name;
    }
    if (data.profile_picture !== user.profile_picture) {
      updatedFields.profile_picture = data.profile_picture;
    }
    if (data.biography !== user.biography) {
      updatedFields.biography = data.biography;
    }
    if (data.gender !== user.gender) {
      updatedFields.gender = data.gender;
    }
    if (data.sexual_preferences !== user.sexual_preferences) {
      updatedFields.sexual_preferences = data.sexual_preferences;
    }
    if (data.interests !== user.interests) {
      updatedFields.interests = data.interests;
    }

    updateProfileMutation(updatedFields);
  };

  return (
    <div className="max-h-[80vh] overflow-scroll relative">
      <AlertDialog open>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Update your info
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm">
              Update your profile picture, personal info, and interests
            </AlertDialogDescription>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-between gap-4"
            >
              <EditProfilePicture
                control={control}
                errors={errors}
                defaultImage={user.profile_picture}
              />

              <EditPersonalInfo control={control} errors={errors} />

              <EditIntrests control={control} errors={errors} />
            </form>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditProfile;
