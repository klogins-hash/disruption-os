# Disruption OS - WORM Versioning System 🛡️

A **Write-Once-Read-Many (WORM)** versioning and archival system for the Disruption OS blueprint, built with Git, PostgreSQL, and 11ty.

## 🎯 What This Does

- **Full Snapshots:** Every git commit is a complete, immutable snapshot (WORM storage)
- **Granular Tracking:** Line-by-line change tracking via Git
- **Rich Metadata:** PostgreSQL stores version descriptions, tags, milestones
- **Simple Visualization:** Clean blog-style timeline showing all iterations
- **API Access:** RESTful API for programmatic access to versions
- **Future-Proof:** Ready to integrate AI agents for analysis

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Git (WORM Storage)                      │
│              Immutable commits = Full snapshots             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL (Metadata)                      │
│        Descriptions, Tags, Milestones, Status               │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   11ty      │  │  Express    │  │  Railway    │
│  (Static    │  │   (API)     │  │  (Deploy)   │
│   Site)     │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

## 📦 Tech Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Railway)
- **Frontend:** 11ty (Static Site Generator)
- **Version Control:** Git (WORM storage layer)
- **Hosting:** Railway

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Railway PostgreSQL connection string:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
NODE_ENV=development
```

### 3. Run Database Migration

```bash
npm run db:migrate
```

This creates the `versions` table in PostgreSQL.

### 4. Make Your First Commit

```bash
git add .
git commit -m "Initial version of Disruption OS blueprint"
```

### 5. Create Your First Version

```bash
npm run version:create
```

Follow the prompts to add metadata (version number, description, tags, milestone status).

### 6. Build the Site

```bash
npm run build
```

This generates the static site in the `_site` directory.

### 7. Start the Server

```bash
npm start
```

Visit: **http://localhost:3000**

## 🔄 Workflow: Creating New Versions

Every time you iterate on the Disruption OS blueprint:

1. **Edit the blueprint:**
   ```bash
   # Make changes to disruption-os-blueprint.md
   ```

2. **Commit changes (WORM snapshot):**
   ```bash
   git add disruption-os-blueprint.md
   git commit -m "Added new module: The Defense System"
   ```

3. **Create version metadata:**
   ```bash
   npm run version:create
   ```

4. **Rebuild and deploy:**
   ```bash
   npm run build
   npm start
   ```

   Or on Railway, just push to git and it auto-deploys!

## 📊 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/versions` | List all versions |
| `GET /api/versions/latest` | Get latest version |
| `GET /api/versions/:id` | Get version by ID |
| `GET /api/versions/:commitHash/content` | Get blueprint content at specific commit |
| `GET /api/diff/:fromHash/:toHash` | Get diff between two commits |
| `GET /api/milestones` | List milestone versions only |
| `GET /api/health` | Health check |

## 🌐 Website Pages

- **Timeline (`/`)**: Complete history of all versions
- **Milestones (`/milestones`)**: Key breakthrough iterations
- **Latest (`/latest`)**: Most recent version with content viewer

## 🚂 Railway Deployment

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL database

### Step 2: Connect Your Repo

1. Connect your GitHub repository
2. Railway will auto-detect the Node.js app

### Step 3: Set Environment Variables

In Railway dashboard, add:
- `DATABASE_URL` (auto-populated from PostgreSQL addon)
- `PORT` (Railway auto-sets this)
- `NODE_ENV=production`

### Step 4: Deploy

```bash
git push origin main
```

Railway auto-builds and deploys! 🎉

### Step 5: Run Migration on Railway

In Railway's terminal:
```bash
npm run db:migrate
```

## 🎨 Customization

### Add New Pages

Create `.njk` files in `src/`:
```njk
---
layout: base.njk
title: My Custom Page
---

<h2>Custom Content</h2>
```

### Modify Styling

Edit `src/css/style.css` to customize the look and feel.

### Add New API Endpoints

Edit `server.js` to add new routes.

## 🔮 Future Enhancements (AI Integration)

This system is designed to easily integrate AI agents:

1. **Version Analysis Agent:** Reviews new commits and flags contradictions
2. **Improvement Agent:** Suggests clarity/depth improvements
3. **Validation Agent:** Applies the "Moat Detector" logic to the entire blueprint

To add AI later, simply hook into the PostgreSQL metadata layer or the API endpoints.

## 📁 Project Structure

```
disruption-os/
├── scripts/
│   ├── migrate.js           # Database migration
│   └── create-version.js    # CLI for creating versions
├── src/
│   ├── _data/
│   │   └── versions.js      # Fetch versions from DB for 11ty
│   ├── _layouts/
│   │   └── base.njk         # Base HTML template
│   ├── css/
│   │   └── style.css        # Styling
│   ├── js/
│   │   └── app.js           # Frontend JavaScript
│   ├── index.njk            # Timeline page
│   ├── milestones.njk       # Milestones page
│   └── latest.njk           # Latest version page
├── .eleventy.js             # 11ty configuration
├── server.js                # Express API server
├── package.json             # Dependencies
├── railway.json             # Railway deployment config
├── .env.example             # Environment template
└── README.md                # This file
```

## 🛠️ Development Scripts

```bash
npm run dev          # Run API + 11ty in watch mode
npm run dev:api      # Run API server only
npm run dev:11ty     # Run 11ty only
npm run build        # Build static site
npm start            # Production server
npm run db:migrate   # Run database migration
npm run version:create  # Create new version metadata
```

## ❓ Troubleshooting

### "Cannot connect to database"
- Make sure `.env` has correct `DATABASE_URL`
- Run `npm run db:migrate` to create tables

### "No versions showing"
- Commit changes to git first: `git commit -m "message"`
- Create version metadata: `npm run version:create`
- Rebuild site: `npm run build`

### "Railway deployment fails"
- Check that `DATABASE_URL` is set in Railway dashboard
- Run migration on Railway: `npm run db:migrate`

## 📝 License

MIT

---

Built with ❤️ for iterative, WORM-based project evolution.
