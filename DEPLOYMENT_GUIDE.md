# Kuber Agencies — Complete Render Deployment Guide

## ✅ Folder Structure (exact)

```
Kuber_Agencies-Web-App/
├── index.js              ← Entry point
├── package.json          ← Node 20 LTS, "start": "node index.js"
├── .gitignore            ← Ignores .env and node_modules ONLY
├── .env.example          ← Template — safe to commit
├── config/
│   └── db.js             ← DB connection — MUST be committed
├── routes/
│   └── index.js
└── models/
    └── .gitkeep
```

---

## 🔧 Render Dashboard Settings

| Setting           | Value                 |
|-------------------|-----------------------|
| Runtime           | Node                  |
| Build Command     | `npm install`         |
| Start Command     | `node index.js`       |
| Node Version      | 20 (via package.json) |

### Environment Variables (add in Render → Environment):

| Key        | Value                                              | Notes                        |
|------------|----------------------------------------------------|------------------------------|
| MONGO_URI  | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | Required for DB              |
| NODE_ENV   | `production`                                       | Optional but recommended     |

> ⛔ Do NOT add PORT manually. Render sets it automatically.
> Your code reads it with `process.env.PORT || 10000`.

### MongoDB Atlas: Whitelist Render's IP
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Choose **"Allow Access from Anywhere"** → `0.0.0.0/0`
4. Save

---

## 📋 Git Commands — Push Everything to GitHub

Run these from inside your project folder:

```bash
# Step 1: Make sure you're in the right folder
cd Kuber_Agencies-Web-App

# Step 2: Check what git is currently tracking
git status

# Step 3: Stage ALL files (including config/db.js)
git add .

# Step 4: Verify config/db.js is staged (must appear in output)
git status
# You should see:    new file: config/db.js

# Step 5: Commit
git commit -m "fix: complete render deployment fix - add config/db.js, fix port binding"

# Step 6: Push to GitHub
git push origin main
# (use 'master' instead of 'main' if that's your branch name)

# Step 7: Confirm file is in GitHub
git ls-files | grep "config/db"
# Must output:   config/db.js
# If blank → file was not staged — run git add config/db.js again
```

---

## 🧪 Local Test (Run Before Every Deploy)

```bash
# 1. Simulate a clean Render build
rm -rf node_modules
npm install

# 2. Create .env from template
cp .env.example .env
# Edit .env and fill in your real MONGO_URI

# 3. Start the server
node index.js
```

### ✅ Expected Output:
```
==============================================
✅  Server running on port 10000
🌍  Environment : development
==============================================
✅  MongoDB connected → cluster0.mongodb.net
```

### ❌ If You See This (Old Broken State):
```
==> No open ports detected, continuing to scan...
==> Application exited early
```
→ Means server crashed before `app.listen()` ran. Check the lines above it for the real error.

---

## 🔍 Root Cause Summary

| Error                            | Cause                                               | Fix Applied                          |
|----------------------------------|-----------------------------------------------------|--------------------------------------|
| `Cannot find module './config/db'` | File not committed to GitHub (gitignored or never added) | Committed `config/db.js` explicitly |
| `Application exited early`       | DB connect failed BEFORE `app.listen()` was called  | Server starts first, DB connects after |
| `No open ports detected`         | Process exited before binding to `process.env.PORT` | `app.listen(process.env.PORT \|\| 10000)` runs unconditionally |
| Silent crashes                   | No `unhandledRejection` / `uncaughtException` handlers | Added both process-level handlers |

---

## ✅ Successful Render Deploy Logs (What You'll See After Fix)

```
==> Cloning from https://github.com/yourname/Kuber_Agencies-Web-App
==> Running build command 'npm install'
    added 120 packages in 3s
==> Running 'node index.js'
    ✅  Server running on port 10000
    🌍  Environment : production
    ✅  MongoDB connected → cluster0.mongodb.net
==> Your service is live 🎉
```
