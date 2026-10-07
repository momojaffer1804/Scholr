/* eslint-disable */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const IMG_DIR = path.join(__dirname, "../public/report_screenshots");
const OUTPUT_PDF = path.join(__dirname, "../Scholr_Assignment_Report.pdf");

function getBase64Image(filename) {
  const filePath = path.join(IMG_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Image file not found: ${filename}`);
    return "";
  }
  const fileBuffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${fileBuffer.toString("base64")}`;
}

async function generateAcademicPDF() {
  console.log("Loading genuine project screenshots for Word-styled PDF embedding...");

  const imgs = {
    login: getBase64Image("fig_login.png"),
    dashboard: getBase64Image("fig_dashboard.png"),
    courses: getBase64Image("fig_courses.png"),
    assignments: getBase64Image("fig_assignments.png"),
    tasks: getBase64Image("fig_tasks.png"),
    calendar: getBase64Image("fig_calendar.png"),
    analytics: getBase64Image("fig_analytics.png"),
    lighthouse: getBase64Image("fig_lighthouse.png"),
    erDiagram: getBase64Image("fig_er_diagram.png"),
    databaseRecords: getBase64Image("fig_database_records.png"),
    adminDashboard: getBase64Image("fig_admin_dashboard.png"),
    adminUsers: getBase64Image("fig_admin_users.png"),
    adminAudit: getBase64Image("fig_admin_audit_logs.png"),
  };

  const studentHeaderHTML = `
  <div class="college-header-box">
    <div class="college-name-top">Shri Vile Parle Kelavani Mandal's</div>
    <div class="college-name-main">DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING</div>
    <div class="college-sub">(Empowered Autonomous College Affiliated to the University of Mumbai)</div>
    <div class="academic-year-text">Academic Year 2026-27</div>
    <hr class="header-hr" />
    <div class="student-info-grid">
      <div><strong>Name:</strong> Mohammad Jaffer Hussin</div>
      <div><strong>SAP ID:</strong> 60017240129</div>
      <div><strong>Course:</strong> Programming Laboratory-III (Fullstack Development Using NextJs)</div>
      <div><strong>Course Code:</strong> DJS23AMD302L</div>
      <div><strong>Year:</strong> T.Y. B.Tech &nbsp;&nbsp;&nbsp;&nbsp; <strong>Department:</strong> AIML &nbsp;&nbsp;&nbsp;&nbsp; <strong>Sem:</strong> V</div>
      <div><strong>Roll No:</strong> A021</div>
      <div><strong>Batch:</strong> A1-1</div>
      <div></div>
    </div>
  </div>
  `;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Scholr — Academic Assignment Report</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111111;
      background-color: #ffffff;
      line-height: 1.4;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    /* College Header Box */
    .college-header-box {
      border: 1.5px solid #000000;
      padding: 10px 14px;
      margin-bottom: 14px;
      background-color: #ffffff;
      text-align: center;
    }

    .college-name-top {
      font-size: 10.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .college-name-main {
      font-size: 13.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .college-sub {
      font-size: 9pt;
      font-style: italic;
      margin-bottom: 4px;
    }

    .academic-year-text {
      font-size: 10pt;
      font-weight: bold;
      margin-bottom: 6px;
    }

    .header-hr {
      border: none;
      border-top: 1.5px solid #000000;
      margin: 6px 0;
    }

    .student-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 18px;
      font-size: 9.5pt;
      text-align: left;
    }

    /* Assignment Banner */
    .assignment-banner {
      text-align: center;
      margin-bottom: 14px;
    }

    .assignment-title-main {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      margin-bottom: 4px;
    }

    .repo-box {
      border: 1px solid #000000;
      background-color: #fbfbfb;
      padding: 4px 10px;
      display: inline-block;
      font-size: 9.5pt;
      margin-bottom: 4px;
    }

    .repo-url {
      font-family: 'Courier New', Courier, monospace;
      font-weight: bold;
      color: #000000;
    }

    .technical-report-subtitle {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* Headings */
    h1 {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1.5px solid #000000;
      padding-bottom: 2px;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 11pt;
      font-weight: bold;
      margin-top: 12px;
      margin-bottom: 4px;
    }

    p {
      margin-top: 0;
      margin-bottom: 6px;
      text-align: justify;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 8px;
      padding-left: 18px;
    }

    li {
      margin-bottom: 2px;
    }

    /* Academic Tables */
    table.academic-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 10px;
      font-size: 9pt;
    }

    table.academic-table th, table.academic-table td {
      border: 1px solid #000000;
      padding: 4px 6px;
      text-align: left;
      vertical-align: top;
    }

    table.academic-table th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 8.5pt;
    }

    code, pre {
      font-family: 'Courier New', Courier, monospace;
      font-size: 8.5pt;
      background-color: #f5f5f5;
    }

    pre {
      border: 1px solid #000000;
      padding: 6px;
      white-space: pre-wrap;
      word-wrap: break-word;
      margin-top: 4px;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .inline-img-container {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 14px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .inline-img {
      max-width: 95%;
      max-height: 310px;
      border: 1px solid #000000;
      display: block;
      margin: 0 auto;
    }
  </style>
</head>
<body>

  <!-- ================================================================= -->
  <!-- ASSIGNMENT 1 — OFFICIAL FULLSTACK NEXTJS SUBMISSION               -->
  <!-- ================================================================= -->

  ${studentHeaderHTML}

  <div class="assignment-banner">
    <div class="assignment-title-main">ASSIGNMENT 1</div>
    <div style="font-size: 10.5pt; font-weight: bold; margin-bottom: 4px;">
      Responsive Accessible Component Architecture, Client State Management & End-to-End Type-Safe Form Mutations
    </div>
    <div class="repo-box">
      <strong>Source Code Repository:</strong> <span class="repo-url">https://github.com/momojaffer1804/Scholr</span>
    </div>
    <div class="technical-report-subtitle">Technical Report</div>
  </div>

  <!-- SECTION 1 -->
  <h1>1. Project Introduction</h1>
  <p>
    <strong>Scholr</strong> is an academic productivity workspace designed for university students, educators, and academic administrators. The workspace consolidates course tracking, assignment submission schedules, task execution, live analytics, role-based administration, and security audit logging into a single responsive web interface.
  </p>
  <p>
    The application architecture is developed using Next.js 16.3.6 (App Router), React 19.2.8, Tailwind CSS v4, Zustand 5.0.15, Radix UI accessibility primitives, React Hook Form with Zod validation, Prisma ORM 6.19.3, and Resend / React Email.
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th>Technology Component</th>
        <th>Library / Framework</th>
        <th>Architecture Role</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Core Framework</td><td>Next.js 16.3.6 (App Router)</td><td>Server Component rendering & file-system routing</td></tr>
      <tr><td>UI & Styling</td><td>React 19 & Tailwind CSS v4</td><td>Component rendering & responsive brutalist styling</td></tr>
      <tr><td>Accessible Primitives</td><td>Radix UI / shadcn/ui</td><td>ARIA compliant accessible Dialog, Dropdown & Slot primitives</td></tr>
      <tr><td>State Management</td><td>Zustand 5.0.15 (with Persist)</td><td>Decoupled client filter & toast store with LocalStorage sync</td></tr>
      <tr><td>Form Mutations</td><td>React Hook Form & Zod</td><td>Type-safe client validation & Server Action execution</td></tr>
      <tr><td>Database ORM</td><td>Prisma ORM 6.19.3</td><td>Relational schema modeling & type-safe database queries</td></tr>
    </tbody>
  </table>

  <!-- SECTION 2 -->
  <h1>2. UI and Application Shell</h1>
  <p>
    The application shell uses Next.js file-system routing and layout hierarchies. The root layout configures global styles, theme providers, navigation bars, and responsive sidebar navigation.
  </p>

  <div class="inline-img-container">
    <img src="${imgs.login}" class="inline-img" alt="Login Screen">
  </div>

  <!-- SECTION 3 -->
  <h1>3. Next.js App Router & Server Components</h1>
  <p>
    The Next.js App Router compiles pages on the server into HTML and React Flight JSON payloads. Server Components (RSC) execute exclusively on the server, accessing database models directly via Prisma with zero client JavaScript bundle overhead.
  </p>
  <p>
    Client Components (<code>"use client"</code>) handle browser-side interactivity, DOM event listeners, state hooks, and Radix accessibility primitives:
  </p>
  <ul>
    <li><strong>Server Components (RSC):</strong> <code>app/dashboard/page.tsx</code>, <code>app/courses/page.tsx</code>, and <code>app/assignments/page.tsx</code> query Prisma directly on the server.</li>
    <li><strong>Client Components:</strong> <code>components/ui/button.tsx</code> (Radix Slot + CVA), <code>components/ui/dialog.tsx</code> (Radix Dialog), and <code>AssignmentForm.tsx</code> manage client state and modal dialog overlays.</li>
  </ul>

  <!-- SECTION 4 -->
  <h1>4. State Management with Zustand</h1>
  <p>
    Scholr utilizes Zustand for decoupled client-side state management. The filter store (<code>useFilterStore</code>) incorporates <code>persist</code> middleware to synchronize client UI status filters, priority filters, and search queries with <code>localStorage</code> under the key <code>"scholr_filter_store"</code>.
  </p>
  <p>
    State persistent storage guarantees that user filter preferences survive browser page refreshes without issuing redundant network requests or cluttering URL parameters.
  </p>

  <div class="inline-img-container">
    <img src="${imgs.dashboard}" class="inline-img" alt="Dashboard View">
  </div>

  <!-- SECTION 5 -->
  <h1>5. Forms and Validation</h1>
  <p>
    Forms achieve end-to-end type safety using React Hook Form, <code>@hookform/resolvers/zod</code>, shared Zod schemas (<code>lib/validations/assignment.ts</code>), and native Next.js Server Actions (<code>createAssignment</code>). Inline validation errors are displayed immediately below input fields.
  </p>
  <p>
    Streaming loading UI during asynchronous server transitions is managed using React Suspense boundaries configured in <code>app/dashboard/loading.tsx</code> and <code>app/assignments/loading.tsx</code>.
  </p>

  <div class="inline-img-container">
    <img src="${imgs.assignments}" class="inline-img" alt="Assignments Form">
  </div>

  <!-- SECTION 6 -->
  <h1>6. Academic Core UI Modules</h1>
  <div class="inline-img-container">
    <img src="${imgs.courses}" class="inline-img" alt="Courses Grid">
  </div>
  <div class="inline-img-container">
    <img src="${imgs.calendar}" class="inline-img" alt="Calendar View">
  </div>
  <div class="inline-img-container">
    <img src="${imgs.analytics}" class="inline-img" alt="Analytics View">
  </div>

  <!-- SECTION 7 -->
  <h1>7. Lighthouse Web Performance Audit</h1>
  <p>
    An empirical Lighthouse audit was conducted against the running application server (<code>http://localhost:3000/login</code>) using Chrome DevTools Lighthouse v13.5.0. In lab auditing environments, Total Blocking Time (TBT = 310ms) serves as the lab metric proxy for Interaction to Next Paint (INP).
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th>Lighthouse Audit Category</th>
        <th>Measured Score / Metric</th>
        <th>Status / Evaluation</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Performance Rating</td><td><strong>93 / 100</strong></td><td>Passed (High Performance Engine)</td></tr>
      <tr><td>Accessibility Rating</td><td><strong>100 / 100</strong></td><td>Passed (WCAG 2.1 AA Compliant)</td></tr>
      <tr><td>Best Practices Rating</td><td><strong>100 / 100</strong></td><td>Passed (Modern Web Standards)</td></tr>
      <tr><td>SEO Rating</td><td><strong>100 / 100</strong></td><td>Passed (Search Engine Indexable)</td></tr>
      <tr><td>First Contentful Paint (FCP)</td><td><strong>0.8 s</strong></td><td>Fast (&lt; 1.8s)</td></tr>
      <tr><td>Largest Contentful Paint (LCP)</td><td><strong>1.6 s</strong></td><td>Good (&lt; 2.5s)</td></tr>
      <tr><td>Total Blocking Time (TBT / INP Proxy)</td><td><strong>310 ms</strong></td><td>Acceptable (&lt; 600ms)</td></tr>
      <tr><td>Cumulative Layout Shift (CLS)</td><td><strong>0.00</strong></td><td>Perfect (&lt; 0.1)</td></tr>
      <tr><td>Speed Index (SI)</td><td><strong>1.4 s</strong></td><td>Fast (&lt; 3.4s)</td></tr>
    </tbody>
  </table>

  <div class="inline-img-container">
    <img src="${imgs.lighthouse}" class="inline-img" alt="Lighthouse Report">
  </div>

  <!-- SECTION 8 -->
  <h1>8. Assignment 1 Conclusion</h1>
  <p>
    Assignment 1 documents the responsive, accessible frontend architecture of Scholr. The implementation combines Next.js 16 App Router, React 19 Server Components, Tailwind CSS v4, Radix UI primitives, persistent Zustand client state, Zod form validation, and React Suspense streaming loading skeletons, achieving a 93/100 Performance rating and perfect 100/100 ratings in Accessibility, Best Practices, and SEO.
  </p>

  <!-- ================================================================= -->
  <!-- CLEAR PAGE BREAK FOR ASSIGNMENT 2                                 -->
  <!-- ================================================================= -->
  <div class="page-break"></div>

  <!-- ================================================================= -->
  <!-- ASSIGNMENT 2 — OFFICIAL FULLSTACK NEXTJS SUBMISSION               -->
  <!-- ================================================================= -->

  ${studentHeaderHTML}

  <div class="assignment-banner">
    <div class="assignment-title-main">ASSIGNMENT 2</div>
    <div style="font-size: 10.5pt; font-weight: bold; margin-bottom: 4px;">
      Automated Relational Data Seeding, Transactional Event Notification & Secure Full-Stack Endpoints
    </div>
    <div class="repo-box">
      <strong>Source Code Repository:</strong> <span class="repo-url">https://github.com/momojaffer1804/Scholr</span>
    </div>
    <div class="technical-report-subtitle">Technical Report</div>
  </div>

  <!-- SECTION 1 -->
  <h1>1. System Architecture Overview</h1>
  <p>
    Scholr is built around a modular full-stack architecture. Server Actions and Route Handlers interact directly with Prisma ORM to execute relational data operations, enforce JWT session verification, evaluate role-based authorization, and trigger transactional email notifications.
  </p>
  <p>
    Conceptual System Data Flow:<br>
    User Request &rarr; Next.js UI &rarr; Proxy Gate Middleware &rarr; Server Action Handlers &rarr; Prisma ORM &rarr; Relational Database Engine
  </p>

  <!-- SECTION 2 -->
  <h1>2. Database Design & Prisma Relational Schema</h1>
  <p>
    The relational database schema (<code>prisma/schema.prisma</code>) defines 5 core models: <code>User</code>, <code>Course</code>, <code>Assignment</code>, <code>Task</code>, and <code>AuditLog</code>. All foreign key relationships enforce <code>onDelete: Cascade</code> policies.
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th>Entity Model</th>
        <th>Primary Key</th>
        <th>Purpose / Stored Information</th>
        <th>Relational Foreign Keys</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>User</td><td>id (CUID)</td><td>User account credentials, role (STUDENT/ADMIN)</td><td>One-to-many with Course, Assignment, Task, AuditLog</td></tr>
      <tr><td>Course</td><td>id (CUID)</td><td>Academic course code, instructor, credits, progress</td><td>userId -&gt; User.id (Cascade Delete)</td></tr>
      <tr><td>Assignment</td><td>id (CUID)</td><td>Assignment title, due date, priority, status</td><td>courseId -&gt; Course.id, userId -&gt; User.id</td></tr>
      <tr><td>Task</td><td>id (CUID)</td><td>Academic to-do task title, priority, completion flag</td><td>userId -&gt; User.id (Cascade Delete)</td></tr>
      <tr><td>AuditLog</td><td>id (CUID)</td><td>System activity logs, email events, role switches</td><td>userId -&gt; User.id (Optional Cascade)</td></tr>
    </tbody>
  </table>

  <div class="inline-img-container">
    <img src="${imgs.erDiagram}" class="inline-img" alt="Prisma ER Diagram">
  </div>

  <!-- SECTION 3 -->
  <h1>3. CRUD Operations & Database Persistence</h1>
  <p>
    Server Actions in <code>lib/actions/</code> handle database mutations cleanly. Data access routines isolate multi-tenant user data using the authenticated <code>userId</code> foreign key.
  </p>

  <!-- SECTION 4 -->
  <h1>4. Automated Seeding Pipeline & Prisma Studio Verification</h1>
  <p>
    The CLI setup workflow (<code>npm run db:setup</code>) resets the local database schema, applies Prisma definitions, and programmatically seeds relational records using <strong>@faker-js/faker</strong> in <code>prisma/seed.ts</code>. Seeded records are inspected live using Prisma Studio (<code>npx prisma studio</code>).
  </p>

  <div class="inline-img-container">
    <img src="${imgs.databaseRecords}" class="inline-img" alt="Prisma Studio Records">
  </div>

  <!-- SECTION 5 -->
  <h1>5. Authentication & Session Control</h1>
  <p>
    Authentication uses bcryptjs password hashing (10 salt rounds) and 7-day HTTP-only JWT cookies generated via the <code>jose</code> library. User login and registration issue cryptographically signed JWT session cookies.
  </p>

  <!-- SECTION 6 -->
  <h1>6. Authorization & Role-Based Access Control (RBAC)</h1>
  <p>
    Server Action authorization guards (<code>requireUser()</code>, <code>requireAdmin()</code>) and proxy middleware (<code>proxy.ts</code>) enforce tenant isolation and role permissions. Users belong to either the <code>STUDENT</code> or <code>ADMIN</code> role.
  </p>

  <!-- SECTION 7 -->
  <h1>7. Admin System & Audit Logs</h1>
  <p>
    Administrative users access elevated route handlers to manage user accounts, assign roles, and review security audit log streams recorded in the <code>AuditLog</code> database table.
  </p>

  <div class="inline-img-container">
    <img src="${imgs.adminDashboard}" class="inline-img" alt="Admin Dashboard">
  </div>
  <div class="inline-img-container">
    <img src="${imgs.adminUsers}" class="inline-img" alt="User Management">
  </div>

  <!-- SECTION 8 -->
  <h1>8. Notification System & Transactional Email</h1>
  <p>
    The in-app notification dropdown displays urgent submission alerts (<code>OVERDUE</code>, <code>DUE_SOON</code>, <code>COMPLETED</code>). Transactional email templates are built using <code>@react-email/components</code> in <code>components/emails/AssignmentCreatedEmail.tsx</code> and dispatched via the Resend API (<code>lib/email/resend.ts</code>).
  </p>
  <p>
    A Next.js Route Handler at <code>app/api/webhooks/resend/route.ts</code> processes webhook delivery/bounce events (<code>email.delivered</code>, <code>email.bounced</code>) and logs events directly into the <code>AuditLog</code> database table.
  </p>

  <div class="inline-img-container">
    <img src="${imgs.adminAudit}" class="inline-img" alt="Audit Logs">
  </div>

  <!-- SECTION 9 -->
  <h1>9. Calendar & Analytics Backend</h1>
  <p>
    Analytics endpoints aggregate course completion percentages, upcoming assignment deadlines, and task completion metrics directly from Prisma ORM database queries.
  </p>

  <!-- SECTION 10 -->
  <h1>10. PostgreSQL / Deployment Readiness</h1>
  <table class="academic-table">
    <thead>
      <tr>
        <th>Infrastructure Component</th>
        <th>Current Runtime Implementation</th>
        <th>Prepared Deployment Setup</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Database Engine</td><td>Local SQLite (file:./dev.db)</td><td>PostgreSQL (Supabase / Neon Compatible)</td></tr>
      <tr><td>Prisma Provider Schema</td><td>prisma/schema.prisma (sqlite)</td><td>prisma/schema.prisma.postgresql</td></tr>
      <tr><td>Transactional Email Engine</td><td>React Email Render + Audit Log</td><td>Resend API Key & Production Webhook URL</td></tr>
    </tbody>
  </table>

  <!-- SECTION 11 -->
  <h1>11. Testing & Verification Suite</h1>
  <table class="academic-table">
    <thead>
      <tr>
        <th>Verification Suite</th>
        <th>Terminal Execution Command</th>
        <th>Verified Result</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>ESLint Code Quality</td><td><code>npm run lint</code></td><td><strong>Passed</strong> (0 Critical Errors)</td></tr>
      <tr><td>TypeScript Type Check</td><td><code>npx tsc --noEmit</code></td><td><strong>Passed (0 Compilation Errors)</strong></td></tr>
      <tr><td>Production App Build</td><td><code>npm run build</code></td><td><strong>Passed (17 Routes Compiled)</strong></td></tr>
      <tr><td>CLI Setup & Database Seed</td><td><code>npm run db:setup</code></td><td><strong>Passed (Exit Code 0)</strong></td></tr>
    </tbody>
  </table>

  <!-- SECTION 12 -->
  <h1>12. Assignment 2 Conclusion</h1>
  <p>
    Assignment 2 documents the backend database, security, and transactional email architecture of Scholr. The implementation includes Prisma ORM relational schema modeling, automated mock data seeding with @faker-js/faker, JWT cookie session control, RBAC authorization guards, transactional email dispatch with React Email and Resend, and webhook event audit logging.
  </p>

</body>
</html>
  `;

  console.log("Launching Puppeteer for Word-styled PDF generation...");
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  console.log("Generating clean Word-styled PDF file without figure captions...");
  await page.pdf({
    path: OUTPUT_PDF,
    format: "A4",
    printBackground: true,
    margin: {
      top: "18mm",
      bottom: "18mm",
      left: "15mm",
      right: "15mm",
    },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-size: 8.5pt; font-family: 'Times New Roman', serif; text-align: center; width: 100%; color: #333333;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${OUTPUT_PDF}`);
}

generateAcademicPDF().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
