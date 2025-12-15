const express = require("express");
const { Client } = require("pg");
const path = require("path");
const simpleGit = require("simple-git");
require("dotenv").config();

const app = express();
const git = simpleGit();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("_site"));

// Database client
let client;

async function connectDB() {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  console.log("✅ Connected to PostgreSQL");
}

// API Routes

// Get all versions
app.get("/api/versions", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM versions ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching versions:", error);
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

// Get latest version
app.get("/api/versions/latest", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM versions ORDER BY created_at DESC LIMIT 1"
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("Error fetching latest version:", error);
    res.status(500).json({ error: "Failed to fetch latest version" });
  }
});

// Get version by ID
app.get("/api/versions/:id", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM versions WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Version not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching version:", error);
    res.status(500).json({ error: "Failed to fetch version" });
  }
});

// Get file content at specific commit
app.get("/api/versions/:commitHash/content", async (req, res) => {
  try {
    const { commitHash } = req.params;
    const fileName = req.query.file || "disruption-os-blueprint.md";

    // Get file content at specific commit
    const content = await git.show([`${commitHash}:${fileName}`]);

    res.json({
      commitHash,
      fileName,
      content,
    });
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Failed to fetch file content" });
  }
});

// Get diff between two commits
app.get("/api/diff/:fromHash/:toHash", async (req, res) => {
  try {
    const { fromHash, toHash } = req.params;
    const fileName = req.query.file || "disruption-os-blueprint.md";

    const diff = await git.diff([`${fromHash}..${toHash}`, "--", fileName]);

    res.json({
      fromHash,
      toHash,
      fileName,
      diff,
    });
  } catch (error) {
    console.error("Error fetching diff:", error);
    res.status(500).json({ error: "Failed to fetch diff" });
  }
});

// Get milestones only
app.get("/api/milestones", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM versions WHERE is_milestone = true ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve 11ty static site for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "_site", "index.html"));
});

// Start server
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Shutting down...");
  if (client) {
    await client.end();
  }
  process.exit(0);
});
