import { query } from "../config/db";
import { Notification } from "../types/notif";
import { io } from "../server";
import { socketMap } from "../middlewares/socketAuthrization";

const mapNotification = (rows: any[]): Notification[] => {
  const notifications: Notification[] = rows.map((row) => {
    return {
      id: row.id,
      message: row.message,
      is_read: row.is_read,
      sender_id: row.sender_id,
      sender_name: `${row.first_name} ${row.last_name}`,
      created_at: row.created_at,
    };
  });
  return notifications;
};

const sendNotification = async (
  senderId: string,
  receiverId: string,
  message: string,
  notifId: string
): Promise<void> => {
  const getSenderQuery = `
        SELECT first_name, last_name FROM users
        WHERE id = $1
    `;
  const recieverSocketId = socketMap.get(receiverId);

  if (!recieverSocketId) {
    // user is offline
    return;
  }

  try {
    const { rows: sender } = await query(getSenderQuery, [senderId]);
    const senderName = `${sender[0].first_name} ${sender[0].last_name}`;
    const notification: Notification = {
      id: notifId,
      message: message,
      is_read: false,
      sender_id: senderId,
      sender_name: senderName,
      created_at: new Date().toISOString(),
    };
    io.to(recieverSocketId).emit("new_notification", {
      notification,
    });
  } catch (error) {
    console.error("Error sending notification", error);
    throw error;
  }
};

const setNotificationAsRead = async (ids: string[]): Promise<void> => {
  const setAsReadQuery = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ANY($1)
    `;

  try {
    await query(setAsReadQuery, [ids]);
  } catch (error) {
    console.error("Error setting notifications as read: ", error);
    throw error;
  }
};

export const getAllNotifications = async (
  userId: string,
  limit: number,
  last_notif: string | null = null
): Promise<Notification[]> => {
  let params = [userId, limit];
  let getNotificationsQuery = `
      SELECT 
          n.id, 
          n.message, 
          n.is_read, 
          n.sender_id, 
          n.created_at::timestamp::text as created_at, 
          u.first_name, 
          u.last_name
      FROM notifications n
      JOIN users u ON n.sender_id = u.id
      WHERE n.receiver_id = $1
    `;
    
  if (last_notif) {
    getNotificationsQuery += ` AND n.created_at < $3`;
    params.push(last_notif);
  }

  getNotificationsQuery += `
      ORDER BY n.created_at DESC
      LIMIT $2
  `;

  try {
    const { rows: notifs } = await query(getNotificationsQuery, params);
    const notifIds = notifs.map((notif: Notification) => notif.id);
    await setNotificationAsRead(notifIds);
    return mapNotification(notifs);
  } catch (error) {
    console.error("Error getting notifications: ", error);
    throw error;
  }
};

export const getUnreadNotifications = async (
  userId: string
): Promise<number> => {
  const getUnreadNotifsCount = `
        SELECT COUNT(*) FROM notifications
        WHERE receiver_id = $1 AND is_read = FALSE
    `;

  try {
    const { rows: notifs } = await query(getUnreadNotifsCount, [userId]);
    return parseInt(notifs[0].count);
  } catch (error) {
    console.error("Error getting notifications: ", error);
    throw error;
  }
};

export const createNotificationAndSendMessage = async (
  senderId: string,
  receiverId: string,
  message: string
): Promise<void> => {
  const createNotifQuery = `
        INSERT INTO notifications (sender_id, receiver_id, message)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
  try {
    const { rows } = await query(createNotifQuery, [
      senderId,
      receiverId,
      message,
    ]);
    await sendNotification(senderId, receiverId, message, rows[0].id);
  } catch (error) {
    console.error("Error creating notification: ", error);
    throw error;
  }
};
