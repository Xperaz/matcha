import { json } from "body-parser";
import { Request, Response, Router } from "express";
import {googleOauthHandle} from "../controllers/google.controller"

const router: Router = Router();

router.get("/callback", googleOauthHandle);

export default router;
