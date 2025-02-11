import { UserImages } from "./userImages";
export interface UserProfileDTO {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    biography?: string;
    fame_rating: number;
    sexual_preferences?: "MALE" | "FEMALE" | "BOTH";
    age: number;
    gender: "MALE" | "FEMALE" | "OTHER"; 
    profile_completed: boolean;
    profile_picture: string;
    country: string;
    city: string;
    interests: string[];
    is_google: boolean;
  }
  
  export interface publicProfileDto{
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