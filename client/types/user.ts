import { Preference } from "@/schemas/CompleteFormSchema";
import { genderEnum } from "@/schemas/SignupSchema";

export interface IUserType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  biography: string | null;
  fame_rating: number | null;
  age: number;
  profile_completed: boolean;
  gender: genderEnum;
  sexual_preferences: Preference | null;
  profile_picture: string;
  country: string;
  city: string;
  interests: string[];
  is_google: boolean;
  distance?: string;
}
