# ============================================================
# KUBER AGENCIES — ONE-SHOT DEPLOYMENT FIXER
# Run this in PowerShell from inside your project folder
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  KUBER AGENCIES — DEPLOYMENT FIXER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── STEP 1: Confirm we're in the right folder ────────────────
$currentDir = Get-Location
Write-Host "📁 Current folder: $currentDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "Is this your project root (where index.js should live)? (y/n): " -NoNewline
$confirm = Read-Host
if ($confirm -ne 'y') {
    Write-Host "❌ Navigate to your project root first, then re-run." -ForegroundColor Red
    exit 1
}

# ── STEP 2: Create folder structure ─────────────────────────
Write-Host ""
Write-Host "📂 Creating folder structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "config"  | Out-Null
New-Item -ItemType Directory -Force -Path "routes"  | Out-Null
New-Item -ItemType Directory -Force -Path "models"  | Out-Null
New-Item -ItemType Directory -Force -Path "public"  | Out-Null
Write-Host "✅ Folders created" -ForegroundColor Green

# ── STEP 3: Write index.js ───────────────────────────────────
Write-Host "📝 Writing index.js..." -ForegroundColor Yellow
@'
'use strict';

console.log('Starting server...');

const express = require('express');
const dotenv  = require('dotenv');
const path    = require('path');

dotenv.config();

// Safe DB import
let connectDB = null;
try {
  connectDB = require('./config/db');
  console.log('config/db loaded OK');
} catch (e) {
  console.warn('config/db not found - running without DB:', e.message);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Kuber Agencies API is running' });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Safe admin routes import
let adminRoutes = null;
try {
  adminRoutes = require('./routes/admin');
  console.log('routes/admin loaded OK');
} catch (e) {
  console.warn('routes/admin not found - skipping:', e.message);
}
if (adminRoutes) app.use('/admin', adminRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error('Express error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log('==========================================');
  console.log('Server running on port ' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('==========================================');
  if (typeof connectDB === 'function') {
    console.log('Connecting to database...');
    connectDB();
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message || err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message || err);
  server.close(() => process.exit(1));
});
'@ | Set-Content -Path "index.js" -Encoding UTF8
Write-Host "✅ index.js written" -ForegroundColor Green

# ── STEP 4: Write config/db.js ───────────────────────────────
Write-Host "📝 Writing config/db.js..." -ForegroundColor Yellow
@'
'use strict';

const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set - skipping DB connection.');
    console.warn('Add MONGO_URI in Render Dashboard > Environment.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected: ' + conn.connection.host);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Server will keep running without DB.');
    // NO process.exit() - server must stay alive
  }
};

module.exports = connectDB;
'@ | Set-Content -Path "config\db.js" -Encoding UTF8
Write-Host "✅ config/db.js written" -ForegroundColor Green

# ── STEP 5: Write routes/admin.js ────────────────────────────
Write-Host "📝 Writing routes/admin.js..." -ForegroundColor Yellow
@'
'use strict';

const express = require('express');
const router  = express.Router();

router.get('/', (_req, res) => {
  res.json({ page: 'Admin', status: 'ok' });
});

module.exports = router;
'@ | Set-Content -Path "routes\admin.js" -Encoding UTF8
Write-Host "✅ routes/admin.js written" -ForegroundColor Green

# ── STEP 6: Write package.json ───────────────────────────────
Write-Host "📝 Writing package.json..." -ForegroundColor Yellow
@'
{
  "name": "kuber-agencies-web-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev":   "nodemon index.js"
  },
  "engines": {
    "node": "20.x"
  },
  "dependencies": {
    "dotenv":   "^16.4.5",
    "express":  "^4.19.2",
    "mongoose": "^8.4.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
'@ | Set-Content -Path "package.json" -Encoding UTF8
Write-Host "✅ package.json written" -ForegroundColor Green

# ── STEP 7: Write .gitignore ─────────────────────────────────
@'
node_modules/
.env
.env.local
*.log
.DS_Store
Thumbs.db
.vscode/
'@ | Set-Content -Path ".gitignore" -Encoding UTF8

# ── STEP 8: Write .env.example ───────────────────────────────
@'
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.mongodb.net/kuber_agencies
NODE_ENV=development
'@ | Set-Content -Path ".env.example" -Encoding UTF8

# ── STEP 9: Verify all files exist ───────────────────────────
Write-Host ""
Write-Host "🔍 Verifying files..." -ForegroundColor Yellow
$required = @("index.js","package.json",".gitignore","config\db.js","routes\admin.js")
$allGood = $true
foreach ($f in $required) {
    if (Test-Path $f) {
        Write-Host "  ✅ $f" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $f MISSING" -ForegroundColor Red
        $allGood = $false
    }
}

if (-not $allGood) {
    Write-Host ""
    Write-Host "❌ Some files missing. Re-run this script." -ForegroundColor Red
    exit 1
}

# ── STEP 10: Git push ────────────────────────────────────────
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git add .
git status

Write-Host ""
Write-Host "Files staged. Committing..." -ForegroundColor Yellow
git commit -m "fix: add complete working app - index.js, config/db.js, routes/admin.js"

Write-Host ""
Write-Host "Pushing to origin main..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Pushed to GitHub." -ForegroundColor Green
    Write-Host "  Now go to Render and trigger redeploy." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "RENDER SETTINGS TO CONFIRM:" -ForegroundColor Cyan
    Write-Host "  Build Command : npm install" -ForegroundColor White
    Write-Host "  Start Command : node index.js" -ForegroundColor White
    Write-Host "  MONGO_URI     : (paste your Atlas URI)" -ForegroundColor White
    Write-Host "  NODE_ENV      : production" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Git push failed." -ForegroundColor Red
    Write-Host "   Check: are you connected to GitHub? Run: git remote -v" -ForegroundColor Yellow
}
