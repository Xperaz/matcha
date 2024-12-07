/* eslint-disable no-unused-vars */
// => I add this comment to disable the eslint warning for unused enum variables

import exp from "constants";
import * as z from "zod";

export enum genderEnum {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  gender: z.nativeEnum(genderEnum),
  isAdult: z.literal<boolean>(true, {
    errorMap: () => ({ message: "You must be 18 years or older" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export type SignupSchemaType = z.infer<typeof signupSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
