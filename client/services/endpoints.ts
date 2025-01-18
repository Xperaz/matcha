const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  login: `${BASE_URL}auth/signin`,
  register: `${BASE_URL}auth/signup`,
  user: `${BASE_URL}user/me`,
  completeProfile: `${BASE_URL}user/complete-profile`,
  chatList: `${BASE_URL}chat/list`,
  messagesHisotry: `${BASE_URL}chat/messages`,
  sendMessage: `${BASE_URL}chat/send`,
  markMessagesAsRead: `${BASE_URL}chat/read`,
};
