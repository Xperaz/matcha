/* eslint-disable no-console */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
      console.log("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profileData] });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating profile: ", error);
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
    },
  });

  const onSubmit = (data: EditProfileSchemaType) => {
    // Create an object to store only modified fields
    const updatedFields: Partial<EditProfileSchemaType> = {};

    // Compare each field with original user data and add only changed fields
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
    console.log("Updated fields: ", data.interests);

    if (data.interests) {
      const newInterests = data.interests.map((interest) => interest);
      updatedFields.interests = newInterests;
    }

    updateProfileMutation(updatedFields);
  };

  return (
    <AlertDialog open>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update your info</AlertDialogTitle>
          <AlertDialogDescription>
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
          </AlertDialogDescription>
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
  );
};

export default EditProfile;
