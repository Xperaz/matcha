import * as z from "zod";

export const emailUpdateSchema = z.object({
  newEmail: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export type EmailUpdateSchemaType = z.infer<typeof emailUpdateSchema>;
