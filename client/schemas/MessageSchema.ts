import * as z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "message is too long"),
});

export type MessageFormValue = z.infer<typeof messageSchema>;
