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
import React, { ChangeEvent, FC } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import useWindowResize from "@/hooks/useWindowResize";
import { FileUser, X } from "lucide-react";
import { convertToBase64 } from "@/helpers/convertToBase64";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INTERESTS } from "@/constants/interests";

interface EditProfileProps {
  user: IUserType;
  onClose: () => void;
}

const EditProfile: FC<EditProfileProps> = ({ user, onClose }) => {
  const { width } = useWindowResize();
  const [profile_picture, setProfilePicture] = React.useState<
    string | File | undefined
  >(() => user.profile_picture);
  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
  } = useForm<EditProfileSchemaType>({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture: user.profile_picture,
      biography: user.biography ?? "",
      gender: user.gender,
      interests: user.interests.map((interest) => ({ value: interest })),
      sexual_preferences: user.sexual_preferences ?? undefined,
    },
  });

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line no-unused-vars
    onChange: (value: any) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertToBase64(file);
        setProfilePicture(base64String);
        onChange(base64String);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error converting file to base64: ", error);
      }
    }
  };

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

    const originalInterests = user.interests;
    const newInterests = data.interests?.map((i) => i.value);
    if (JSON.stringify(originalInterests) !== JSON.stringify(newInterests)) {
      updatedFields.interests = data.interests;
    }
    console.log("Fields to update:", updatedFields);

    onClose();
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
              {/* Profile Picture Section */}
              <div>
                <Controller
                  name="profile_picture"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center gap-4">
                      {profile_picture &&
                        typeof profile_picture === "string" && (
                          <Image
                            src={profile_picture}
                            alt="Preview"
                            className={`${width > 769 ? "w-32" : "w-24"} ${
                              width > 769 ? "h-32" : "h-24"
                            } rounded-full object-cover`}
                            width={width > 769 ? 32 : 24}
                            height={width > 769 ? 32 : 24}
                          />
                        )}
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-4 items-center">
                          {!profile_picture && (
                            <div className="bg-slate-400 rounded-full p-4">
                              <FileUser size={20} />
                            </div>
                          )}
                          <Input
                            type="file"
                            id="profile_picture"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, onChange)}
                            className="hidden"
                          />
                          <label
                            htmlFor="profile_picture"
                            className="cursor-pointer text-primary"
                          >
                            Upload a profile picture
                          </label>
                        </div>
                        {errors?.profile_picture && (
                          <p className="text-red-500 text-sm">
                            {errors.profile_picture.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Name Fields */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input {...field} placeholder="First Name" />
                        {errors.first_name && (
                          <p className="text-red-500 text-sm">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input {...field} placeholder="Last Name" />
                        {errors.last_name && (
                          <p className="text-red-500 text-sm">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Biography Section */}
              <div>
                <Controller
                  control={control}
                  name="biography"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="biography">Bio</Label>
                      <Textarea
                        {...field}
                        placeholder="Tell us about yourself"
                        className="resize-none"
                      />
                      {errors.biography && (
                        <p className="text-red-500 text-sm">
                          {errors.biography.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <div className="flex gap-1 items-center">
                  <Label htmlFor="gender">Gender</Label>
                </div>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Sexual Preferences */}
              <div className="space-y-2">
                <div className="flex gap-1 items-center">
                  <Label htmlFor="preferences">Preferences</Label>
                </div>
                <Controller
                  name="sexual_preferences"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferences" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="BOTH">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.sexual_preferences && (
                  <p className="text-red-500 text-sm">
                    {errors.sexual_preferences.message}
                  </p>
                )}
              </div>

              {/* Interests Section */}
              {/* Interests Section */}
              <div className="space-y-2">
                <div className="flex gap-1 items-center">
                  <Label htmlFor="interests">Interests</Label>
                </div>
                <Controller
                  name="interests"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Select
                        onValueChange={(value) => {
                          // Check if interest already exists
                          const exists = field.value?.some(
                            (interest) => interest.value === value,
                          );

                          // Check if we've reached the maximum of 10 interests
                          if (field?.value && field?.value?.length >= 10) {
                            return;
                          }

                          // Add new interest if it doesn't exist
                          if (!exists) {
                            field.onChange([...(field.value || []), { value }]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your interests" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {INTERESTS.map((interest) => (
                            <SelectItem
                              key={interest}
                              value={interest}
                              disabled={field.value?.some(
                                (i) => i.value === interest,
                              )}
                            >
                              {interest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((interest, index) => (
                          <span
                            key={`${interest.value}-${index}`}
                            className="px-4 py-2 bg-gray-200 rounded-full text-sm flex items-center gap-2"
                          >
                            {interest.value}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter((_, i) => i !== index),
                                );
                              }}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Show helper text for min/max selections */}
                      <p className="text-sm text-gray-500">
                        Select between 5 and 10 interests (
                        {field.value?.length || 0} selected)
                      </p>
                    </div>
                  )}
                />
                {errors.interests && (
                  <p className="text-red-500 text-sm">
                    {errors.interests.message}
                  </p>
                )}
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit(onSubmit)}>
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProfile;
