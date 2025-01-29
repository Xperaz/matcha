const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  login: `${BASE_URL}auth/signin`,
  register: `${BASE_URL}auth/signup`,
  user: `${BASE_URL}user/me`,
  myProfile: `${BASE_URL}profile/me`,
  userProfile: `${BASE_URL}profile/`,
  completeProfile: `${BASE_URL}user/complete-profile`,
  chatList: `${BASE_URL}chat/list`,
  messagesHisotry: `${BASE_URL}chat/messages`,
  sendMessage: `${BASE_URL}chat/send`,
  markMessagesAsRead: `${BASE_URL}chat/read`,
  swipeRight: `${BASE_URL}match/swipe-right`,
  swipeLeft: `${BASE_URL}match/swipe-left`,
  profilesToSwipe: `${BASE_URL}match/users-profile`,
  matches: `${BASE_URL}match`,
  images: `${BASE_URL}image/images`,
  uploadImage: `${BASE_URL}image/upload`,
  deleteImage: `${BASE_URL}image/remove`,
  uploadProfileImage: `${BASE_URL}image/profile-picture`,
  updateEmail: `${BASE_URL}user/update-email`,
  updatePassword: `${BASE_URL}user/update-password`,
  notifications: `${BASE_URL}notif`,
  updateProfile: `${BASE_URL}user/update-profile`,
  logout: `${BASE_URL}auth/signout`,
  explore: `${BASE_URL}search`,
  reportUser: `${BASE_URL}report`,
  blockUser: `${BASE_URL}block`,
  likeUser: `${BASE_URL}match/like`,
  unlikeUser: `${BASE_URL}match/unlike`,
  unmatchUser: `${BASE_URL}match/unmatch`,
};
