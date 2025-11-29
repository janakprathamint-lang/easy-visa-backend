import type { Response } from "express";
import { storage } from "../utilities/storage";
import { insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { calculateEligibilityScore } from "@shared/eligibilityCalculator";
import { sendSubmissionToGoogleSheets } from "../utilities/googleSheets";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function getAllSubmissions(req: AuthRequest, res: Response) {
  try {
    const submissions = await storage.getSubmissions();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
}

export async function getSubmissionById(req: AuthRequest, res: Response) {
  try {
    const submission = await storage.getSubmission(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submission" });
  }
}

export async function getPublicSubmission(req: AuthRequest, res: Response) {
  try {
    const submission = await storage.getSubmission(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    
    const eligibilityResult = calculateEligibilityScore(submission);
    
    res.json({
      id: submission.id,
      eligibilityScore: submission.eligibilityScore,
      status: submission.status,
      submittedAt: submission.submittedAt,
      eligibilityDetails: eligibilityResult,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submission" });
  }
}

export async function createSubmission(req: AuthRequest, res: Response) {
  try {
    const validatedData = insertSubmissionSchema.parse(req.body);
    
    // Normalize email to lowercase for consistent storage and duplicate checking
    validatedData.email = validatedData.email.toLowerCase().trim();
    
    const existingEmailSubmission = await storage.getSubmissionByEmail(validatedData.email);
    if (existingEmailSubmission) {
      return res.status(400).json({ error: "This email address has already been used for a submission" });
    }
    
    const existingPhoneSubmission = await storage.getSubmissionByPhone(validatedData.phone);
    if (existingPhoneSubmission) {
      return res.status(400).json({ error: "This phone number has already been used for a submission" });
    }
    
    const eligibilityResult = calculateEligibilityScore(validatedData);
    
    const submission = await storage.createSubmission({
      ...validatedData,
      eligibilityScore: eligibilityResult.score,
      status: eligibilityResult.isEligible ? "approved" : "pending",
    });
    
    if (!submission) {
      return res.status(500).json({ error: "Failed to create submission" });
    }
    
    try {
      await sendSubmissionToGoogleSheets(submission);
    } catch (sheetsError) {
      console.error("Failed to send to Google Sheets, but submission was saved:", sheetsError);
    }
    
    res.status(201).json(submission);
  } catch (error) {
    console.error("Error creating submission:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid submission data" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateSubmissionStatus(req: AuthRequest, res: Response) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const submission = await storage.updateSubmissionStatus(req.params.id, status);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to update submission" });
  }
}


