/* eslint-disable no-unused-vars */
import { z } from "zod";

enum Preference {
  MALE = "MALE",
  FEMALE = "FEMALE",
  BOTH = "BOTH",
}

const PreferenceSchema = z.nativeEnum(Preference, {
  message: "You need to select one preference",
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const profilePictureSchema = z.union([
  z

    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .gif and .webp formats are supported",
    ),
  z
    .string()
    .min(1, {
      message: "this field is required",
    })
    .regex(/^data:image\/(jpeg|png|gif|webp);base64,/, "Invalid image format"),
]);

export const completeFormSchema = z.object({
  profile_picture: profilePictureSchema,
  bio: z.string().optional(),
  preference: PreferenceSchema,

  city: z.string().min(3, { message: "City field is required" }),
  country: z.string().min(3, { message: "Country field is required" }),
  pictures: z.string().array().min(6, {
    message: "At least 6 pictures are required",
  }),

  interests: z
    .string()
    .array()
    .nonempty()
    .min(5, { message: "Please select at least 5 interests" })
    .max(10, { message: "You can't select more than 10 interests" }),
});

export type CompleteFormData = z.infer<typeof completeFormSchema>;

// Partial schemas for step validation
export const personalInfoSchema = completeFormSchema.pick({
  profile_picture: true,
  bio: true,
  preference: true,
});

export const addressInfoSchema = completeFormSchema.pick({
  city: true,
  country: true,
  pictures: true,
});

export const interestsSchema = completeFormSchema.pick({
  interests: true,
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type AddressInfoData = z.infer<typeof addressInfoSchema>;
export type InterestsData = z.infer<typeof interestsSchema>;
