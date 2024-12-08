const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  login: `${BASE_URL}auth/signin`,
  register: `${BASE_URL}auth/signup`,
};
