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

export interface IPublicProfileType {
  id: string;
  first_name: string;
  last_name: string;
  biography?: string;
  fame_rating: number;
  sexual_preferences?: "MALE" | "FEMALE" | "BOTH";
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  profile_picture: string;
  country: string;
  city: string;
  is_like: boolean;
  is_match: boolean;
  has_liked_you: boolean;
  is_active: boolean;
  last_connection: Date;
  interests: string[];
  pictures: string[];
}
