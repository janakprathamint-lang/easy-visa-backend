// import { google } from "googleapis";


// async function test() {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });

//   const client = google.sheets({ version: "v4", auth });
// }

// test();
import { google, sheets_v4 } from "googleapis";
import path from "path";

export async function getUncachableGoogleSheetClient(): Promise<sheets_v4.Sheets> {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!credentialsPath) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(credentialsPath),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}
