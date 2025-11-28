import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from '@shared/schema';

function getReplitDatabaseUrl(): string {
  const pgHost = process.env.PGHOST;
  const pgUser = process.env.PGUSER;
  const pgPassword = process.env.PGPASSWORD;
  const pgDatabase = process.env.PGDATABASE;
  const pgPort = process.env.PGPORT || '5432';
  
  if (pgHost && pgUser && pgPassword && pgDatabase) {
    return `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`;
  }
  
  return '';
}

const replitDbUrl = getReplitDatabaseUrl();
const dbUrl = replitDbUrl || process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not set and Replit database credentials not found");
}

const sql = neon(dbUrl);
const db = drizzle(sql, { schema });

async function createTables() {
  try {
    console.log('Creating database tables...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        education TEXT,
        education_grade TEXT,
        grade_type TEXT,
        has_language_test TEXT,
        language_test TEXT,
        ielts_score TEXT,
        course_relevance TEXT,
        course_type TEXT,
        institution_type TEXT,
        gap_years TEXT,
        proof_of_funds TEXT,
        strong_sop TEXT,
        public_university_loa TEXT,
        has_work_experience TEXT,
        work_experience_years TEXT,
        financial_capacity TEXT,
        preferred_intake TEXT,
        preferred_province TEXT,
        eligibility_score INTEGER,
        status TEXT NOT NULL DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

createTables().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((error) => {
  console.error('Failed:', error);
  process.exit(1);
});
