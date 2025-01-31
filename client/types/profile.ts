export interface IHistoryItem {
  id: string;
  sender_name: string;
  created_at?: string;
}

export interface PaginatedResponse {
  data: {
    current_page: number;
    last_page: number;
    data: IHistoryItem[];
  };
}
