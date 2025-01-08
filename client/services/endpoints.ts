import { match } from "assert";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  login: `${BASE_URL}auth/signin`,
  register: `${BASE_URL}auth/signup`,
  user: `${BASE_URL}user/me`,
  completeProfile: `${BASE_URL}user/complete-profile`,
  swipeRight: `${BASE_URL}match/swipe-right`,
  swipeLeft: `${BASE_URL}match/swipe-left`,
  profilesToSwipe: `${BASE_URL}match/users-profile`,
  matches: `${BASE_URL}match`,
};
