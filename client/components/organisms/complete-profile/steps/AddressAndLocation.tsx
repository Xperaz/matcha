import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompleteFormContext } from "@/context/completeFormContext";
import { CompleteFormData } from "@/schemas/CompleteFormSchema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import Select from "react-select";
import { countryOptions, customCountryStyles } from "./countryDropdownStyle";
import { convertToBase64 } from "@/helpers/convertToBase64";
import Image from "next/image";
import useGeoLocation from "@/hooks/useGeoLocation";

interface AddressAndLocationProps {
  control: Control<CompleteFormData>;
  errors: FieldErrors<CompleteFormData>;
}

const AddressAndLocation = ({ control, errors }: AddressAndLocationProps) => {
  const { lat, long } = useGeoLocation();
  const { updateFormValues } = useCompleteFormContext();

  const handleFilesChange = async (
    files: FileList | null,
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string[]) => void,
    currentValue: string[] = [],
  ) => {
    if (!files) return;

    try {
      const remainings = 4 - currentValue.length;

      const selectedFiles = Array.from(files).slice(0, remainings);
      const filesToBase64 = await Promise.all(
        selectedFiles.map(async (file) => {
          const imageBase64 = await convertToBase64(file);
          return imageBase64;
        }),
      );

      const updatedImages = [...currentValue, ...filesToBase64];
      onChange(updatedImages);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("error while converting images to base64");
    }
  };

  useEffect(() => {
    if (lat && long) {
      updateFormValues({
        longitude: long,
        latitude: lat,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, long]);

  return (
    <form className="flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <Label>City</Label>
          <span className="text-center text-red-500">*</span>
        </div>
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
        <div className="flex gap-1 items-center">
          <Label>Country</Label>
          <span className="text-center text-red-500">*</span>
        </div>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select
              className="max-w-96 h-11"
              {...field}
              options={countryOptions}
              placeholder="Select your country"
              styles={customCountryStyles}
              value={countryOptions.find(
                (option) => option.value === field.value,
              )}
              onChange={(option) => field.onChange(option?.value)}
            />
          )}
        />
        {errors.country && (
          <p className="text-sm text-red-500">{errors.country.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <Label>Add photos to your profile</Label>
          <span className="text-center text-red-500">*</span>
        </div>
        <p className="text-sm">Upload up to 4 photos.</p>
        <Controller
          name="pictures"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                className="max-w-96 h-11"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  handleFilesChange(e.target.files, onChange, value || [])
                }
              />
              {value && Array.isArray(value) && (
                <div className="flex gap-2 flex-wrap">
                  {value.map((src, index) => (
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
              )}
            </>
          )}
        />
        {errors.pictures && (
          <p className="text-sm text-red-500">{errors.pictures.message}</p>
        )}
      </div>
    </form>
  );
};

export default AddressAndLocation;
