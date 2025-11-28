export async function checkConnections(req: any, res: any) {
  const health = {
    database: { connected: false, error: null as string | null },
    googleSheets: { connected: false, error: null as string | null },
    timestamp: new Date().toISOString(),
  };

  try {
    const { db } = await import("../utilities/db");
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`SELECT 1`);
    health.database.connected = true;
    console.log("✅ Database connection successful");
  } catch (error) {
    health.database.error = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Database connection failed:", error);
  }

  try {
    const { getUncachableGoogleSheetClient } = await import("./../../test-google");
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID || '1LTzwZoKV-8uSvak7pixPxM17y40rhfiFRnwUJmekWo8';
    
    await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });
    
    health.googleSheets.connected = true;
    console.log("✅ Google Sheets connection successful");
  } catch (error) {
    health.googleSheets.error = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Google Sheets connection failed:", error);
  }

  const overallStatus = health.database.connected && health.googleSheets.connected;
  res.status(overallStatus ? 200 : 503).json(health);
}
