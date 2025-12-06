import { Router } from "express";
import * as submissionsController from "../controllers/submissions.controller";
import { authenticateToken, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, requireAdmin, submissionsController.getAllSubmissions);
router.get("/public/:id", submissionsController.getPublicSubmission);
router.get("/:id", authenticateToken, requireAdmin, submissionsController.getSubmissionById);
router.post("/", submissionsController.createSubmission);
router.patch("/:id/status", authenticateToken, requireAdmin, submissionsController.updateSubmissionStatus);

export default router;
