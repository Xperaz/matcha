import React, { FC } from "react";
import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import { CompleteFormData } from "@/schemas/CompleteFormSchema";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InterestsProps {
  control: Control<CompleteFormData>;
  errors: FieldErrors<CompleteFormData>;
}

const INTERESTS = [
  "TRAVEL",
  "MUSIC",
  "GYM",
  "SHOPPING",
  "PROGRAMMING",
  "FILMS",
  "NIGHTLIFE",
  "FOOTBALL",
  "FOOD",
  "DOGS",
  "CATS",
  "BOOKS",
  "GAMING",
] as const;

const Interests: FC<InterestsProps> = ({ control, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "interests",
  });

  const handleSelectTag = (tag: string) => {
    const exists = fields.some((field) => field.value === tag);
    if (!exists && fields.length < 10) {
      append({ value: tag });
    }
  };

  const handleRemoveTag = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-bold leading-tight">List your interests</h1>
        <p className="text-sm text-gray-600">
          This will help us tailor your experience on the platform
        </p>
        {errors.interests && (
          <p className="text-sm text-red-500 mt-1">
            {errors.interests.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <Badge
            key={field.id}
            variant="default"
            className="px-3 py-1 flex items-center gap-2"
          >
            {field.value}
            <X
              className="h-4 w-4 cursor-pointer hover:text-red-500"
              onClick={() => handleRemoveTag(index)}
            />
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {INTERESTS.map((interest) => {
          const isSelected = fields.some((field) => field.value === interest);
          return (
            <Badge
              key={interest}
              variant={isSelected ? "outline" : "outline"}
              className={`px-3 py-1 cursor-pointer ${
                isSelected ? "opacity-50" : "hover:bg-primary/80"
              }`}
              onClick={() => !isSelected && handleSelectTag(interest)}
            >
              {interest}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default Interests;
