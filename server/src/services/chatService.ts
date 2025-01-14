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

export const getMessagesBetweenUsers = async (
  userId1: string,
  userId2: string
) => {
  const getMessagesQueryuery = `
  SELECT 
    m.*,
    u1.first_name as sender_first_name,
    u1.last_name as sender_last_name,
    u2.first_name as receiver_first_name,
    u2.last_name as receiver_last_name
  FROM messages m
  JOIN users u1 ON m.sender_id = u1.id
  JOIN users u2 ON m.receiver_id = u2.id
  WHERE (sender_id = $1 AND receiver_id = $2)
  OR (sender_id = $2 AND receiver_id = $1)
  ORDER BY timestamp ASC
`;

  try {
    const { rows } = await query(getMessagesQueryuery, [userId1, userId2]);

    return rows;
  } catch (error) {
    console.error("Error getting messages: ", error);
    throw error;
  }
};

/**
 * Fetches the chat list for a specific user.
 * - Identify all chat participants.
 * - Retrieve the latest messages for each participant.
 * - Fetch user details and count unread messages.
 *
 * @param {string} userId - The ID of the user whose chat list is to be retrieved.
 * @returns {Promise<Array>} - A promise resolving to an array of chat details.
 */

export const getChatList = async (userId: string) => {
  const chatListQuery = `
    WITH LastMessages AS (
      SELECT DISTINCT ON (conversation_users.other_user_id)
        conversation_users.other_user_id,
        messages.content,
        messages.timestamp,
        messages.sender_id,
        messages.receiver_id,
        messages.is_read
      FROM (
        SELECT 
          CASE 
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
          END as other_user_id
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
      ) conversation_users
      JOIN messages ON (
        (messages.sender_id = $1 AND messages.receiver_id = conversation_users.other_user_id) OR
        (messages.sender_id = conversation_users.other_user_id AND messages.receiver_id = $1)
      )
      ORDER BY conversation_users.other_user_id, messages.timestamp DESC
    )
    SELECT 
      lm.*,
      u.first_name,
      u.last_name,
      u.profile_picture,
      COUNT(CASE WHEN m.is_read = false AND m.receiver_id = $1 THEN 1 END) as unread_count
    FROM LastMessages lm
    JOIN users u ON u.id = lm.other_user_id
    LEFT JOIN messages m ON (
      m.sender_id = lm.other_user_id AND 
      m.receiver_id = $1 AND 
      m.is_read = false
    )
    GROUP BY 
      lm.other_user_id,
      lm.content,
      lm.timestamp,
      lm.sender_id,
      lm.receiver_id,
      lm.is_read,
      u.first_name,
      u.last_name,
      u.profile_picture
    ORDER BY lm.timestamp DESC;
  `;

  try {
    const { rows } = await query(chatListQuery, [userId]);
    return rows;
  } catch (error) {
    console.error("Error getting chat list:", error);
    throw error;
  }
};
