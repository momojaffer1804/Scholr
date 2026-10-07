const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  BorderStyle,
  WidthType,
  AlignmentType,
  ImageRun,
  HeadingLevel,
  PageBreak,
} = require("docx");
const fs = require("fs");
const path = require("path");

const IMG_DIR = path.join(__dirname, "../public/report_screenshots");
let OUTPUT_DOCX = path.join(__dirname, "../Scholr_Assignment_Report.docx");

function readImageBuffer(filename) {
  const filePath = path.join(IMG_DIR, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
}

function createTableHeaderCell(text) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 19, font: "Times New Roman" })],
        alignment: AlignmentType.LEFT,
      }),
    ],
    shading: { fill: "F2F2F2" },
    padding: { top: 100, bottom: 100, left: 150, right: 150 },
  });
}

function createTableCell(text, bold = false) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold, size: 19, font: "Times New Roman" })],
        alignment: AlignmentType.LEFT,
      }),
    ],
    padding: { top: 80, bottom: 80, left: 150, right: 150 },
  });
}

function createStudentHeaderBox() {
  const cellStyle = { top: 100, bottom: 100, left: 150, right: 150 };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Shri Vile Parle Kelavani Mandal's",
                    bold: true,
                    size: 21,
                    font: "Times New Roman",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING",
                    bold: true,
                    size: 25,
                    font: "Times New Roman",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "(Empowered Autonomous College Affiliated to the University of Mumbai)",
                    italics: true,
                    size: 18,
                    font: "Times New Roman",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Academic Year 2026-27",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spaceAfter: 120,
              }),
            ],
            padding: cellStyle,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Name: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "Mohammad Jaffer Hussin            ", size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "SAP ID: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "60017240129", size: 19, font: "Times New Roman" }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Course: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "Programming Laboratory-III (Fullstack Development Using NextJs)", size: 19, font: "Times New Roman" }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Course Code: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "DJS23AMD302L                      ", size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "Roll No: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "A021", size: 19, font: "Times New Roman" }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Year: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "T.Y. B.Tech | ", size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "Department: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "AIML | ", size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "Sem: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "V | ", size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "Batch: ", bold: true, size: 19, font: "Times New Roman" }),
                  new TextRun({ text: "A1-1", size: 19, font: "Times New Roman" }),
                ],
              }),
            ],
            padding: cellStyle,
            shading: { fill: "FAFAFA" },
          }),
        ],
      }),
    ],
  });
}

function p(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: options.size || 21,
        font: "Times New Roman",
        bold: options.bold || false,
        italics: options.italics || false,
      }),
    ],
    alignment: options.alignment || AlignmentType.JUSTIFY,
    spaceAfter: options.spaceAfter || 120,
  });
}

function h1(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        font: "Times New Roman",
      }),
    ],
    heading: HeadingLevel.HEADING_1,
    spaceBefore: 240,
    spaceAfter: 120,
  });
}

function imageParagraph(buffer, width = 480, height = 260) {
  if (!buffer) return [new Paragraph({ text: "" })];
  return [
    new Paragraph({
      children: [
        new ImageRun({
          data: buffer,
          transformation: { width, height },
        }),
      ],
      alignment: AlignmentType.CENTER,
      spaceBefore: 120,
      spaceAfter: 180,
    }),
  ];
}

