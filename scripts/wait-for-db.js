const { Client } = require('pg');
require('dotenv').config();

async function waitForDatabase(maxAttempts = 12, intervalSeconds = 5) {
  console.log('🔍 Checking database availability...\n');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();

      console.log('\n✅ Database is ready!');
      return true;
    } catch (error) {
      await client.end().catch(() => {});

      if (attempt === maxAttempts) {
        console.error(`\n❌ Database not available after ${maxAttempts} attempts`);
        console.error('Error:', error.message);
        return false;
      }

      console.log(`Attempt ${attempt}/${maxAttempts} - Database not ready yet. Retrying in ${intervalSeconds}s...`);
      await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
    }
  }
}

waitForDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
