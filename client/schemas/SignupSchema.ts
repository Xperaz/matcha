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
    .min(2, { message: "Name must be at least 2 characters long" }),
  last_name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  gender: z.nativeEnum(genderEnum),
  age: z.coerce.number().min(18, {
    message: "You must be 18 years or older",
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
