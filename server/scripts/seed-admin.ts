import bcrypt from "bcrypt";
import { db } from "../utilities/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "internal_admin@pi.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pi@Admin123#";

async function seedAdminUser() {
  try {
    console.log("🌱 Starting admin user seed...");
    
    // Check if admin user already exists
    let existingAdmin;
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.username, ADMIN_USERNAME))
        .limit(1);
      
      existingAdmin = result && result.length > 0 ? result : null;
    } catch (error) {
      console.log("⚠️  Error checking for existing admin, proceeding with creation...");
      existingAdmin = null;
    }

    if (existingAdmin && existingAdmin.length > 0) {
      console.log(`⚠️  Admin user "${ADMIN_USERNAME}" already exists. Skipping creation.`);
      console.log(`💡 To update the password, delete the existing admin user first.`);
      process.exit(0);
    }

    // Hash the password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    console.log(`👤 Creating admin user "${ADMIN_USERNAME}"...`);
    await db.insert(users).values({
      username: ADMIN_USERNAME,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("\n⚠️  IMPORTANT: Change the default password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

// Run the seed function
seedAdminUser();
