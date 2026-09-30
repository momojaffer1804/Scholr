# Scholr

Scholr is a full-stack academic productivity platform for managing courses, assignments, tasks, deadlines, calendars, analytics, notifications, and administrative operations in one application.

## Academic Submission Details

- **Student Name:** Mohammad Jaffer Hussin
- **SAP ID:** 60017240129
- **Roll No:** A021
- **Course:** Programming Laboratory-III (Fullstack Development Using NextJs)
- **Course Code:** DJS23AMD302L
- **Institution:** Dwarkadas J. Sanghvi College of Engineering
- **Department:** Artificial Intelligence and Machine Learning (AIML)
- **Year / Semester / Batch:** T.Y. B.Tech / Semester V / Batch A1-1
- **Academic Year:** 2026-27
- **GitHub Repository:** https://github.com/momojaffer1804/Scholr

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Zustand
- **Backend:** Next.js Server Actions, Prisma ORM
- **Database:** SQLite for local development, PostgreSQL-ready
- **Authentication:** JWT, JOSE, bcryptjs
- **Tools:** ESLint, TypeScript, Git, npm

## Features

- Course, assignment, and task management
- Academic calendar with deadline tracking
- Academic analytics
- In-app deadline notifications
- User authentication and protected routes
- Student/Admin role-based access control
- Admin dashboard and user management
- Audit logging
- Responsive light/dark interface

## Architecture

```
Next.js App
├── UI / React Components
├── Server Actions
├── Authentication & Authorization
├── Prisma ORM
└── Database
    ├── User
    ├── Course
    ├── Assignment
    ├── Task
    └── AuditLog
```

## Getting Started

```bash
git clone https://github.com/momojaffer1804/Scholr.git
cd Scholr
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

The project is prepared for PostgreSQL deployment through Prisma. Production credentials and environment variables should be configured separately and never committed to the repository.
