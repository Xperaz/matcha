import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { completeProfile } from "../controllers/userController";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { Response } from "express";


const router: Router = Router();

router.post("/complete-profile", protectRoutes, completeProfile);

router.get("/me", protectRoutes, (req: AuthenticatedRequest, res:Response) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

router.put("/update-password", protectRoutes);
router.put("/update-email", protectRoutes);
router.put("/update-profile", protectRoutes);

export default router;