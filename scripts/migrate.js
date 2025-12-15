const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL database');

    // Create versions table (WORM storage metadata)
    await client.query(`
      CREATE TABLE IF NOT EXISTS versions (
        id SERIAL PRIMARY KEY,
        commit_hash VARCHAR(40) UNIQUE NOT NULL,
        version_number VARCHAR(50) NOT NULL,
        description TEXT,
        author VARCHAR(255) DEFAULT 'System',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tags TEXT[],
        status VARCHAR(50) DEFAULT 'active',
        is_milestone BOOLEAN DEFAULT false,
        parent_commit_hash VARCHAR(40),
        CONSTRAINT versions_commit_hash_key UNIQUE (commit_hash)
      );
    `);

    console.log('✅ Table "versions" created successfully');

    // Create indexes for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_versions_created_at ON versions(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_versions_status ON versions(status);
      CREATE INDEX IF NOT EXISTS idx_versions_milestone ON versions(is_milestone);
    `);

    console.log('✅ Indexes created successfully');

    // Create view for quick lookups
    await client.query(`
      CREATE OR REPLACE VIEW latest_versions AS
      SELECT * FROM versions
      ORDER BY created_at DESC
      LIMIT 10;
    `);

    console.log('✅ View "latest_versions" created successfully');

    console.log('🎉 Database migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
