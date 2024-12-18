import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { addImage, removeImage, addProfileImage } from "../controllers/imageController";

const router: Router = Router();

router.delete("/remove/:imageId", protectRoutes, removeImage);
router.post("/upload", protectRoutes, addImage);
router.post("/profile-picture", protectRoutes, addProfileImage);

export default router;