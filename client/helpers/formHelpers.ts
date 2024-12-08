import { genderEnum } from "@/schemas/SignupSchema";

export const formatGenderDisplay = (gender: genderEnum) => {
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
};
