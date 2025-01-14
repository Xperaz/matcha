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
