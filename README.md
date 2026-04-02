# Interview Buddy

![Project: Interview Buddy](https://img.shields.io/badge/Interview%20Buddy-ready-blue)
![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

## Table of Contents

- [What the project does](#what-the-project-does)
- [Why the project is useful](#why-the-project-is-useful)
- [Architecture](#architecture)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend setup](#backend-setup)
  - [Frontend setup](#frontend-setup)
  - [Run the full stack](#run-the-full-stack)
- [API endpoints (summary)](#api-endpoints-summary)
- [Usage examples](#usage-examples)
- [Environment variables](#environment-variables)
- [Where users can get help](#where-users-can-get-help)
- [Who maintains and contributes](#who-maintains-and-contributes)

## What the project does

**Interview Buddy** is a full-stack app (Node.js/Express + React/Vite) that helps candidates generate AI-powered interview reports and customized resume PDFs.

It accepts candidate input (`selfDescription`, `jobDescription`, optional resume PDF upload), calls a generation service via GROQ AI, stores results in MongoDB, and returns structured recommendations.

## Why the project is useful

- AI-backed interview prep based on real candidate data.
- Stores historic reports, so users can track improvements.
- Includes both technical and behavioral question guidance, skill gaps, and a day-by-day plan.
- Generates PDF resumes with Puppeteer from AI-crafted HTML.
- Authentication with JWT cookies and token blacklist for secure limited sessions.

## Architecture

- Backend: `Backend/`
  - Express server in `src/app.js`
  - Auth routes: `src/routes/auth.routes.js`
  - Interview routes: `src/routes/interview.routes.js`
  - Models: `user.model.js`, `interviewReport.model.js`, `blacklist.model.js`
  - AI flow in `src/services/ai.service.js` using `groq-sdk` and `puppeteer`
  - Database in `src/config/database.js` with Mongoose
- Frontend: `Frontend/`
  - React app with Vite
  - Auth flows in `src/features/auth`
  - Interview flows in `src/features/interview`
  - API abstraction via Axios with cookie-based session support

## Getting started

### Prerequisites

- Node.js 18+ (or latest LTS)
- npm 10+ (or yarn)
- MongoDB instance (Atlas or local)
- GROQ API key
- For dev, use two shells (backend and frontend)

### Backend setup

```bash
cd "d:/Interview Buddy/Backend"
npm install
```

Copy `.env` from the sample (if exists) and set values:

```env
PORT=3000
MONGO_URI="<your-mongodb-connection-string>"
JWT_SECRET="<strong-jwt-secret>"
GROQ_API_KEY="<your-groq-api-key>"
FRONTEND_URL="http://localhost:5173"
```

Start the backend:

```bash
npm run dev
```

### Frontend setup

```bash
cd "d:/Interview Buddy/Frontend"
npm install
```

Create `Frontend/.env` (or `.env.local`) with:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

### Run the full stack

1. Start backend (`npm run dev` in `Backend/`).
2. Start frontend (`npm run dev` in `Frontend/`).
3. Open the app at `http://localhost:5173`.

## API endpoints (summary)

### Auth

- `POST /api/auth/register` - Register user (`username`, `email`, `password`). Sets cookie token.
- `POST /api/auth/login` - Login user (`email`, `password`). Sets cookie token.
- `GET /api/auth/logout` - Logout, clear token and blacklist it.
- `GET /api/auth/get-me` - Get current user details (protected).

### Interview

- `POST /api/interview/` - Generate new interview report (protected). Accepts `selfDescription`, `jobDescription`, optional `resume` (PDF file).
- `GET /api/interview/report/:interviewId` - Get report by ID (protected).
- `GET /api/interview/` - List authenticated user reports (protected).
- `POST /api/interview/resume/pdf/:interviewReportId` - Generate resume PDF from report (protected).

## Usage examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"Secret123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Secret123"}' \
  -c cookies.txt
```

### Generate interview report

```bash
curl -X POST http://localhost:3000/api/interview/ \
  -b cookies.txt \
  -F "selfDescription=Experienced node developer" \
  -F "jobDescription=Backend Engineer role" \
  -F "resume=@path/to/resume.pdf"
```

### Fetch report

```bash
curl -X GET http://localhost:3000/api/interview/report/<id> -b cookies.txt
```

### Generate resume PDF

```bash
curl -X POST http://localhost:3000/api/interview/resume/pdf/<id> -b cookies.txt --output resume.pdf
```

## Environment variables

- Backend (`Backend/.env`)
  - `PORT` (default `3000`)
  - `MONGO_URI`
  - `JWT_SECRET`
  - `GROQ_API_KEY`
  - `FRONTEND_URL`

- Frontend (`Frontend/.env`)
  - `VITE_API_BASE_URL` (e.g. `http://localhost:3000`)

## Screenshots

- ![Login screen](docs/screenshots/login.png)
- ![Dashboard](docs/screenshots/dashboard.png)

## Where users can get help

- Project issues: open an issue in the repository.
- Check source code in `Backend/src` and `Frontend/src`.
- Collect debug info: backend server logs, browser dev tools, network.
- For library docs:
  - Express: https://expressjs.com/
  - React (Vite): https://vitejs.dev/guide/
  - Mongoose: https://mongoosejs.com/
  - GROQ SDK: https://groq.dev/docs

## Deployment links

- Frontend: [https://interview-buddy-frontend.onrender.com]
- Backend: [https://interview-buddy-backend-x8cu.onrender.com]

> Note: Deployment may be on a sleep/be idle plan. The first request can take ~60 seconds while the service wakes up.

## Who maintains this project

Maintainer: [Pranjal Verma].

> Personal project for resume/portfolio purposes. Keep deployment concise and this README focused on onboarding/app demonstration.

---

> Note: This README intentionally focuses on quick developer onboarding. Detailed API docs and troubleshooting should live in separate docs/Wiki pages to keep the core README compact.
