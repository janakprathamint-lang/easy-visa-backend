import type { Response } from "express";
import { storage } from "../utilities/storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { sendContactMessageToGoogleSheets } from "../utilities/googleSheets";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function getAllContactMessages(req: AuthRequest, res: Response) {
  try {
    const messages = await storage.getContactMessages();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
}

// export async function createContactMessage(req: AuthRequest, res: Response) {
//   try {
//     const validatedData = insertContactMessageSchema.parse(req.body);
//     const message = await storage.createContactMessage(validatedData);
    
//     if (!message) {
//       return res.status(500).json({ error: "Failed to create contact message" });
//     }
    
//     try {
//       await sendContactMessageToGoogleSheets(message);
//     } catch (sheetError) {
//       console.error("Failed to send contact message to Google Sheets:", sheetError);
//     }
    
//     res.status(201).json(message);
//   } catch (error) {
//     console.error("Error creating contact message:", error);
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: "Invalid contact message data" });
//     }
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }
export async function createContactMessage(req: AuthRequest, res: Response) {
  try {
    const validatedData = insertContactMessageSchema.parse(req.body);

    // 1️⃣ Save in DB (fast)
    const message = await storage.createContactMessage(validatedData);

    // 2️⃣ Respond immediately
    res.status(201).json({ success: true, message });

    // 3️⃣ Run Sheets update in background AFTER response  
    setTimeout(() => {
      sendContactMessageToGoogleSheets(message)
        .then(() => console.log("Sheet updated"))
        .catch(err => console.error("Sheet update failed:", err));
    }, 0);

  } catch (error) {
    console.error("Error creating contact message:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid contact message data" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}
