-- Disruption OS Versions Table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kqiwewkautzddnotgngn/sql/new

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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_versions_created_at ON versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_versions_status ON versions(status);
CREATE INDEX IF NOT EXISTS idx_versions_milestone ON versions(is_milestone);

-- Create view for quick lookups
CREATE OR REPLACE VIEW latest_versions AS
SELECT * FROM versions
ORDER BY created_at DESC
LIMIT 10;
