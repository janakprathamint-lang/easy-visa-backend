// import { google } from "googleapis";
// import type { Submission, ContactMessage } from "@shared/schema";

// /* ---------------------------------------------------------
//    GOOGLE AUTH USING SERVICE ACCOUNT FILE
// --------------------------------------------------------- */

// const auth = new google.auth.GoogleAuth({
//   keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // <-- READ FILE PATH ONLY
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// export async function getGoogleSheetClient() {
//   return google.sheets({ version: "v4", auth });
// }

// /* ---------------------------------------------------------
//    ENV VARIABLES
// --------------------------------------------------------- */

// const SPREADSHEET_ID =
//   process.env.GOOGLE_SHEET_ID;

// const CONTACT_SPREADSHEET_ID =
//   process.env.GOOGLE_CONTACT_SHEET_ID;

// /* ---------------------------------------------------------
//    SUBMISSION → SEND TO GOOGLE SHEETS
// --------------------------------------------------------- */
// export async function sendSubmissionToGoogleSheets(
//   submission: Submission
// ): Promise<void> {
//   try {
//     const sheets = await getGoogleSheetClient();

//     const formattedDate = new Date().toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });

//     const row = [
//       formattedDate,
//       submission.id || "",
//       submission.fullName || "",
//       submission.email || "",
//       submission.phone || "",
//       submission.city || "",
//       submission.education || "",
//       submission.educationGrade || "",
//       submission.gradeType || "",
//       submission.hasLanguageTest || "",
//       submission.languageTest || "",
//       submission.ieltsScore || "",
//       submission.courseRelevance || "",
//       submission.courseType || "",
//       submission.institutionType || "",
//       submission.gapYears || "",
//       submission.proofOfFunds || "",
//       submission.strongSOP || "",
//       submission.publicUniversityLOA || "",
//       submission.hasWorkExperience || "",
//       submission.workExperienceYears || "",
//       submission.financialCapacity || "",
//       submission.preferredIntake || "",
//       submission.preferredProvince || "",
//       submission.eligibilityScore?.toString() || "",
//       submission.status || "",
//     ];

//     // Write header if missing
//     const headerResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId: SPREADSHEET_ID,
//       range: "Sheet1!A1:Z1",
//     });

//     const expectedHeader = "Submission Date";
//     const headersMissing =
//       !headerResponse.data.values ||
//       !headerResponse.data.values[0] ||
//       headerResponse.data.values[0][0] !== expectedHeader;

//     if (headersMissing) {
//       await sheets.spreadsheets.values.update({
//         spreadsheetId: SPREADSHEET_ID,
//         range: "Sheet1!A1",
//         valueInputOption: "RAW",
//         requestBody: {
//           values: [
//             [
//               "Submission Date",
//               "Submission ID",
//               "Full Name",
//               "Email",
//               "Phone",
//               "City",
//               "Education Level",
//               "Education Grade",
//               "Grade Type",
//               "Has Language Test",
//               "Language Test Type",
//               "Language Test Score",
//               "Course Relevance",
//               "Course Type",
//               "Institution Type",
//               "Gap Years",
//               "Proof of Funds",
//               "Strong SOP",
//               "Public University LOA",
//               "Has Work Experience",
//               "Work Experience Years",
//               "Financial Capacity",
//               "Preferred Intake",
//               "Preferred Province",
//               "Eligibility Score",
//               "Status",
//             ],
//           ],
//         },
//       });
//     }

//     // Append row
//     await sheets.spreadsheets.values.append({
//       spreadsheetId: SPREADSHEET_ID,
//       range: "Sheet1!A:Z",
//       valueInputOption: "RAW",
//       insertDataOption: "INSERT_ROWS",
//       requestBody: { values: [row] },
//     });

//     console.log("✅ Google Sheet saved submission:", submission.id);
//   } catch (err) {
//     console.error("❌ Google Sheets submission error:", err);
//     throw err;
//   }
// }

// /* ---------------------------------------------------------
//    CONTACT FORM → SEND TO GOOGLE SHEETS
// --------------------------------------------------------- */
// export async function sendContactMessageToGoogleSheets(
//   contact: ContactMessage
// ): Promise<void> {
//   try {
//     const sheets = await getGoogleSheetClient();

//     const formattedDate = new Date().toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });

//     const row = [
//       formattedDate,
//       contact.name || "",
//       contact.email || "",
//       contact.phone || "",
//       contact.subject || "",
//       contact.message || "",
//     ];

//     // Header check
//     const headerResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId: CONTACT_SPREADSHEET_ID,
//       range: "Sheet1!A1:F1",
//     });

//     const expectedHeader = "Submission Date";
//     const headersMissing =
//       !headerResponse.data.values ||
//       !headerResponse.data.values[0] ||
//       headerResponse.data.values[0][0] !== expectedHeader;

//     if (headersMissing) {
//       await sheets.spreadsheets.values.update({
//         spreadsheetId: CONTACT_SPREADSHEET_ID,
//         range: "Sheet1!A1",
//         valueInputOption: "RAW",
//         requestBody: {
//           values: [
//             [
//               "Submission Date",
//               "Name",
//               "Email",
//               "Phone",
//               "Subject",
//               "Message",
//             ],
//           ],
//         },
//       });
//     }