async function generateDocx() {
  console.log("Reading genuine project screenshots for Word document generation...");
  const imgs = {
    login: readImageBuffer("fig_login.png"),
    dashboard: readImageBuffer("fig_dashboard.png"),
    courses: readImageBuffer("fig_courses.png"),
    assignments: readImageBuffer("fig_assignments.png"),
    tasks: readImageBuffer("fig_tasks.png"),
    calendar: readImageBuffer("fig_calendar.png"),
    analytics: readImageBuffer("fig_analytics.png"),
    lighthouse: readImageBuffer("fig_lighthouse.png"),
    erDiagram: readImageBuffer("fig_er_diagram.png"),
    databaseRecords: readImageBuffer("fig_database_records.png"),
    adminDashboard: readImageBuffer("fig_admin_dashboard.png"),
    adminUsers: readImageBuffer("fig_admin_users.png"),
    adminAudit: readImageBuffer("fig_admin_audit_logs.png"),
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // 1 inch margins
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Page ", font: "Times New Roman", size: 18 }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: 18,
                  }),
                  new TextRun({ text: " of ", font: "Times New Roman", size: 18 }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: "Times New Roman",
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // ASSIGNMENT 1 HEADER
          createStudentHeaderBox(),
          new Paragraph({ spaceAfter: 120 }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ASSIGNMENT 1",
                bold: true,
                size: 32,
                font: "Times New Roman",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spaceAfter: 60,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Responsive Accessible Component Architecture, Client State Management & End-to-End Type-Safe Form Mutations",
                bold: true,
                size: 21,
                font: "Times New Roman",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spaceAfter: 60,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Source Code Repository: ", bold: true, size: 19, font: "Times New Roman" }),
              new TextRun({ text: "https://github.com/momojaffer1804/Scholr", size: 19, font: "Times New Roman" }),
            ],
            alignment: AlignmentType.CENTER,
            spaceAfter: 180,
          }),

          // SECTION 1
          h1("1. Project Introduction"),
          p("Scholr is an academic productivity workspace designed for university students, educators, and academic administrators. The platform consolidates course tracking, assignment submission schedules, task execution, live analytics, role-based administration, and security audit logging into a single responsive web interface."),
          p("The application architecture is developed using Next.js 16.3.6 (App Router), React 19.2.8, Tailwind CSS v4, Zustand 5.0.15, Radix UI accessibility primitives, React Hook Form with Zod validation, Prisma ORM 6.19.3, and Resend / React Email."),

          // TECH STACK TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [createTableHeaderCell("Technology Component"), createTableHeaderCell("Library / Framework"), createTableHeaderCell("Architecture Role")] }),
              new TableRow({ children: [createTableCell("Core Framework"), createTableCell("Next.js 16.3.6 (App Router)"), createTableCell("Server Component rendering & file-system routing")] }),
              new TableRow({ children: [createTableCell("UI & Styling"), createTableCell("React 19 & Tailwind CSS v4"), createTableCell("Component rendering & responsive brutalist styling")] }),
              new TableRow({ children: [createTableCell("Accessible Primitives"), createTableCell("Radix UI / shadcn/ui"), createTableCell("ARIA compliant accessible Dialog, Dropdown & Slot primitives")] }),
              new TableRow({ children: [createTableCell("State Management"), createTableCell("Zustand 5.0.15 (with Persist)"), createTableCell("Decoupled client filter & toast store with LocalStorage sync")] }),
              new TableRow({ children: [createTableCell("Form Mutations"), createTableCell("React Hook Form & Zod"), createTableCell("Type-safe client validation & Server Action execution")] }),
              new TableRow({ children: [createTableCell("Database ORM"), createTableCell("Prisma ORM 6.19.3"), createTableCell("Relational schema modeling & type-safe database queries")] }),
            ],
          }),
          new Paragraph({ spaceAfter: 120 }),

          // SECTION 2
          h1("2. UI and Application Shell"),
          p("The application shell uses Next.js file-system routing and layout hierarchies. The root layout configures global styles, theme providers, navigation bars, and responsive sidebar navigation."),

          ...imageParagraph(imgs.login, 480, 260),

          // SECTION 3
          h1("3. Next.js App Router & Server Components"),
          p("The Next.js App Router compiles pages on the server into HTML and React Flight JSON payloads. React Server Components (RSC) execute exclusively on the server, accessing database models directly via Prisma with zero client JavaScript bundle overhead."),
          p("Client Components ('use client') handle browser-side interactivity, DOM event listeners, state hooks, and Radix accessibility primitives:"),
          p("• Server Components (RSC): app/dashboard/page.tsx, app/courses/page.tsx, and app/assignments/page.tsx query Prisma directly on the server.\n• Client Components: components/ui/button.tsx (Radix Slot + CVA), components/ui/dialog.tsx (Radix Dialog), and AssignmentForm.tsx manage client state and modal dialog overlays."),

          // SECTION 4
          h1("4. State Management with Zustand"),
          p("Scholr utilizes Zustand for decoupled client-side state management. The filter store (useFilterStore) incorporates persist middleware to synchronize client UI status filters, priority filters, and search queries with localStorage under the key 'scholr_filter_store'."),
          p("State persistent storage guarantees that user filter preferences survive browser page refreshes without issuing redundant network requests or cluttering URL parameters."),

          ...imageParagraph(imgs.dashboard, 480, 260),

          // SECTION 5
          h1("5. Forms and Validation"),
          p("Forms achieve end-to-end type safety using React Hook Form, @hookform/resolvers/zod, shared Zod schemas (lib/validations/assignment.ts), and native Next.js Server Actions (createAssignment). Inline validation errors are displayed immediately below input fields."),
          p("Streaming loading UI during asynchronous server transitions is managed using React Suspense boundaries configured in app/dashboard/loading.tsx and app/assignments/loading.tsx."),

          ...imageParagraph(imgs.assignments, 480, 260),

          // SECTION 6
          h1("6. Core Academic UI Modules"),
          ...imageParagraph(imgs.courses, 480, 250),
          ...imageParagraph(imgs.calendar, 480, 250),
          ...imageParagraph(imgs.analytics, 480, 250),

          // SECTION 7
          h1("7. Lighthouse Web Performance Audit"),
          p("An empirical Lighthouse audit was conducted against the running application server (http://localhost:3000/login) using Chrome DevTools Lighthouse v13.5.0. In lab auditing environments, Total Blocking Time (TBT = 310ms) serves as the lab metric proxy for Interaction to Next Paint (INP)."),

          // LIGHTHOUSE TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [createTableHeaderCell("Lighthouse Audit Category"), createTableHeaderCell("Measured Score / Metric"), createTableHeaderCell("Status / Evaluation")] }),
              new TableRow({ children: [createTableCell("Performance Rating"), createTableCell("93 / 100"), createTableCell("Passed (High Performance Engine)")] }),
              new TableRow({ children: [createTableCell("Accessibility Rating"), createTableCell("100 / 100"), createTableCell("Passed (WCAG 2.1 AA Compliant)")] }),
              new TableRow({ children: [createTableCell("Best Practices Rating"), createTableCell("100 / 100"), createTableCell("Passed (Modern Web Standards)")] }),
              new TableRow({ children: [createTableCell("SEO Rating"), createTableCell("100 / 100"), createTableCell("Passed (Search Engine Indexable)")] }),
              new TableRow({ children: [createTableCell("First Contentful Paint (FCP)"), createTableCell("0.8 s"), createTableCell("Fast (< 1.8s)")] }),
              new TableRow({ children: [createTableCell("Largest Contentful Paint (LCP)"), createTableCell("1.6 s"), createTableCell("Good (< 2.5s)")] }),
              new TableRow({ children: [createTableCell("Total Blocking Time (TBT / INP Proxy)"), createTableCell("310 ms"), createTableCell("Acceptable (< 600ms)")] }),
              new TableRow({ children: [createTableCell("Cumulative Layout Shift (CLS)"), createTableCell("0.00"), createTableCell("Perfect (< 0.1)")] }),
              new TableRow({ children: [createTableCell("Speed Index (SI)"), createTableCell("1.4 s"), createTableCell("Fast (< 3.4s)")] }),
            ],
          }),
          new Paragraph({ spaceAfter: 120 }),

          ...imageParagraph(imgs.lighthouse, 480, 260),

          // SECTION 8
          h1("8. Assignment 1 Conclusion"),
          p("Assignment 1 documents the responsive, accessible frontend architecture of Scholr. The implementation combines Next.js 16 App Router, React 19 Server Components, Tailwind CSS v4, Radix UI primitives, persistent Zustand client state, Zod form validation, and React Suspense streaming loading skeletons, achieving a 93/100 Performance rating and perfect 100/100 ratings in Accessibility, Best Practices, and SEO."),

          // =================================================================
          // PAGE BREAK FOR ASSIGNMENT 2
          // =================================================================
          new Paragraph({ children: [new PageBreak()] }),

          // ASSIGNMENT 2 HEADER
          createStudentHeaderBox(),
          new Paragraph({ spaceAfter: 120 }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ASSIGNMENT 2",
                bold: true,
                size: 32,
                font: "Times New Roman",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spaceAfter: 60,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Automated Relational Data Seeding, Transactional Event Notification & Secure Full-Stack Endpoints",
                bold: true,
                size: 21,
                font: "Times New Roman",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spaceAfter: 60,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Source Code Repository: ", bold: true, size: 19, font: "Times New Roman" }),
              new TextRun({ text: "https://github.com/momojaffer1804/Scholr", size: 19, font: "Times New Roman" }),
            ],
            alignment: AlignmentType.CENTER,
            spaceAfter: 180,
          }),

          // SECTION 1
          h1("1. System Architecture Overview"),
          p("Scholr is built around a modular full-stack architecture. Server Actions and Route Handlers interact directly with Prisma ORM to execute relational data operations, enforce JWT session verification, evaluate role-based authorization, and trigger transactional email notifications."),
          p("Conceptual System Data Flow:\nUser Request -> Next.js UI -> Proxy Gate Middleware -> Server Action Handlers -> Prisma ORM -> Relational Database Engine"),

          // SECTION 2
          h1("2. Database Design & Prisma Schema"),
          p("The relational database schema (prisma/schema.prisma) defines 5 core models: User, Course, Assignment, Task, and AuditLog. All foreign key relationships enforce onDelete: Cascade policies."),

          // DATABASE ENTITIES TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [createTableHeaderCell("Entity Model"), createTableHeaderCell("Primary Key"), createTableHeaderCell("Purpose / Stored Information"), createTableHeaderCell("Relational Foreign Keys")] }),
              new TableRow({ children: [createTableCell("User"), createTableCell("id (CUID)"), createTableCell("User account credentials, role (STUDENT/ADMIN)"), createTableCell("One-to-many with Course, Assignment, Task, AuditLog")] }),
              new TableRow({ children: [createTableCell("Course"), createTableCell("id (CUID)"), createTableCell("Academic course code, instructor, credits, progress"), createTableCell("userId -> User.id (Cascade Delete)")] }),
              new TableRow({ children: [createTableCell("Assignment"), createTableCell("id (CUID)"), createTableCell("Assignment title, due date, priority, status"), createTableCell("courseId -> Course.id, userId -> User.id")] }),
              new TableRow({ children: [createTableCell("Task"), createTableCell("id (CUID)"), createTableCell("Academic to-do task title, priority, completion flag"), createTableCell("userId -> User.id (Cascade Delete)")] }),
              new TableRow({ children: [createTableCell("AuditLog"), createTableCell("id (CUID)"), createTableCell("System activity logs, email events, role switches"), createTableCell("userId -> User.id (Optional Cascade)")] }),
            ],
          }),
          new Paragraph({ spaceAfter: 120 }),

          ...imageParagraph(imgs.erDiagram, 480, 260),

          // SECTION 3
          h1("3. CRUD Operations & Database Persistence"),
          p("Server Actions in lib/actions/ handle database mutations cleanly. Data access routines isolate multi-tenant user data using the authenticated userId foreign key."),

          // SECTION 4
          h1("4. Automated Seeding & Test Data Pipeline"),
          p("The CLI setup workflow (npm run db:setup) resets the local database schema, applies Prisma definitions, and programmatically seeds relational records using @faker-js/faker in prisma/seed.ts. Seeded records are inspected live using Prisma Studio (npx prisma studio)."),

          ...imageParagraph(imgs.databaseRecords, 480, 260),

          // SECTION 5
          h1("5. Authentication & Session Control"),
          p("Authentication uses bcryptjs password hashing (10 salt rounds) and 7-day HTTP-only JWT cookies generated via the jose library. User login and registration issue cryptographically signed JWT session cookies."),

          // SECTION 6
          h1("6. Authorization & Role-Based Access Control (RBAC)"),
          p("Server Action authorization guards (requireUser(), requireAdmin()) and proxy middleware (proxy.ts) enforce tenant isolation and role permissions. Users belong to either the STUDENT or ADMIN role."),

          // SECTION 7
          h1("7. Admin System & Audit Logs"),
          p("Administrative users access elevated route handlers to manage user accounts, assign roles, and review security audit log streams recorded in the AuditLog database table."),

          ...imageParagraph(imgs.adminDashboard, 480, 250),
          ...imageParagraph(imgs.adminUsers, 480, 250),

          // SECTION 8
          h1("8. Notification System & Transactional Email"),
          p("The in-app notification dropdown displays urgent submission alerts (OVERDUE, DUE_SOON, COMPLETED). Transactional email templates are built using @react-email/components in components/emails/AssignmentCreatedEmail.tsx and dispatched via the Resend API (lib/email/resend.ts)."),
          p("A Next.js Route Handler at app/api/webhooks/resend/route.ts processes webhook delivery/bounce events (email.delivered, email.bounced) and logs events directly into the AuditLog database table."),

          ...imageParagraph(imgs.adminAudit, 480, 250),

          // SECTION 9
          h1("9. Calendar & Analytics Backend"),
          p("Analytics endpoints aggregate course completion percentages, upcoming assignment deadlines, and task completion metrics directly from Prisma ORM database queries."),

          // SECTION 10
          h1("10. PostgreSQL / Deployment Readiness"),

          // DEPLOYMENT TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [createTableHeaderCell("Infrastructure Component"), createTableHeaderCell("Current Runtime Implementation"), createTableHeaderCell("Prepared Deployment Setup")] }),
              new TableRow({ children: [createTableCell("Database Engine"), createTableCell("Local SQLite (file:./dev.db)"), createTableCell("PostgreSQL (Supabase / Neon Compatible)")] }),
              new TableRow({ children: [createTableCell("Prisma Provider Schema"), createTableCell("prisma/schema.prisma (sqlite)"), createTableCell("prisma/schema.prisma.postgresql")] }),
              new TableRow({ children: [createTableCell("Transactional Email Engine"), createTableCell("React Email Render + Audit Log"), createTableCell("Resend API Key & Production Webhook URL")] }),
            ],
          }),
          new Paragraph({ spaceAfter: 120 }),

          // SECTION 11
          h1("11. Testing & Verification Suite"),

          // VERIFICATION TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [createTableHeaderCell("Verification Suite"), createTableHeaderCell("Terminal Execution Command"), createTableHeaderCell("Verified Result")] }),
              new TableRow({ children: [createTableCell("ESLint Code Quality"), createTableCell("npm run lint"), createTableCell("Passed (0 Critical Errors)")] }),
              new TableRow({ children: [createTableCell("TypeScript Type Check"), createTableCell("npx tsc --noEmit"), createTableCell("Passed (0 Compilation Errors)")] }),
              new TableRow({ children: [createTableCell("Production App Build"), createTableCell("npm run build"), createTableCell("Passed (17 Routes Compiled)")] }),
              new TableRow({ children: [createTableCell("CLI Setup & Database Seed"), createTableCell("npm run db:setup"), createTableCell("Passed (Exit Code 0)")] }),
            ],
          }),
          new Paragraph({ spaceAfter: 120 }),

          // SECTION 12
          h1("12. Assignment 2 Conclusion"),
          p("Assignment 2 documents the backend database, security, and transactional email architecture of Scholr. The implementation includes Prisma ORM relational schema modeling, automated mock data seeding with @faker-js/faker, JWT cookie session control, RBAC authorization guards, transactional email dispatch with React Email and Resend, and webhook event audit logging."),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  try {
    fs.writeFileSync(OUTPUT_DOCX, buffer);
    console.log(`Word document successfully generated at: ${OUTPUT_DOCX}`);
  } catch (err) {
    if (err.code === "EBUSY") {
      console.warn("Target file locked by Word application. Writing to Scholr_Assignment_Report_Updated.docx ...");
      OUTPUT_DOCX = path.join(__dirname, "../Scholr_Assignment_Report_Updated.docx");
      fs.writeFileSync(OUTPUT_DOCX, buffer);
      console.log(`Word document successfully generated at: ${OUTPUT_DOCX}`);
    } else {
      throw err;
    }
  }
}

generateDocx().catch((err) => {
  console.error("Failed to generate Word document:", err);
  process.exit(1);
});
