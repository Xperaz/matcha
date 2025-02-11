export interface UserDTO {
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
  profile_picture?: string;
  email_verified: boolean;
}