//     // Append contact row
//     await sheets.spreadsheets.values.append({
//       spreadsheetId: CONTACT_SPREADSHEET_ID,
//       range: "Sheet1!A:F",
//       valueInputOption: "RAW",
//       insertDataOption: "INSERT_ROWS",
//       requestBody: { values: [row] },
//     });

//     console.log("✅ Contact saved:", contact.name);
//   } catch (err) {
//     console.error("❌ Google Sheets contact error:", err);
//     throw err;
//   }
// }
import { google } from "googleapis";
import type { Submission, ContactMessage } from "./../../shared/schema";

/* ---------------------------------------------------------
   GOOGLE AUTH USING JSON FROM ENV (Render Compatible)
--------------------------------------------------------- */

// const credentials = googlesheetjson;

// console.log(credentials,"---------------------------------")

function loadCredentials() {
  if (process.env.GOOGLE_CREDENTIALS) {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS);
  }

  // fallback for local development
  return require("./credentials.json");
}

const auth = new google.auth.GoogleAuth({
  credentials: loadCredentials(),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function getGoogleSheetClient() {
  return google.sheets({ version: "v4", auth });
}
/* ---------------------------------------------------------
   ENV VARIABLES
--------------------------------------------------------- */

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const CONTACT_SPREADSHEET_ID = process.env.GOOGLE_CONTACT_SHEET_ID;

/* ---------------------------------------------------------
   SUBMISSION → SEND TO GOOGLE SHEETS
--------------------------------------------------------- */
export async function sendSubmissionToGoogleSheets(
  submission: Submission
): Promise<void> {
  try {
    const sheets = await getGoogleSheetClient();

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const row = [
      formattedDate,
      submission.id || "",
      submission.fullName || "",
      submission.email || "",
      submission.phone || "",
      submission.city || "",
      submission.education || "",
      submission.educationGrade || "",
      submission.gradeType || "",
      submission.hasLanguageTest || "",
      submission.languageTest || "",
      submission.ieltsScore || "",
      submission.courseRelevance || "",
      submission.courseType || "",
      submission.institutionType || "",
      submission.gapYears || "",
      submission.proofOfFunds || "",
      submission.strongSOP || "",
      submission.publicUniversityLOA || "",
      submission.hasWorkExperience || "",
      submission.workExperienceYears || "",
      submission.financialCapacity || "",
      submission.preferredIntake || "",
      submission.preferredProvince || "",
      submission.eligibilityScore?.toString() || "",
      submission.status || "",
    ];

    // Header check
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:Z1",
    });

    const expectedHeader = "Submission Date";
    const headersMissing =
      !headerResponse.data.values ||
      !headerResponse.data.values[0] ||
      headerResponse.data.values[0][0] !== expectedHeader;

    if (headersMissing) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A1",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              "Submission Date",
              "ID",
              "Full Name",
              "Email",
              "Phone",
              "City",
              "Education",
              "Education Grade",
              "Grade Type",
              "Has Language Test",
              "Language Test",
              "IELTS Score",
              "Course Relevance",
              "Course Type",
              "Institution Type",
              "Gap Years",
              "Proof of Funds",
              "Strong SOP",
              "Public Uni LOA",
              "Has Work Experience",
              "Work Experience (Years)",
              "Financial Capacity",
              "Preferred Intake",
              "Preferred Province",
              "Eligibility Score",
              "Status",
            ],
          ],
        },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:Z",
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });
  } catch (err) {
    console.error("❌ Google Sheets submission error:", err);
    throw err;
  }
}
/* ---------------------------------------------------------
   CONTACT MESSAGE → SEND TO GOOGLE SHEETS (WITH HEADER)
--------------------------------------------------------- */
export async function sendContactMessageToGoogleSheets(
  message: ContactMessage
): Promise<void> {
  try {
    const sheets = await getGoogleSheetClient();

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const HEADER = [
      "Date",
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
    ];

    /* ---------------------------------------------------------
       1️⃣ CHECK IF HEADER EXISTS
    --------------------------------------------------------- */
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: CONTACT_SPREADSHEET_ID!,
      range: "Sheet1!A1:F1",
    });

    const hasHeader =
      existing.data.values &&
      existing.data.values.length > 0 &&
      existing.data.values[0].length >= HEADER.length;

    /* ---------------------------------------------------------
       2️⃣ IF NO HEADER → ADD HEADER FIRST
    --------------------------------------------------------- */
    if (!hasHeader) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: CONTACT_SPREADSHEET_ID!,
        range: "Sheet1!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [HEADER],
        },
      });

      console.log("⬆️ Header added to Google Sheet");
    }

    /* ---------------------------------------------------------
       3️⃣ APPEND THE ACTUAL CONTACT MESSAGE BELOW HEADER
    --------------------------------------------------------- */
    await sheets.spreadsheets.values.append({
      spreadsheetId: CONTACT_SPREADSHEET_ID!,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            formattedDate,
            message.name,
            message.email,
            message.phone || "",
            message.subject,
            message.message,
          ],
        ],
      },
    });

    console.log("📩 Contact message added to Google Sheets");
  } catch (error) {
    console.error("❌ Failed to write contact message:", error);
    throw error;
  }
}
