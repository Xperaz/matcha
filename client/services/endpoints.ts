const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  login: `${BASE_URL}auth/signin`,
  register: `${BASE_URL}auth/signup`,
  user: `${BASE_URL}user/me`,
  myProfile: `${BASE_URL}profile/me`,
  userProfile: `${BASE_URL}profile/`,
  completeProfile: `${BASE_URL}user/complete-profile`,
  swipeRight: `${BASE_URL}match/swipe-right`,
  swipeLeft: `${BASE_URL}match/swipe-left`,
  profilesToSwipe: `${BASE_URL}match/users-profile`,
  matches: `${BASE_URL}match`,
  images: `${BASE_URL}image/images`,
  uploadImage: `${BASE_URL}image/upload`,
  deleteImage: `${BASE_URL}image/remove`,
  uploadProfileImage: `${BASE_URL}image/profile-picture`,
};
