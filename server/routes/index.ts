import type { Express } from "express";
import { createServer, type Server } from "http";
import healthRoutes from "./health.routes";
import submissionsRoutes from "./submissions.routes";
import spouseSubmissionsRoutes from "./spouse-submissions.routes";
import authRoutes from "./auth.routes";
import contactRoutes from "./contact.routes";
import dashboardRoutes from "./dashboard.routes";

export function registerRoutes(app: Express): Server {
  app.use("/api/health", healthRoutes);
  app.use("/api/submissions", submissionsRoutes);
  app.use("/api/spouse-submissions", spouseSubmissionsRoutes);
  app.use("/api/admin", authRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
