export interface CustomError extends Error {
  response?: {
    status?: number;
    data: {
      message?: string;
    };
  };
}
