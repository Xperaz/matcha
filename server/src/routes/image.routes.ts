import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { addImage, removeImage, addProfileImage, getAllImages } from "../controllers/image.controller";

const router: Router = Router();

router.delete("/remove/:imageId", protectRoutes, removeImage);
router.post("/upload", protectRoutes, addImage);
router.post("/profile-picture", protectRoutes, addProfileImage);
router.get("/images", protectRoutes, getAllImages);

export default router;