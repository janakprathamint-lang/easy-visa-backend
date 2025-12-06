import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  checkDuplicates,
  checkEmailDuplicate,
  checkPhoneDuplicate,
  createSpouseSubmission,
  getPublicSpouseSubmission,
  getAllSpouseSubmissions,
  getSpouseSubmissionById,
} from "../controllers/spouse.controller";

const router = Router();

router.post("/check-duplicates", checkDuplicates);

router.post("/check-email", checkEmailDuplicate);

router.post("/check-phone", checkPhoneDuplicate);

router.post("/", createSpouseSubmission);

router.get("/public/:id", getPublicSpouseSubmission);

router.get("/", authenticateToken, getAllSpouseSubmissions);

router.get("/:id", authenticateToken, getSpouseSubmissionById);

export default router;
