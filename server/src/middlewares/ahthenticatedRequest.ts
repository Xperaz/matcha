import { Request } from "express";
import { UserDTO } from "../dtos/user/userDto";

export interface AuthenticatedRequest extends Request {
  user: UserDTO;
}
