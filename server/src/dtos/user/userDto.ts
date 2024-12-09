export interface UserDTO {
    id: string; // UUID
    email: string;
    first_name: string;
    last_name: string;
    biography?: string;
    fame_rating: number;
    sexual_preferences?: "MALE" | "FEMALE" | "OTHER";
    age: number;
    gender: "MALE" | "FEMALE" | "NON_BINARY"; 
    profile_completed: boolean;
  }
  