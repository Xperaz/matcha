import { query } from "../config/db";
import { visits } from "../types/history";
import { likes } from "../types/history";

const mapVisits = (rows: any[]): visits[] => {
  return rows.map((row) => {
    const visit: visits = {
      id: row.id,
      sender_id: row.visitor_id,
      sender_name: `${row.first_name} ${row.last_name}`,
      created_at: row.visit_timestamp,
    };
    return visit;
  });
};

const mapLikes = (rows: any[]): likes[] => {
  return rows.map((row) => {
    const like: likes = {
      id: row.id,
      sender_id: row.initiator_id,
      sender_name: `${row.first_name} ${row.last_name}`,
      created_at: row.created_at,
    };
    return like;
  });
};

export const getLikesHistory = async (
  userId: string,
  limit: number,
  page: number
): Promise<likes[]> => {
  const getLikesQuery: string = `
            SELECT likes.id, likes.initiator_id, users.first_name, users.last_name, likes.created_at
            FROM likes
            JOIN users ON likes.initiator_id = users.id
            WHERE likes.receiver_id = $1
            ORDER BY likes.created_at ASC
            LIMIT $2 OFFSET $3;
        `;
  try {
    const { rows } = await query(getLikesQuery, [
      userId,
      limit,
      (page - 1) * limit,
    ]);
    return mapLikes(rows);
  } catch (error) {
    console.error("Error getting likes: ", error);
    throw error;
  }
};

export const getVisitsHistory = async (
  userId: string,
  limit: number,
  page: number
): Promise<visits[]> => {
  const getVisitsQuery: string = `
            SELECT visits.id, visits.visitor_id, users.first_name, users.last_name, visits.visit_timestamp
            FROM visits
            JOIN users ON visits.visitor_id = users.id
            WHERE visits.visited_id = $1
            ORDER BY visits.visit_timestamp ASC
            LIMIT $2 OFFSET $3;
        `;
  try {
    const { rows } = await query(getVisitsQuery, [
      userId,
      limit,
      (page - 1) * limit,
    ]);
    return mapVisits(rows);
  } catch (error) {
    console.error("Error getting visits: ", error);
    throw error;
  }
};
