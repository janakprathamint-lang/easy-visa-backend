import { Router } from "express";
import { getRecentSubmissions } from "../controllers/dashboard.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/recent", authenticateToken, getRecentSubmissions);

export default router;
