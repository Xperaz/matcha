import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select from your UI components
import { INTERESTS } from "@/constants/interests";
import { EditProfileSchemaType } from "@/schemas/EditProfileSchema";
import { X } from "lucide-react"; // Don't forget to import X icon
import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface PersonalInfoFormProps {
  control: Control<EditProfileSchemaType>;
  errors: FieldErrors<EditProfileSchemaType>;
}

const EditInterests: FC<PersonalInfoFormProps> = ({ errors, control }) => {
  return (
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
                const exists = field.value?.includes(value);

                // Check if we've reached the maximum of 10 interests
                if (field.value && field.value.length >= 10) {
                  return;
                }

                // Add new interest if it doesn't exist
                if (!exists) {
                  field.onChange([...(field.value || []), value]);
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
                    disabled={field.value?.includes(interest)}
                  >
                    {interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              {field.value?.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  className="px-4 py-2 bg-gray-200 rounded-full text-sm flex items-center gap-2"
                >
                  {interest}
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
              Select between 5 and 10 interests ({field.value?.length || 0}{" "}
              selected)
            </p>
          </div>
        )}
      />
      {errors.interests && (
        <p className="text-red-500 text-sm">{errors.interests.message}</p>
      )}
    </div>
  );
};

export default EditInterests;
