# 🚀 Render Deployment Fix — Kuber Agencies

## What Was Wrong
The app was exiting early because:
- `app.listen()` was placed AFTER `connectDB()` — if DB failed, server never started
- No fallback if `MONGO_URI` env var was missing
- No global error handlers — any unhandled crash killed the process silently

---

## ✅ Render Dashboard Settings

| Setting           | Value                  |
|-------------------|------------------------|
| **Runtime**       | Node                   |
| **Build Command** | `npm install`          |
| **Start Command** | `node index.js`        |
| **Node Version**  | 18 (set in package.json engines) |

### Environment Variables to Add in Render:
```
MONGO_URI    = mongodb+srv://username:password@cluster.mongodb.net/kuber_agencies
NODE_ENV     = production
```

> ⚠️ Do NOT add PORT — Render sets this automatically. Your code reads it via `process.env.PORT`.

---

## 📁 Correct File Structure

```
Kuber_Agencies-Web-App/
├── index.js          ← Entry point (server starts FIRST, then DB)
├── package.json      ← "start": "node index.js"
├── .gitignore        ← includes .env, NOT config/db.js
├── .env.example      ← template for local dev
├── config/
│   └── db.js         ← MUST be committed (no secrets inside)
└── routes/
    └── index.js
```

---

## 🧪 Test Locally Before Deploying

```bash
# 1. Install dependencies fresh (simulates Render build)
rm -rf node_modules
npm install

# 2. Create your local .env
cp .env.example .env
# Edit .env and add your real MONGO_URI

# 3. Start the server
node index.js

# ✅ You should see:
# Server running on port 10000
# MongoDB Connected: cluster.mongodb.net

# 4. Test the health endpoint
curl http://localhost:10000/health
# Should return: {"status":"healthy"}
```

---

## ✅ What Good Render Logs Look Like

```
==> Running 'node index.js'
✅ Server running on port 10000
🌍 Environment: production
✅ MongoDB Connected: cluster.mongodb.net
==> Your service is live 🎉
```

## ❌ What Bad Logs Look Like (the old problem)

```
==> No open ports detected, continuing to scan...
==> Running 'node index.js'
==> Application exited early
```
This means the process crashed before `app.listen()` was reached.
