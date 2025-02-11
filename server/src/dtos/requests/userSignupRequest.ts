export interface userSignupRequest {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  gender: string;
  age: number;
}

enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export function isValidGender(gender: string): boolean {
  return Object.values(Gender).includes(gender as unknown as Gender);
}
