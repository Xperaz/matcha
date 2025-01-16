export interface IReceivedMessage {
  other_user_id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  receiver_id: string;
  is_read: boolean;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  unread_count: number;
}

export interface IMessageType {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  sender_first_name: string;
  sender_last_name: string;
  receiver_first_name: string;
  receiver_last_name: string;
}

export interface IMessagePayload {
  content: string;
  receiver_id: string;
}
