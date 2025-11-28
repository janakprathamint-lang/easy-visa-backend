import { type User, type InsertUser, type Submission, type InsertSubmission, type ContactMessage, type InsertContactMessage, type RefreshToken, type InsertRefreshToken, users, submissions, contactMessages, refreshTokens } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, lt } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSubmissions(): Promise<Submission[]>;
  getSubmission(id: string): Promise<Submission | undefined>;
  getSubmissionByPhone(phone: string): Promise<Submission | undefined>;
  getSubmissionByEmail(email: string): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateEligibilityScore(id: string, score: number): Promise<Submission | undefined>;
  updateSubmissionStatus(id: string, status: string): Promise<Submission | undefined>;

  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  createRefreshToken(refreshToken: InsertRefreshToken): Promise<RefreshToken>;
  getRefreshToken(token: string): Promise<RefreshToken | undefined>;
  deleteRefreshToken(token: string): Promise<void>;
  deleteUserRefreshTokens(userId: string): Promise<void>;
  deleteExpiredRefreshTokens(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private submissions: Map<string, Submission>;
  private contactMessages: Map<string, ContactMessage>;
  private refreshTokens: Map<string, RefreshToken>;

  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.contactMessages = new Map();
    this.refreshTokens = new Map();
    
    this.seedSampleData();
  }

  private seedSampleData() {
    const sampleSubmissions: Submission[] = [
      {
        id: randomUUID(),
        fullName: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 234 567 8901",
        city: "Mumbai",
        education: "bachelor",
        educationGrade: "8.5",
        gradeType: "cgpa",
        hasLanguageTest: "yes",
        languageTest: "ielts",
        ieltsScore: "7.5",
        courseRelevance: null,
        courseType: null,
        institutionType: null,
        gapYears: null,
        proofOfFunds: null,
        strongSOP: null,
        publicUniversityLOA: null,
        hasWorkExperience: "yes",
        workExperienceYears: "3",
        financialCapacity: "40-60",
        preferredIntake: "september",
        preferredProvince: "ontario",
        eligibilityScore: 85,
        status: "approved",
        submittedAt: new Date("2024-01-15T10:30:00"),
      },
      {
        id: randomUUID(),
        fullName: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 234 567 8902",
        city: "Lagos",
        education: "master",
        educationGrade: "9.0",
        gradeType: "cgpa",
        hasLanguageTest: "yes",
        languageTest: "ielts",
        ieltsScore: "8.0",
        courseRelevance: null,
        courseType: null,
        institutionType: null,
        gapYears: null,
        proofOfFunds: null,
        strongSOP: null,
        publicUniversityLOA: null,
        hasWorkExperience: "yes",
        workExperienceYears: "5",
        financialCapacity: "above-60",
        preferredIntake: "january",
        preferredProvince: "british-columbia",
        eligibilityScore: 92,
        status: "approved",
        submittedAt: new Date("2024-01-16T14:20:00"),
      },
      {
        id: randomUUID(),
        fullName: "Michael Chen",
        email: "m.chen@example.com",
        phone: "+1 234 567 8903",
        city: "Beijing",
        education: "12th",
        educationGrade: "75",
        gradeType: null,
        hasLanguageTest: "no",
        languageTest: null,
        ieltsScore: null,
        courseRelevance: null,
        courseType: null,
        institutionType: null,
        gapYears: null,
        proofOfFunds: null,
        strongSOP: null,
        publicUniversityLOA: null,
        hasWorkExperience: "no",
        workExperienceYears: null,
        financialCapacity: "20-40",
        preferredIntake: "may",
        preferredProvince: "alberta",
        eligibilityScore: 70,
        status: "pending",
        submittedAt: new Date("2024-01-17T09:15:00"),
      },
    ];

    sampleSubmissions.forEach((submission) => {
      this.submissions.set(submission.id, submission);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: insertUser.role ?? "user" };
    this.users.set(id, user);
    return user;
  }

  async getSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values()).sort((a, b) => {
      return new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime();
    });
  }

  async getSubmission(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionByPhone(phone: string): Promise<Submission | undefined> {
    return Array.from(this.submissions.values()).find(
      (submission) => submission.phone === phone,
    );
  }

  async getSubmissionByEmail(email: string): Promise<Submission | undefined> {
    return Array.from(this.submissions.values()).find(
      (submission) => submission.email === email,
    );
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      id,
      fullName: insertSubmission.fullName,
      email: insertSubmission.email,
      phone: insertSubmission.phone,
      city: insertSubmission.city,
      education: insertSubmission.education ?? null,
      educationGrade: insertSubmission.educationGrade ?? null,
      gradeType: insertSubmission.gradeType ?? null,
      hasLanguageTest: insertSubmission.hasLanguageTest ?? null,
      languageTest: insertSubmission.languageTest ?? null,
      ieltsScore: insertSubmission.ieltsScore ?? null,
      courseRelevance: insertSubmission.courseRelevance ?? null,
      courseType: insertSubmission.courseType ?? null,
      institutionType: insertSubmission.institutionType ?? null,
      gapYears: insertSubmission.gapYears ?? null,
      proofOfFunds: insertSubmission.proofOfFunds ?? null,
      strongSOP: insertSubmission.strongSOP ?? null,
      publicUniversityLOA: insertSubmission.publicUniversityLOA ?? null,
      hasWorkExperience: insertSubmission.hasWorkExperience ?? null,
      workExperienceYears: insertSubmission.workExperienceYears ?? null,
      financialCapacity: insertSubmission.financialCapacity ?? null,
      preferredIntake: insertSubmission.preferredIntake ?? null,
      preferredProvince: insertSubmission.preferredProvince ?? null,
      eligibilityScore: insertSubmission.eligibilityScore ?? null,
      status: insertSubmission.status || "pending",
      submittedAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateEligibilityScore(id: string, score: number): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (submission) {
      submission.eligibilityScore = score;
      this.submissions.set(id, submission);
    }
    return submission;
  }

  async updateSubmissionStatus(id: string, status: string): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (submission) {
      submission.status = status;
      this.submissions.set(id, submission);
    }
    return submission;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => {
      return new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime();
    });
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const contactMessage: ContactMessage = {
      id,
      name: insertMessage.name,
      email: insertMessage.email,
      phone: insertMessage.phone,
      subject: insertMessage.subject,
      message: insertMessage.message,
      submittedAt: new Date(),
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }

  async createRefreshToken(insertToken: InsertRefreshToken): Promise<RefreshToken> {
    const id = randomUUID();
    const refreshToken: RefreshToken = {
      id,
      userId: insertToken.userId,
      token: insertToken.token,
      expiresAt: insertToken.expiresAt,
      createdAt: new Date(),
    };
    this.refreshTokens.set(insertToken.token, refreshToken);
    return refreshToken;
  }

  async getRefreshToken(token: string): Promise<RefreshToken | undefined> {
    return this.refreshTokens.get(token);
  }

  async deleteRefreshToken(token: string): Promise<void> {
    this.refreshTokens.delete(token);
  }

  async deleteUserRefreshTokens(userId: string): Promise<void> {
    for (const [token, refreshToken] of this.refreshTokens.entries()) {
      if (refreshToken.userId === userId) {
        this.refreshTokens.delete(token);
      }
    }
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    const now = new Date();
    for (const [token, refreshToken] of this.refreshTokens.entries()) {
      if (refreshToken.expiresAt < now) {
        this.refreshTokens.delete(token);
      }
    }
  }
}

