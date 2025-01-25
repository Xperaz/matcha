import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { addImage, removeImage, addProfileImage, getAllImages } from "../controllers/image.controller";
import { usableProfile } from "../middlewares/usableProfile";

const router: Router = Router();

router.delete("/remove/:imageId", protectRoutes, usableProfile, removeImage);
router.post("/upload", protectRoutes, usableProfile, addImage);
router.post("/profile-picture", usableProfile, protectRoutes, addProfileImage);
router.get("/images", usableProfile, protectRoutes, getAllImages);

export default router;