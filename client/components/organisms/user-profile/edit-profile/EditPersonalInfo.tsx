import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditProfileSchemaType } from "@/schemas/EditProfileSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFormProps {
  control: Control<EditProfileSchemaType>;
  errors: FieldErrors<EditProfileSchemaType>;
}

const EditPersonalInfo: FC<PersonalInfoFormProps> = ({ control, errors }) => {
  return (
    <>
      {/* Name Fields */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Controller
            name="first_name"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="first_name" className="text-start">
                  First Name
                </Label>
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
            defaultValue=""
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="last_name" className="text-start">
                  Last Name
                </Label>
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
              <Label htmlFor="biography" className="text-start">
                Bio
              </Label>
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

      {/* lon and lat Section */}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Controller
            defaultValue={0}
            name="longitude"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="longitude" className="text-start">
                  Longitude
                </Label>
                <Input {...field} placeholder="Longitude" />
                {errors.longitude && (
                  <p className="text-red-500 text-sm">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div className="flex-1">
          <Controller
            name="latitude"
            defaultValue={0}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="latitude" className="text-start">
                  Latitude
                </Label>
                <Input {...field} placeholder="Latitude" />
                {errors.latitude && (
                  <p className="text-red-500 text-sm">
                    {errors.latitude.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <p className="text-red-500 text-sm">{errors.gender.message}</p>
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
        {errors.sexual_preferences && (
          <p className="text-red-500 text-sm">
            {errors.sexual_preferences.message}
          </p>
        )}
      </div>
    </>
  );
};

export default EditPersonalInfo;
