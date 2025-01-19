import { query } from "../config/db";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { Response } from "express";

export const search = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const usersQuery = `
    select * from users;
  `;

  const { rows } = await query(usersQuery);

  return res.status(200).json({
    success: true,
    data: rows,
  });
};
