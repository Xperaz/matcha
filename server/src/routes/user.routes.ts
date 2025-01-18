import { Router } from "express";
import { protectRoutes } from "../middlewares/auth";
import { completeProfile, updatePassword } from "../controllers/user.controller";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { updateEmail } from "../controllers/user.controller";
import { Response } from "express";


const router: Router = Router();

router.post("/complete-profile", protectRoutes, completeProfile);

router.get("/me", protectRoutes, (req: AuthenticatedRequest, res:Response) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

router.put("/update-password", protectRoutes, updatePassword);
router.put("/update-email", protectRoutes, updateEmail);
router.put("/update-profile", protectRoutes);

export default router;