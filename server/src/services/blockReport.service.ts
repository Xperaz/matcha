import { query } from "../config/db";

export const blockUser = async (
  userId: string,
  receiverId: string
): Promise<void> => {
  const blockUserQuery: string = `
        INSERT INTO blocks (blocker_id, blocked_id)
        VALUES ($1, $2);
    `;
  try {
    await query(blockUserQuery, [userId, receiverId]);
  } catch (error) {
    console.error("Error blocking user: ", error);
    throw error;
  }
};

export const isUserBlocked = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const isBlockedQuery: string = `
        SELECT id FROM blocks
        WHERE blocker_id = $1 AND blocked_id = $2;
    `;
  try {
    const { rows: blockedUsers } = await query(isBlockedQuery, [
      userId,
      receiverId,
    ]);

    if (blockedUsers.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking blocked user: ", error);
    throw error;
  }
};

export const reportUser = async ( userId: string, receiverId: string): Promise<void> => {
  const reportUserQuery: string = `
    INSERT INTO reports (reporter_id, reported_id)
    VALUES ($1, $2);
  `;
  try {
    await query(reportUserQuery, [userId, receiverId]);
  } catch (error) {
    console.error("Error reporting user: ", error);
    throw error;
  }
}

export const isUserReported = async (
  userId: string,
  receiverId: string
): Promise<boolean> => {
  const isReportedQuery: string = `
    SELECT id FROM reports
    WHERE reporter_id = $1 AND reported_id = $2;
  `;
  try {
    const { rows: reportedUsers } = await query(isReportedQuery, [
      userId,
      receiverId,
    ]);

    if (reportedUsers.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking reported user: ", error);
    throw error;
  }
};