import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { addImage, removeImage } from "../controllers/imageController";

const router: Router = Router();

router.delete("/remove/:imageId", protectRoutes, removeImage);
router.post("/upload", protectRoutes, addImage);

export default router;