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

const editProfileSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name is too short" })
    .optional(),
  last_name: z
    .string()
    .min(2, { message: "Last name is too short" })
    .optional(),
  profile_picture: profilePictureSchema.optional(),
  biography: z.string().optional(),
  sexual_preferences: z.nativeEnum(Preference).optional(),
  gender: z.nativeEnum(genderEnum).optional(),
  interests: z
    .array(z.string())
    .min(5, { message: "Please select at least 5 interests" })
    .max(10, { message: "You can't select more than 10 interests" })
    .optional(),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
