"use client";
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
import { useCompleteFormContext } from "@/context/completeFormContext";
import { convertToBase64 } from "@/helpers/convertToBase64";
import useWindowResize from "@/hooks/useWindowResize";
import { CompleteFormData } from "@/schemas/CompleteFormSchema";
import { FileUser } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface PersonalInfoFormProps {
  control: Control<CompleteFormData>;
  errors: FieldErrors<CompleteFormData>;
}

const PersonalInfoForm = ({ control, errors }: PersonalInfoFormProps) => {
  const { width } = useWindowResize();
  const {
    updateFormValues,
    formValues: { profile_picture },
  } = useCompleteFormContext();

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line no-unused-vars
    onChange: (value: any) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertToBase64(file);
        updateFormValues({
          profile_picture: base64String,
        });
        onChange(base64String);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error converting file to base64: ", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4">
      <div>
        <Controller
          name="profile_picture"
          control={control}
          // eslint-disable-next-line no-unused-vars
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-4">
              {profile_picture && typeof profile_picture === "string" && (
                <Image
                  src={profile_picture}
                  alt="Preview"
                  className={` ${width > 769 ? "w-32" : "w-24"} ${width > 769 ? "h-32" : "h-24"} rounded-full object-cover`}
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

      <div>
        <Controller
          control={control}
          name="biography"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <Label htmlFor="preferences">Bio</Label>
                <span className="text-center text-red-500">*</span>
              </div>
              <Textarea {...field} placeholder="Tell us about yourself" />
            </div>
          )}
        />
        {errors.biography && (
          <p className="text-red-500 text-sm p-2">{errors.biography.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-1 items-center">
          <Label htmlFor="preferences">Preferences</Label>
          <span className="text-center text-red-500">*</span>
        </div>
        <Controller
          name="preferences"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {errors.preferences && (
          <p className="text-red-500 text-sm">{errors.preferences.message}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
