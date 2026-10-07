# 🎓 Scholr — Modern Academic & Student Management Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-scholr--henna.vercel.app-00e599?style=for-the-badge&logo=vercel&logoColor=white)](https://scholr-henna.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Neon_PostgreSQL-00e599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![ORM](https://img.shields.io/badge/Prisma_6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Scholr** is a high-performance, full-stack academic workflow and course management application built for modern students. It helps users manage courses, track assignment deadlines, monitor academic progress, and stay organized through intuitive real-time dashboards.

---

## 🌐 Live Application & Hosting

The application is deployed on **Vercel** with a serverless **Neon PostgreSQL** database:

- **Live Production URL:** [https://scholr-henna.vercel.app](https://scholr-henna.vercel.app)
- **Deployment Platform:** Vercel (Edge & Serverless Functions)
- **Database Host:** Neon PostgreSQL (AWS US-East-2 Ohio)

---

## 🗄️ Database Architecture & Live Query Showcase

Scholr uses a relational **PostgreSQL** schema managed via **Prisma ORM**, hosted on **Neon Serverless PostgreSQL**. The database features relation models (`User`, `Course`, `Assignment`, `Task`, `AuditLog`) with cascading deletes, index optimization, and strict constraint validation.

### Live Neon Database Query Execution & Results

Below are screenshots captured directly from SQL query executions on the live production Neon PostgreSQL database:

#### 1. Course Progress & Student Enrollment Query (`JOIN "Course" & "User"`)
Executes a relational `JOIN` query extracting active course codes, instructors, credit hours, completion percentages, and enrolled student details:

![Database Course Query Results](./ss/database_query_courses.png)

```sql
SELECT c.code, c.name, c.instructor, c.credits, c.progress, u.name AS student
FROM "Course" c
JOIN "User" u ON c."userId" = u.id
ORDER BY c."createdAt" ASC
LIMIT 5;
```

---

#### 2. User Accounts & Role Governance Query (`"User" Table`)
Displays user account IDs, registered emails, assigned roles (`STUDENT`, `ADMIN`), and creation timestamps:

![Database Users Query Results](./ss/database_query_users.png)

```sql
SELECT id, name, email, role, "createdAt"
FROM "User"
ORDER BY "createdAt" ASC
LIMIT 5;
```

---

#### 3. Assignment Priority & Status Tracking Query (`JOIN "Assignment" & "Course"`)
Queries pending and completed academic assignments joined with their parent course codes and priority levels (`HIGH`, `MEDIUM`, `LOW`):

![Database Assignments Query Results](./ss/database_query_assignments.png)

```sql
SELECT a.title, a.priority, a.status, a."dueDate", c.code AS course_code
FROM "Assignment" a
JOIN "Course" c ON a."courseId" = c.id
LIMIT 5;
```

---

## 🚀 Key Features

- 📊 **Interactive Dashboard:** Dynamic cards displaying total enrolled courses, pending deadlines, average progress, and recent academic activities.
- 📚 **Course Management:** Add, edit, and track progress, credits, and instructor contacts across all registered subjects.
- 📝 **Assignment Tracker:** Create assignments linked to specific courses with priority tagging (`HIGH`, `MEDIUM`, `LOW`), due dates, and status toggle.
- 🔐 **Authentication & Security:** Built-in JWT authentication with `bcryptjs` password hashing and HTTP-only cookie management.
- 📧 **Automated Email Notifications:** Integrates `Resend` and `@react-email/components` for academic reminder notifications.
- ⚡ **Responsive Modern UI:** Crafted with Tailwind CSS v4, Lucide icons, glassmorphism aesthetics, and smooth UI transitions.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router, Turbopack) |
| **UI & Styling** | Tailwind CSS v4, Radix UI Primitives, Lucide Icons |
| **State Management** | Zustand |
| **Form Handling** | React Hook Form & Zod Validation |
| **Database** | Neon Serverless PostgreSQL |
| **ORM** | Prisma 6 (`@prisma/client`) |
| **Authentication** | Custom JWT (`jose`) + `bcryptjs` |
| **Email Service** | Resend API & React Email |
| **Hosting & CI/CD** | Vercel Serverless |

---

## 📐 Database Schema Models

```prisma
model User {
  id          String       @id @default(cuid())
  name        String
  email       String       @unique
  password    String
  role        String       @default("STUDENT")
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  courses     Course[]
  assignments Assignment[]
  tasks       Task[]
  auditLogs   AuditLog[]
}

model Course {
  id          String       @id @default(cuid())
  code        String
  name        String
  instructor  String
  credits     Float
  progress    Int          @default(0)
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignments Assignment[]
}

model Assignment {
  id          String   @id @default(cuid())
  title       String
  description String?
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  dueDate     DateTime
  priority    String   @default("MEDIUM")
  status      String   @default("PENDING")
}
```

---

## 💻 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/momojaffer1804/Scholr.git
cd Scholr
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:5432/scholr?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/scholr"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Push Database Schema & Seed Data
```bash
npx prisma db push
npm run db:seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
