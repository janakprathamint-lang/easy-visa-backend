import { Router } from "express";
import * as healthController from "../controllers/health.controller";

const router = Router();

router.get("/connections", healthController.checkConnections);

export default router;
