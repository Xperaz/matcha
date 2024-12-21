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
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface PersonalInfoFormProps {
  control: Control<CompleteFormData>;
  errors: FieldErrors<CompleteFormData>;
}

const PersonalInfoForm = ({ control, errors }: PersonalInfoFormProps) => {
  const { width } = useWindowResize();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { updateFormValues } = useCompleteFormContext();

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line no-unused-vars
    onChange: (value: any) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertToBase64(file);
        setImagePreview(base64String);
        onChange(file);
        updateFormValues({
          profile_picture: base64String,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error converting file to base64: ", error);
      }
    }
  };

  return (
    <form className="flex flex-col justify-between gap-4">
      <div>
        <Controller
          name="profile_picture"
          control={control}
          // eslint-disable-next-line no-unused-vars
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-4">
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className={` ${width > 769 ? "w-32" : "w-24"} ${width > 769 ? "h-32" : "h-24"} rounded-full object-cover`}
                  width={width > 769 ? 32 : 24}
                  height={width > 769 ? 32 : 24}
                />
              )}
              <div className="flex flex-col">
                <Input
                  type="file"
                  id="profile_picture"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, onChange)}
                  className="cursor-pointer"
                />
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
          name="bio"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                {...field}
                placeholder="Tell us about yourself"
                className=""
              />
            </div>
          )}
        />
        {errors.bio && <p>{errors.bio.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preference">Preference</Label>
        <Controller
          name="preference"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="BOTH">Both</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.preference && (
          <p className="text-red-500 text-sm">{errors.preference.message}</p>
        )}
      </div>
    </form>
  );
};

export default PersonalInfoForm;
