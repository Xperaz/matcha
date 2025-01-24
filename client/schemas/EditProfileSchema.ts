import { z } from "zod";
import { genderEnum } from "./SignupSchema";
import { Preference } from "./CompleteFormSchema";

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

export const editProfileSchema = z.object({
  profile_picture: profilePictureSchema.optional(),
  biography: z.string().optional(),
  interests: z.array(z.string()).optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.nativeEnum(genderEnum).optional(),
  sexual_preferences: z
    .nativeEnum(Preference, {
      message: "You need to select one preferences",
    })
    .optional(),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
