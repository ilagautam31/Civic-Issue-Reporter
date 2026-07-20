# Civic Issue Reporter

An AI-powered platform for citizens to report local civic issues (potholes, garbage,
broken streetlights, water/sewage problems) with photo + location. An AI layer
automatically categorizes each report and assigns a priority level. Admins get a
dashboard to track and resolve reports.

## Tech Stack
- **Frontend:** React (Vite), Redux Toolkit, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer (image upload)
- **AI:** OpenAI-compatible chat completion API for report classification

## Project Structure
```
civic-reporter/
├── backend/
│   ├── config/db.js          MongoDB connection
│   ├── models/                User, Report schemas
│   ├── controllers/           Business logic
│   ├── routes/                API endpoints
│   ├── middleware/             Auth (JWT), file upload (Multer)
│   ├── utils/aiClassifier.js  AI categorization logic
│   └── server.js              Entry point
└── frontend/
    └── src/
        ├── api/                Axios instance + API call functions
        ├── redux/              Auth + reports state
        ├── pages/              Login, Register, Home, ReportForm, ReportDetail, AdminDashboard
        └── components/        Navbar, ReportCard, RouteGuards
```

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — use a local MongoDB (`mongodb://127.0.0.1:27017/civic-reporter`) or a free
  MongoDB Atlas cluster 
- `JWT_SECRET` — any long random string
- `AI_API_KEY` — get a free/cheap key from https://platform.openai.com (or use
  https://openrouter.ai for free-tier models if you want to avoid billing setup).
  **If you don't set this, the app still works** — it just falls back to a default
  category/priority instead of calling AI. Good for testing the app before you
  get a key.

```bash
npm run dev
```
Backend runs on `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`

<!-- ### 3. Create an admin account
Register normally through the UI, then manually update that user's `role` field to
`"admin"` in MongoDB (using MongoDB Compass or the `mongosh` shell):
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
``` -->

## Deploying 
- **Backend:** Render.com or Railway.app (free tier) — connect your GitHub repo, set env vars
- **Frontend:** Vercel or Netlify (free tier) — connect repo, set `VITE_API_URL` to your
  deployed backend URL
- **Database:** MongoDB Atlas free tier (M0 cluster)

