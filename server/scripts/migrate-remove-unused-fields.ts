import { neon } from '@neondatabase/serverless';

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

async function removeUnusedFields() {
  try {
    console.log('🔄 Removing unused fields from submissions table...');
    
    await sql`
      ALTER TABLE submissions 
      DROP COLUMN IF EXISTS has_work_experience,
      DROP COLUMN IF EXISTS work_experience_years,
      DROP COLUMN IF EXISTS financial_capacity;
    `;
    
    console.log('✅ Successfully removed unused fields!');
    console.log('   - has_work_experience');
    console.log('   - work_experience_years');
    console.log('   - financial_capacity');
  } catch (error) {
    console.error('❌ Error removing fields:', error);
    throw error;
  }
}

removeUnusedFields().then(() => {
  console.log('✅ Migration completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
