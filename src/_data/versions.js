const { Client } = require('pg');
require('dotenv').config();

module.exports = async function () {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT * FROM versions ORDER BY created_at DESC'
    );
    await client.end();
    return result.rows;
  } catch (error) {
    console.warn('⚠️  Could not fetch versions from database. Using empty array.');
    console.warn('   Make sure DATABASE_URL is set and database is migrated.');
    return [];
  }
};
