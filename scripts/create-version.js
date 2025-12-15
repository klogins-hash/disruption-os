const { Client } = require('pg');
const simpleGit = require('simple-git');
const readline = require('readline');
require('dotenv').config();

const git = simpleGit();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createVersion() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Get current git commit
    const log = await git.log(['-1']);
    const commitHash = log.latest.hash;
    const commitMessage = log.latest.message;

    console.log(`\n📌 Creating version for commit: ${commitHash.substring(0, 7)}`);
    console.log(`   Commit message: ${commitMessage}\n`);

    // Prompt for version details
    const versionNumber = await ask('Version number (e.g., v1.0.0, iteration-1): ');
    const description = await ask('Description (optional, press Enter to use commit message): ');
    const tagsInput = await ask('Tags (comma-separated, optional): ');
    const isMilestone = await ask('Is this a milestone? (y/n): ');

    const tags = tagsInput ? tagsInput.split(',').map((t) => t.trim()) : [];
    const finalDescription = description || commitMessage;

    // Connect to database
    await client.connect();

    // Insert version metadata
    await client.query(
      `INSERT INTO versions (commit_hash, version_number, description, tags, is_milestone)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (commit_hash) DO UPDATE
       SET version_number = $2, description = $3, tags = $4, is_milestone = $5`,
      [commitHash, versionNumber, finalDescription, tags, isMilestone.toLowerCase() === 'y']
    );

    console.log('\n✅ Version created successfully!');
    console.log(`   Hash: ${commitHash}`);
    console.log(`   Version: ${versionNumber}`);
    console.log(`   Milestone: ${isMilestone.toLowerCase() === 'y' ? 'Yes' : 'No'}\n`);
  } catch (error) {
    console.error('❌ Error creating version:', error);
  } finally {
    await client.end();
    rl.close();
  }
}

createVersion();
