/* eslint-disable no-unused-vars */
// => I add this comment to disable the eslint warning for unused enum variables

import exp from "constants";
import * as z from "zod";

export enum genderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export const signupSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, {
      message: "Name must not exceed 50 characters",
    }),
  last_name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters long",
    })
    .max(50, {
      message: "Name must not exceed 50 characters",
    }),
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .max(64, {
      message: "Email must not exceed 64 characters",
    }),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters long",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(16, { message: "Password must not exceed 16 characters" })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  gender: z.nativeEnum(genderEnum),
  age: z.coerce.number().min(18, {
    message: "You must be 18 years or older",
  }),
});

export const loginSchema = z.object({
  username: z.string({
    message: "Username is required",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export type SignupSchemaType = z.infer<typeof signupSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
