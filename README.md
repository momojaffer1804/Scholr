# Scholr

Scholr is a full-stack academic workflow and course management platform. It allows users to track their enrolled courses, manage assignment deadlines, and monitor academic progress through a streamlined interface. The application is designed to provide realtime updates and a secure environment for students to manage their academic data.

## Features

* Dashboard: Overview of courses, pending assignments, and recent academic activity.
* Course Management: Ability to track course progress, credits, and instructor details.
* Assignment Tracker: Prioritizes and tracks deadlines for course-specific assignments.
* Authentication: Secure login system using JWT and encrypted passwords.
* Notifications: Automated email reminders for upcoming deadlines.

## Technology Stack

* Frontend: Next.js 16 (App Router), Tailwind CSS v4, Zustand.
* Backend: Next.js Server Actions and APIs.
* Database: PostgreSQL (Neon Serverless) managed with Prisma ORM.
* Authentication: Custom JWT implementation with bcryptjs.
* Infrastructure: Deployed on Vercel.

## Project Structure

* /app: Next.js application routes, server actions, and API endpoints. 
* /components: Reusable React components and UI elements.
* /lib: Utility functions, database client initialization, and configuration files.
* /prisma: Database schema definitions and Prisma setup files.
* /public: Static assets such as images and fonts.
* /scripts: Automation scripts for database seeding and report generation.

## Local Development Setup

Follow these steps to run the Scholr application on your local machine.

1. Clone the repository:
git clone https://github.com/momojaffer1804/Scholr.git
cd Scholr

2. Install dependencies:
npm install

3. Configure environment variables:
Create a `.env` file in the root directory and add the following configuration:
DATABASE_URL="postgresql://user:password@host:5432/scholr?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/scholr"
JWT_SECRET="your-secret-key"

4. Initialize the database:
npx prisma db push
npm run db:seed

5. Start the development server:
npm run dev

The application will be accessible at http://localhost:3000.

## License

This project is licensed under the MIT License.
