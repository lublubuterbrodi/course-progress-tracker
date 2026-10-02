# Course Progress Tracker

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

A full-stack web application for creating courses, organizing lessons, and tracking learning progress.

Users can create courses, add lessons, mark lessons as completed, and see their progress update automatically.

## Live Demo

🌐 **[View Live Demo](https://course-progress-demo.vercel.app/)**

> The live demo is a standalone frontend version of the application using mock data and browser `localStorage`.
> The full version in this repository uses an Express REST API, Prisma ORM, PostgreSQL, and Docker.

## Features

- Create and delete courses
- Add and delete lessons
- Mark lessons as completed or incomplete
- Track course progress automatically
- Persistent data storage with PostgreSQL
- Responsive user interface
- REST API for course and lesson management
- Fully containerized development setup with Docker Compose

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM

### Database

- PostgreSQL 16

### Infrastructure

- Docker
- Docker Compose

## Project Structure

```text
course-progress-tracker/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Getting Started

The easiest way to run the project is with Docker Compose.

### Prerequisites

Make sure you have installed:

- Docker
- Docker Compose

You do **not** need to install PostgreSQL locally.

### 1. Clone the repository

```bash
git clone https://github.com/lublubuterbrodi/course-progress-tracker.git
cd course-progress-tracker
```

### 2. Start the application

```bash
docker compose up --build
```

Docker Compose will build and start all required services:

- Frontend
- Backend
- PostgreSQL database

No additional environment configuration is required for the Docker setup.

### 3. Open the application

Frontend:

```text
http://localhost:3000
```

Backend API:

```text
http://localhost:4000
```

PostgreSQL is exposed locally on port `5433`.

### Stop the application

```bash
docker compose down
```

To remove the PostgreSQL volume and reset all stored data:

```bash
docker compose down -v
```

## Docker Setup

The application runs as three Docker services:

```text
frontend
    ↓
backend
    ↓
postgres
```

The backend connects to PostgreSQL through Docker's internal network.

The database configuration used by Docker Compose is:

```text
Database: courses_db
User: postgres
Internal port: 5432
External port: 5433
```

Application data is stored in a named Docker volume, so courses and lessons remain available after containers are restarted.

## API

### Courses

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | `/courses`     | Get all courses |
| POST   | `/courses`     | Create a course |
| DELETE | `/courses/:id` | Delete a course |

### Lessons

| Method | Endpoint                     | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| GET    | `/courses/:courseId/lessons` | Get lessons for a course        |
| POST   | `/courses/:courseId/lessons` | Add a lesson                    |
| PATCH  | `/lessons/:id`               | Update lesson completion status |
| DELETE | `/lessons/:id`               | Delete a lesson                 |

## Progress Calculation

Course progress is calculated from completed lessons:

```text
completed lessons / total lessons × 100
```

For example:

```text
0 / 0 → 0%
1 / 4 → 25%
2 / 4 → 50%
4 / 4 → 100%
```

## Database

The application uses PostgreSQL with a one-to-many relationship between courses and lessons:

```text
Course
  │
  └── has many → Lessons
```

Each course contains:

- ID
- Title
- Description
- Creation date

Each lesson contains:

- ID
- Course ID
- Title
- Completion status
- Creation date

Deleting a course also removes its associated lessons.

## Development

For local development without running the application entirely through Docker:

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

When running the backend outside Docker, configure the required `DATABASE_URL` environment variable for your PostgreSQL instance.

## License

This project is for educational and portfolio purposes.
