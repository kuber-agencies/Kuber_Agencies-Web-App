# Kuber Agencies Web App

## Local Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

## Deploying to Render

1. Push this repo to GitHub (make sure `config/db.js` is committed)
2. Create a new **Web Service** on Render
3. Set the following Environment Variables in Render Dashboard:
   - `MONGO_URI` → your MongoDB connection string
   - `NODE_ENV` → `production`
4. Set **Start Command** to: `node index.js`
5. Deploy

## Folder Structure

```
Kuber_Agencies-Web-App/
├── index.js          ← Entry point
├── package.json
├── .gitignore
├── .env.example      ← Template (commit this, NOT .env)
├── config/
│   └── db.js         ← Database connection (MUST be committed)
├── routes/
│   └── index.js
├── models/
└── public/
    ├── css/
    └── js/
```
