import { query } from "../config/db";
import cloudinary from "../config/cloudinary";
import { Response } from "express";
import {
  completeProfileReqeuest,
  isValidInterest,
  isValidPreference,
} from "../dtos/requests/completeProfileRequest";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import bcrypt from "bcryptjs";

