import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: any; // TODO: Adjust `any` to your user type if defined
}