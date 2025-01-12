export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: Date;
  is_read: boolean;
}

export interface MessageInputType {
  sender_id: string;
  receiver_id: string;
  content: string;
}

export type IUserStatus = "OFFLINE" | "ONLINE";
