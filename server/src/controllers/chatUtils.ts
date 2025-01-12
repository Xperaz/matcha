import { query } from "../config/db";
import { MessageInputType } from "../types/chat";

export const createMessage = async (messageData: MessageInputType) => {
  const messageQuery = `
    INSERT INTO  messages (sender_id, receiver_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

  const values = [
    messageData.sender_id,
    messageData.receiver_id,
    messageData.content,
  ];

  try {
    const { rows } = await query(messageQuery, values);
    return rows[0];
  } catch (err) {
    console.error("Error creating message: ", err);
    throw err;
  }
};
