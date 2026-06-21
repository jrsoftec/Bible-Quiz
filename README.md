# Bible Quiz

## Overview

Bible Quiz is a full-stack quiz application built with React, FastAPI, and SQLite. It provides:

- User registration and login
- Admin login and question management
- Bulk question uploads
- Image uploads and YouTube video embeds
- Multiple-choice answers
- Per-user scoring and progress tracking

## Repository structure

- `backend/` — FastAPI API, database models, and upload handling with a local SQLite database
- `frontend/` — React/Vite application
- `docker-compose.yml` — SQLite backend service configuration

## Local setup

### Prerequisites

- Docker
- Docker Compose
- Node.js / npm

### Start backend and database

From the project root:

```bash
docker compose up --build
```

Backend API: `http://localhost:8000`

### Install and run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend app: `http://localhost:3000`

### Frontend API config

Create `frontend/.env` or `frontend/.env.local` to override the backend URL if needed:

```env
VITE_API_URL=http://localhost:8000
```

## Admin flow

- Use `/admin-login` to sign in as admin
- Upload questions one-by-one or bulk
- Upload an image file or use a direct image URL
- Add a YouTube URL to display embedded videos in the question view

## User flow

- Register or log in on the main page
- Use `/quiz` to answer questions
- Use `/score` to view total answered, total correct, and accuracy

## Backend routes

- `POST /admin/upload-image` — upload image file as admin
- `POST /admin/questions` — create one question
- `POST /admin/questions/bulk` — create multiple questions
- `GET /questions` — fetch quiz questions for users
- `POST /questions/{question_id}/answer` — submit an answer
- `GET /score` — view user score

## Notes

- Admin credentials are set by environment variables in `docker-compose.yml`
- Uploaded images are served under `/uploads`
- The backend uses a local SQLite database file in Docker
