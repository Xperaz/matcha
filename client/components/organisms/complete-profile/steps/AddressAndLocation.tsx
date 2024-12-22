"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompleteFormContext } from "@/context/completeFormContext";
import { CompleteFormData } from "@/schemas/CompleteFormSchema";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import Select from "react-select";
import { countryOptions, customCountryStyles } from "./countryDropdownStyle";
import { convertToBase64 } from "@/helpers/convertToBase64";
import Image from "next/image";

interface AddressAndLocationProps {
  control: Control<CompleteFormData>;
  errors: FieldErrors<CompleteFormData>;
}

const AddressAndLocation = ({ control, errors }: AddressAndLocationProps) => {
  const { updateFormValues } = useCompleteFormContext();
  const [picturesPreview, setPicturesPreview] = useState<string[]>([]);

  const handleFilesChange = async (files: FileList | null) => {
    if (!files) return;

    try {
      const selectedFiles = Array.from(files).slice(0, 6);
      const filesToBase64 = await Promise.all(
        selectedFiles.map(async (file) => {
          const imageBase64 = await convertToBase64(file);
          return imageBase64;
        }),
      );

      setPicturesPreview(filesToBase64);
      updateFormValues({
        pictures: filesToBase64,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("error while converting images to base64");
    }
  };

  return (
    <form className="flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-2 ">
        <Label>City</Label>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="e.g. Casablanca"
              className="max-w-96 h-11"
              {...field}
            />
          )}
        />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Country</Label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select
              className="max-w-96 h-11 "
              {...field}
              options={countryOptions}
              placeholder="Select your country"
              styles={customCountryStyles}
              value={countryOptions.find(
                (option) => option.value === field.value,
              )}
            />
          )}
        />
        {errors.city && (
          <p className="text-sm text-red-500">{errors.city.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Add photos to your profile</Label>
        <p className="text-sm">Upload up to 6 photos.</p>
        <Controller
          name="pictures"
          control={control}
          render={({ field }) => (
            <Input
              className="max-w-96 h-11 "
              type="file"
              multiple
              onChange={(e) => {
                field.onChange(e.target.files);
                handleFilesChange(e.target.files);
              }}
            />
          )}
        />

        <div className="flex gap-2 flex-wrap">
          {picturesPreview.map((src, index) => (
            <div key={index} className="w-48 h-48 relative">
              <Image
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded"
                fill
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default AddressAndLocation;
