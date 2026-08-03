# Civic Issue Reporter

An AI-powered platform for citizens to report local civic issues (potholes, garbage,
broken streetlights, water/sewage problems) with photo + location. An AI layer
automatically categorizes each report and assigns a priority level. Admins get a
dashboard to track and resolve reports.

## Tech Stack
- **Frontend:** React (Vite), Redux Toolkit, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer (image upload)
- **AI:** Openrouter/openai-compatible chat completion API for report classification

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