class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // NOTE: Using same workaround as createSubmission - see comment there
    const id = randomUUID();
    const userData = {
      ...insertUser,
      id,
    };
    await db.insert(users).values(userData);
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions).orderBy(desc(submissions.submittedAt));
  }

  async getSubmission(id: string): Promise<Submission | undefined> {
    const result = await db.select().from(submissions).where(eq(submissions.id, id));
    return result[0];
  }

  async getSubmissionByPhone(phone: string): Promise<Submission | undefined> {
    try {
      const result = await db.select().from(submissions).where(eq(submissions.phone, phone)).orderBy(desc(submissions.submittedAt));
      return result?.[0];
    } catch (error) {
      console.error("Error in getSubmissionByPhone:", error);
      return undefined;
    }
  }

  async getSubmissionByEmail(email: string): Promise<Submission | undefined> {
    try {
      const result = await db.select().from(submissions).where(eq(submissions.email, email)).orderBy(desc(submissions.submittedAt));
      return result?.[0];
    } catch (error) {
      console.error("Error in getSubmissionByEmail:", error);
      return undefined;
    }
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    // NOTE: The neon-http driver doesn't support .returning() properly (returns empty array).
    // Workaround: Generate UUID before insert, then query the inserted record.
    // This is safe for single-row inserts and avoids race conditions in this context.
    const id = randomUUID();
    const submissionData = {
      ...insertSubmission,
      id,
      submittedAt: new Date(),
    };
    
    await db.insert(submissions).values(submissionData);
    
    // Query the inserted record to return it
    const result = await db.select().from(submissions).where(eq(submissions.id, id));
    return result[0];
  }


  async updateEligibilityScore(id: string, score: number): Promise<Submission | undefined> {
    await db.update(submissions)
      .set({ eligibilityScore: score })
      .where(eq(submissions.id, id));
    const result = await db.select().from(submissions).where(eq(submissions.id, id));
    return result[0];
  }

  async updateSubmissionStatus(id: string, status: string): Promise<Submission | undefined> {
    await db.update(submissions)
      .set({ status })
      .where(eq(submissions.id, id));
    const result = await db.select().from(submissions).where(eq(submissions.id, id));
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.submittedAt));
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const messageData = {
      ...insertMessage,
      id,
      submittedAt: new Date(),
    };
    
    await db.insert(contactMessages).values(messageData);
    
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return result[0];
  }

  async createRefreshToken(insertToken: InsertRefreshToken): Promise<RefreshToken> {
    const id = randomUUID();
    const tokenData = {
      ...insertToken,
      id,
      createdAt: new Date(),
    };
    
    await db.insert(refreshTokens).values(tokenData);
    
    const result = await db.select().from(refreshTokens).where(eq(refreshTokens.id, id));
    return result[0];
  }

  async getRefreshToken(token: string): Promise<RefreshToken | undefined> {
    const result = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return result[0];
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }

  async deleteUserRefreshTokens(userId: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    const now = new Date();
    await db.delete(refreshTokens).where(lt(refreshTokens.expiresAt, now));
  }
}

export const storage = new DbStorage();
