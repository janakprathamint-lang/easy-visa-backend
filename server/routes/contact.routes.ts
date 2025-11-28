import { Router } from "express";
import * as contactController from "../controllers/contact.controller";
import { authenticateToken, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, requireAdmin, contactController.getAllContactMessages);
router.post("/", contactController.createContactMessage);

export default router;
