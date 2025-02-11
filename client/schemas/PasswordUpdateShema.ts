import * as z from "zod";

export const PasswordUpdateSchema = z.object({
  oldPassword: z.string().min(8, {
    message: "Invalid Password",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export type PasswordUpdateSchemaType = z.infer<typeof PasswordUpdateSchema>;
