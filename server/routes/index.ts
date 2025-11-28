import type { Express } from "express";
import { createServer, type Server } from "http";
import healthRoutes from "./health.routes";
import submissionsRoutes from "./submissions.routes";
import authRoutes from "./auth.routes";
import contactRoutes from "./contact.routes";

export function registerRoutes(app: Express): Server {
  app.use("/api/health", healthRoutes);
  app.use("/api/submissions", submissionsRoutes);
  app.use("/api/admin", authRoutes);
  app.use("/api/contact-messages", contactRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
