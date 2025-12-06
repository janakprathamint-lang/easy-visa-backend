import type { Response } from "express";
import { storage } from "../utilities/storage";
import type { AuthRequest } from "../middleware/auth.middleware";

interface RecentSubmission {
  id: string;
  type: "student" | "spouse" | "contact";
  name: string;
  email: string;
  phone: string;
  submittedAt: Date | null;
}

export async function getRecentSubmissions(req: AuthRequest, res: Response) {
  try {
    const [studentSubmissions, spouseSubmissions, contactMessages] = await Promise.all([
      storage.getSubmissions(),
      storage.getSpouseSubmissions(),
      storage.getContactMessages(),
    ]);

    const combined: RecentSubmission[] = [
      ...studentSubmissions.map((s) => ({
        id: s.id,
        type: "student" as const,
        name: s.fullName,
        email: s.email,
        phone: s.phone,
        submittedAt: s.submittedAt,
      })),
      ...spouseSubmissions.map((s) => ({
        id: s.id,
        type: "spouse" as const,
        name: s.fullName,
        email: s.email,
        phone: s.phone,
        submittedAt: s.submittedAt,
      })),
      ...contactMessages.map((c) => ({
        id: c.id,
        type: "contact" as const,
        name: c.name,
        email: c.email,
        phone: c.phone,
        submittedAt: c.submittedAt,
      })),
    ];

    combined.sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });

    const recent10 = combined.slice(0, 10);

    res.json(recent10);
  } catch (error) {
    console.error("Error fetching recent submissions:", error);
    res.status(500).json({ error: "Failed to fetch recent submissions" });
  }
}
