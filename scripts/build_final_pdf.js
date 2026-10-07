const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Screenshot paths
const BRAIN = "C:/Users/Admin/.gemini/antigravity/brain/d08a12e8-3468-45b5-9c0c-342aeb81e964";
const screenshots = {
  login: path.join(BRAIN, "scholr_login_page_1790193958551.png"),
  dashboard: path.join(BRAIN, "scholr_dashboard_1790194007423.png"),
  courses: path.join(BRAIN, "scholr_courses_1790194019624.png"),
  assignments: path.join(BRAIN, "scholr_assignments_1790194026720.png"),
  tasks: path.join(BRAIN, "scholr_tasks_1790194033952.png"),
  calendar: path.join(BRAIN, "scholr_calendar_1790194044445.png"),
  analytics: path.join(BRAIN, "scholr_analytics_1790194051003.png"),
  adminDash: path.join(BRAIN, "scholr_admin_dashboard_1790194178989.png"),
  adminUsers: path.join(BRAIN, "scholr_admin_users_1790194185380.png"),
  adminAudit: path.join(BRAIN, "scholr_admin_audit_logs_1790194193167.png"),
  signup: path.join(BRAIN, "scholr_signup_page_1790194219289.png"),
  lighthouse: path.join(BRAIN, "lighthouse_report_scores_1790195167635.png"),
};

function imgTag(key, caption, w) {
  const p = screenshots[key];
  if (!fs.existsSync(p)) return `<p style="color:red;">[Screenshot not found: ${key}]</p>`;
  const b64 = fs.readFileSync(p).toString("base64");
  const width = w || "100%";
  return `<div class="figure"><img src="data:image/png;base64,${b64}" style="width:${width}; border:1px solid #ccc;" /><p class="caption">Figure: ${caption}</p></div>`;
}

const COLLEGE_HEADER = `
<div class="college-header">
  <p class="college-line">Shri Vile Parle Kelavani Mandal's</p>
  <p class="college-name">DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING</p>
  <p class="college-sub">(Empowered Autonomous College Affiliated to the University of Mumbai)</p>
  <p class="academic-year">Academic Year 2026-27</p>
  <hr class="header-rule" />
  <table class="student-table">
    <tr><td><b>Name:</b> Mohammad Jaffer Hussin</td><td style="text-align:right;"><b>SAP ID:</b> 60017240129</td></tr>
    <tr><td><b>Course:</b> Programming Laboratory-III (Fullstack Development Using NextJs)</td><td style="text-align:right;"><b>Course Code:</b> DJS23AMD302L</td></tr>
    <tr><td><b>Year:</b> T.Y. B.Tech &nbsp;&nbsp;&nbsp; <b>Department:</b> AIML &nbsp;&nbsp;&nbsp; <b>Sem:</b> V</td><td style="text-align:right;"><b>Roll No:</b> A021</td></tr>
    <tr><td><b>Batch:</b> A1-1</td><td></td></tr>
  </table>
  <hr class="header-rule" />
</div>
`;

const CSS = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
  @page { size: A4; margin: 20mm 18mm 20mm 18mm; }
  @page { @bottom-center { content: counter(page); font-size: 10px; color: #888; } }
  * { box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; font-size: 11.5px; line-height: 1.65; color: #1a1a1a; margin: 0; padding: 0; }
  h1 { font-family: 'Playfair Display', serif; font-size: 26px; margin: 0 0 6px; }
  h2 { font-size: 18px; font-weight: 700; border-bottom: 2px solid #333; padding-bottom: 4px; margin: 28px 0 10px; }
  h3 { font-size: 14px; font-weight: 600; margin: 18px 0 6px; color: #222; }
  h4 { font-size: 12px; font-weight: 600; margin: 12px 0 4px; }
  p { margin: 6px 0; }
  ul, ol { margin: 4px 0 8px 18px; }
  li { margin-bottom: 3px; }
  table.data-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
  table.data-table th, table.data-table td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
  table.data-table th { background: #f4f4f4; font-weight: 600; }
  code { background: #f5f5f5; padding: 1px 4px; border-radius: 3px; font-size: 10.5px; font-family: 'Consolas', monospace; }
  pre { background: #f8f8f8; border: 1px solid #e0e0e0; padding: 10px; font-size: 10px; overflow-x: auto; border-radius: 4px; font-family: 'Consolas', monospace; line-height: 1.5; }
  .figure { margin: 14px 0; text-align: center; }
  .figure img { max-width: 100%; border-radius: 4px; }
  .caption { font-size: 10px; color: #666; font-style: italic; margin-top: 4px; }
  .page-break { page-break-before: always; }
  .college-header { text-align: center; margin-bottom: 18px; }
  .college-line { font-size: 12px; margin: 0; }
  .college-name { font-size: 16px; font-weight: 700; margin: 2px 0; }
  .college-sub { font-size: 10.5px; margin: 0 0 4px; color: #444; }
  .academic-year { font-size: 12px; font-weight: 600; margin: 6px 0; }
  .header-rule { border: none; border-top: 1.5px solid #333; margin: 8px 0; }
  .student-table { width: 100%; font-size: 11px; margin: 6px 0; border: none; }
  .student-table td { border: none; padding: 2px 0; vertical-align: top; }
  .assignment-title { font-family: 'Playfair Display', serif; font-size: 28px; text-align: center; margin: 14px 0 4px; }
  .repo-line { text-align: center; font-size: 11px; margin: 4px 0 18px; }
  .repo-line a { color: #6d28d9; }
  .highlight-box { background: #faf5ff; border-left: 3px solid #7c3aed; padding: 8px 12px; margin: 10px 0; font-size: 11px; }
</style>
`;

// ========== ASSIGNMENT 1 HTML ==========
const assignment1HTML = `
${COLLEGE_HEADER}
<p class="assignment-title">Assignment 1</p>
<p class="repo-line"><b>Source Code Repository</b><br/>GitHub: <a href="https://github.com/momojaffer1804/Scholr">https://github.com/momojaffer1804/Scholr</a></p>

<h2>1. Project Introduction</h2>
<h3>1.1 What is Scholr?</h3>
<p>Scholr is a full-stack academic productivity workspace built with Next.js 16, React 19, Prisma ORM, and Zustand. It helps students manage courses, assignments, tasks, deadlines, and academic analytics in a single, unified platform.</p>

<h3>1.2 Problem Being Solved</h3>
<p>Students typically juggle multiple tools for tracking assignments, managing courses, and monitoring academic progress. Scholr consolidates these needs into a single brutalist/editorial-styled web application with real-time deadline tracking, calendar views, notification systems, and analytical insights.</p>

<h3>1.3 Main Objectives</h3>
<ul>
  <li>Provide a unified dashboard for academic progress and upcoming deadlines</li>
  <li>Enable CRUD operations for courses, assignments, and tasks</li>
  <li>Implement authentication with role-based access control (STUDENT/ADMIN)</li>
  <li>Deliver real-time notifications for overdue and upcoming deadlines</li>
  <li>Offer calendar and analytics views for data-driven academic planning</li>
  <li>Build an admin control center for user and audit log management</li>
</ul>

<h3>1.4 Technologies Used</h3>
<table class="data-table">
  <tr><th>Technology</th><th>Purpose</th><th>Version</th></tr>
  <tr><td>Next.js (App Router)</td><td>Full-stack React framework</td><td>16.3.6</td></tr>
  <tr><td>React</td><td>UI library</td><td>19.2.8</td></tr>
  <tr><td>Prisma ORM</td><td>Database access layer</td><td>6.19.3</td></tr>
  <tr><td>SQLite / PostgreSQL</td><td>Database (dev / production)</td><td>—</td></tr>
  <tr><td>Zustand</td><td>Client-side state management</td><td>5.0.15</td></tr>
  <tr><td>Tailwind CSS v4</td><td>Utility-first CSS framework</td><td>4.x</td></tr>
  <tr><td>bcryptjs</td><td>Password hashing</td><td>3.0.3</td></tr>
  <tr><td>jose</td><td>JWT session management</td><td>6.2.12</td></tr>
  <tr><td>Lucide React</td><td>Icon library</td><td>1.47.0</td></tr>
  <tr><td>next-themes</td><td>Light/dark theme support</td><td>0.4.6</td></tr>
  <tr><td>TypeScript</td><td>Type safety</td><td>5.x</td></tr>
</table>

<h2>2. UI and Application Shell</h2>
<h3>2.1 Next.js App Router Architecture</h3>
<p>Scholr uses the Next.js App Router with file-based routing. The application layout is defined in <code>app/layout.tsx</code> as an async Server Component that fetches the session user before rendering.</p>
<pre>// app/layout.tsx (Root Layout — Server Component)
export default async function RootLayout({ children }) {
  const user = await getSessionUser();
  return (
    &lt;html lang="en" className={playfair.variable}&gt;
      &lt;body&gt;
        &lt;ThemeProvider&gt;
          &lt;AppSidebar user={user} /&gt;
          &lt;main&gt;{children}&lt;/main&gt;
          &lt;ToastContainer /&gt;
        &lt;/ThemeProvider&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</pre>

<h3>2.2 Sidebar Navigation</h3>
<p>The <code>AppSidebar</code> is a Client Component providing navigation to Dashboard, Courses, Assignments, Tasks, Calendar, and Analytics. For ADMIN users, additional links to Admin Dashboard, Users, and Audit Logs are shown. The sidebar is responsive with a mobile drawer that slides in from the left.</p>
${imgTag("dashboard", "Scholr Dashboard with sidebar navigation, stats overview, today's focus, and upcoming deadlines")}

<h3>2.3 Responsive Design</h3>
<p>The layout uses <code>flex-col md:flex-row</code> to switch between stacked (mobile) and side-by-side (desktop) layouts. The sidebar is hidden off-screen on mobile using <code>-translate-x-full</code> and revealed via a hamburger menu toggle.</p>

<h3>2.4 Light/Dark Theme</h3>
<p>Theme support is implemented via <code>next-themes</code> with a <code>ThemeProvider</code> wrapper. The <code>ThemeToggle</code> component allows users to switch between Light, Dark, and System modes. The toggle is placed in the sidebar footer and uses Tailwind's <code>dark:</code> variant classes throughout.</p>

<h3>2.5 Typography and Visual Design</h3>
<p>Scholr uses a brutalist/editorial visual design language:</p>
<ul>
  <li><b>Playfair Display</b> (serif) for headings — loaded via <code>next/font/google</code> with swap display</li>
  <li><b>Helvetica / system sans-serif</b> for body text</li>
  <li>Monospace font (<code>font-mono</code>) for labels and status badges</li>
  <li>Uppercase tracking (<code>tracking-wider</code>, <code>tracking-widest</code>) for navigation items</li>
  <li>Sharp borders (no rounded corners), minimal shadows, purple accent colour</li>
  <li>Custom thin scrollbars via CSS pseudo-element styling</li>
</ul>

<h2>3. React Server Components vs Client Components</h2>
<h3>3.1 Server Components in Scholr</h3>
<p>By default, all page-level components in Scholr are React Server Components (RSC). These run on the server and can directly query the database via Prisma:</p>
<table class="data-table">
  <tr><th>File</th><th>Type</th><th>Reason</th></tr>
  <tr><td><code>app/layout.tsx</code></td><td>Server</td><td>Fetches session user from cookies before render</td></tr>
  <tr><td><code>app/dashboard/page.tsx</code></td><td>Server</td><td>Calls <code>getDashboardData()</code> server action for stats</td></tr>
  <tr><td><code>app/admin/page.tsx</code></td><td>Server</td><td>Calls <code>getAdminStats()</code> with <code>requireAdmin()</code></td></tr>
  <tr><td><code>app/page.tsx</code></td><td>Server</td><td>Redirects to <code>/dashboard</code></td></tr>
</table>

<h3>3.2 Client Components in Scholr</h3>
<p>Components requiring interactivity, browser APIs, or hooks are marked with <code>"use client"</code>:</p>
<table class="data-table">
  <tr><th>Component</th><th>Reason for Client Rendering</th></tr>
  <tr><td><code>AppSidebar.tsx</code></td><td>Uses <code>usePathname()</code>, <code>useState</code> for mobile toggle</td></tr>
  <tr><td><code>NotificationMenu.tsx</code></td><td>Uses <code>useState</code>, <code>useEffect</code>, <code>localStorage</code></td></tr>
  <tr><td><code>ThemeToggle.tsx</code></td><td>Uses <code>useTheme()</code> from next-themes</td></tr>
  <tr><td><code>ToastContainer.tsx</code></td><td>Uses Zustand store subscription</td></tr>
  <tr><td><code>LoginPage / SignupPage</code></td><td>Form state, <code>useRouter</code>, event handlers</td></tr>
  <tr><td><code>AssignmentList.tsx</code></td><td>Client-side filtering, modals, form submissions</td></tr>
  <tr><td><code>TaskList.tsx</code></td><td>Toggle completion, inline editing, search</td></tr>
  <tr><td><code>CourseList.tsx</code></td><td>Search, create/delete modals</td></tr>
  <tr><td><code>AcademicCalendar.tsx</code></td><td>Month navigation, event rendering</td></tr>
  <tr><td><code>AcademicAnalyticsView.tsx</code></td><td>Receives data as props, renders charts</td></tr>
</table>

<h3>3.3 Hydration Pattern</h3>
<p>Scholr follows the recommended pattern: Server Components fetch data and pass it to Client Components as props. For example, <code>DashboardPage</code> (server) fetches data and passes it to <code>DashboardView</code> (client). This avoids client-side data fetching waterfalls.</p>

<h2>4. State Management</h2>
<h3>4.1 Zustand Stores</h3>
<p>Scholr uses two Zustand stores for client-side state:</p>

<h4>useFilterStore</h4>
<p>Manages filter and search state for assignments, tasks, and courses:</p>
<ul>
  <li>Assignment filters: status (ALL/PENDING/COMPLETED), priority, courseId, sortBy, search</li>
  <li>Task filters: filter, priority, sortBy, search</li>
  <li>Course search query</li>
  <li>Reset actions for clearing filters</li>
</ul>
<pre>// lib/store/useFilterStore.ts
export const useFilterStore = create&lt;FilterState&gt;((set) => ({
  assignmentStatus: "ALL",
  assignmentPriority: "ALL",
  assignmentSearch: "",
  setAssignmentStatus: (status) => set({ assignmentStatus: status }),
  resetAssignmentFilters: () => set({ assignmentStatus: "ALL", ... }),
  // ... task and course filters
}));</pre>

<h4>useToastStore</h4>
<p>Manages toast notification messages with auto-dismiss (4s timeout):</p>
<pre>// lib/store/useToastStore.ts
export const useToastStore = create&lt;ToastState&gt;((set) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => { /* remove toast */ }, 4000);
  },
}));</pre>

<h3>4.2 Why Zustand?</h3>
<p>Zustand was chosen over React Context for its minimal boilerplate, no provider nesting, selector-based re-rendering, and compatibility with Next.js App Router (no need for a client-side context provider wrapping the whole app).</p>

<h2>5. Forms and Validation</h2>
<h3>5.1 Form Handling Approach</h3>
<p>Scholr uses controlled React form components with <code>useState</code> for form state. Forms call Next.js Server Actions for submission:</p>
${imgTag("login", "Scholr Login Page — editorial style form with email/password fields and demo credentials")}

<h3>5.2 Server Actions for Form Submission</h3>
<p>All form submissions go through Server Actions marked with <code>"use server"</code>. These actions perform validation, database operations, and return success/error responses:</p>
<pre>// lib/actions/auth.ts
"use server";
export async function loginAction(data) {
  if (!email || !password) return { error: "Email and password are required." };
  const user = await prisma.user.findUnique({ where: { email } });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return { error: "Invalid email or password." };
  await createSession({ id: user.id, email, name: user.name, role: user.role });
  return { success: true };
}</pre>

<h3>5.3 Validation</h3>
<p>Validation is implemented at two levels:</p>
<ul>
  <li><b>Client-side:</b> HTML5 <code>required</code> attributes, length checks, password confirmation matching</li>
  <li><b>Server-side:</b> All Server Actions validate input before database operations (empty checks, date parsing, ownership verification). Invalid inputs return <code>{ error: "..." }</code> responses.</li>
</ul>

<h3>5.4 Error and Loading States</h3>
<p>Forms use <code>isSubmitting</code> state to disable the submit button and show loading text (e.g., "Authenticating...", "Creating Account..."). Errors are displayed as styled alert banners above the form.</p>
${imgTag("signup", "Scholr Signup Page — name, email, password, confirm password fields with validation")}

<h2>6. Academic Dashboard and Core UI</h2>
<h3>6.1 Dashboard</h3>
<p>The dashboard displays a greeting, academic overview stats (Active Courses, Pending Assignments, Completed Assignments), Today's Focus tasks, Upcoming Deadlines with course codes and priority badges, and an Academic Progress Summary showing course completion bars.</p>
${imgTag("dashboard", "Scholr Dashboard — academic overview, today's focus, upcoming deadlines, and course progress")}

<h3>6.2 Courses</h3>
<p>The courses page shows enrolled modules in a card grid. Each card displays course code, name, instructor, credits, progress bar, and assignment count. Courses can be searched, created, and deleted.</p>
${imgTag("courses", "Courses Page — enrolled modules with progress bars, search, and Add Course action")}

<h3>6.3 Assignments</h3>
<p>The assignments page provides a full-featured list with status/priority/course filters, search, and sort options. Each assignment shows course association, due date, priority badge, and edit/delete actions. Completed assignments show strikethrough text.</p>
${imgTag("assignments", "Assignments Page — filtered list with status tabs, priority badges, and CRUD actions")}

<h3>6.4 Tasks</h3>
<p>Tasks are personal checklist items with priority levels and optional due dates. The UI supports completion toggling, inline editing, filtering by status/priority, and search.</p>
${imgTag("tasks", "Tasks Page — checklist items with priority badges, completion toggles, and filters")}

<h3>6.5 Calendar</h3>
<p>A full month/week calendar view showing assignments and tasks as colour-coded events. Events are positioned on their due dates with course code labels. Navigation supports previous/next month with a Today button.</p>
${imgTag("calendar", "Academic Calendar — month view with assignment and task events on due dates")}

<h3>6.6 Analytics</h3>
<p>The analytics page shows computed metrics: coursework completion rate, active courses count, overdue deadlines, and task completion percentage. It includes an assignment status breakdown and course progress comparison bars.</p>
${imgTag("analytics", "Academic Analytics — completion rates, status breakdown, and course progress comparison")}

<h2>7. Lighthouse / Web Performance</h2>
<h3>7.1 Audit Methodology</h3>
<p>A Lighthouse audit was run on the live Scholr application at <code>http://localhost:3000/login</code> using Puppeteer with headless Chrome. The audit tested Performance, Accessibility, Best Practices, and SEO categories.</p>

<h3>7.2 Lighthouse Scores</h3>
<table class="data-table">
  <tr><th>Category</th><th>Score</th><th>Rating</th></tr>
  <tr><td>Performance</td><td><b>87</b></td><td>Good (orange)</td></tr>
  <tr><td>Accessibility</td><td><b>100</b></td><td>Excellent (green)</td></tr>
  <tr><td>Best Practices</td><td><b>100</b></td><td>Excellent (green)</td></tr>
  <tr><td>SEO</td><td><b>100</b></td><td>Excellent (green)</td></tr>
</table>

<h3>7.3 Core Web Vitals</h3>
<table class="data-table">
  <tr><th>Metric</th><th>Value</th><th>Status</th></tr>
  <tr><td>First Contentful Paint (FCP)</td><td>0.8 s</td><td>Good</td></tr>
  <tr><td>Largest Contentful Paint (LCP)</td><td>2.4 s</td><td>Good</td></tr>
  <tr><td>Total Blocking Time (TBT)</td><td>440 ms</td><td>Needs improvement</td></tr>
  <tr><td>Cumulative Layout Shift (CLS)</td><td>0</td><td>Excellent</td></tr>
  <tr><td>Speed Index (SI)</td><td>0.8 s</td><td>Good</td></tr>
</table>

${imgTag("lighthouse", "Lighthouse Audit Results — Performance 87, Accessibility 100, Best Practices 100, SEO 100")}

<h3>7.4 Key Findings</h3>
<ul>
  <li><b>Accessibility (100):</b> All interactive elements have proper ARIA labels, semantic HTML is used throughout (nav, main, aside), proper heading hierarchy, and sufficient colour contrast.</li>
  <li><b>SEO (100):</b> Meta title and description set in root layout metadata, proper lang attribute, valid link elements.</li>
  <li><b>Best Practices (100):</b> HTTPS-ready cookies (secure flag in production), no deprecated APIs, proper image handling.</li>
  <li><b>Performance (87):</b> FCP and SI are fast (0.8s). LCP is acceptable (2.4s). TBT at 440ms is the main area for improvement, primarily due to JavaScript bundle hydration for client components. CLS of 0 indicates no layout shift.</li>
</ul>

<h2>8. Assignment 1 Conclusion</h2>
<p>Assignment 1 demonstrates a complete frontend implementation for the Scholr academic workspace. The UI is built with Next.js 16 App Router using a hybrid of React Server Components for data fetching and Client Components for interactivity. The brutalist/editorial design system uses Playfair Display typography, purple accent colours, and sharp geometric elements. Zustand manages client-side filter and toast state without Context provider overhead. All form submissions use Server Actions with dual-layer validation. The Lighthouse audit confirms strong web performance with perfect scores in Accessibility, Best Practices, and SEO, and a good Performance score of 87 with excellent Core Web Vitals (FCP 0.8s, CLS 0).</p>
`;

// ========== ASSIGNMENT 2 HTML ==========
const assignment2HTML = `
${COLLEGE_HEADER}
<p class="assignment-title">Assignment 2</p>
<p class="repo-line"><b>Source Code Repository</b><br/>GitHub: <a href="https://github.com/momojaffer1804/Scholr">https://github.com/momojaffer1804/Scholr</a></p>

<h2>1. System Architecture</h2>
<h3>1.1 Overall Architecture</h3>
<p>Scholr follows a monolithic full-stack architecture using Next.js App Router. All frontend rendering, API logic, and database access are handled within a single Next.js application:</p>
<div class="highlight-box">
  <b>Client (Browser)</b> → React Components (RSC + Client) → <b>Next.js Server Actions</b> → <b>Prisma ORM</b> → <b>SQLite/PostgreSQL Database</b><br/>
  <b>Authentication:</b> JWT tokens via <code>jose</code> stored in HTTP-only cookies → Session verification per request
</div>

<h3>1.2 Data Flow</h3>
<ol>
  <li>User interacts with a Client Component (e.g., submits a form)</li>
  <li>Client Component calls a Server Action function (marked <code>"use server"</code>)</li>
  <li>Server Action validates input, checks authentication via <code>requireUser()</code> or <code>requireAdmin()</code></li>
  <li>Prisma ORM executes the database query with user-scoped <code>where</code> clauses</li>
  <li>Server Action logs an audit event and calls <code>revalidatePath()</code></li>
  <li>Next.js re-renders affected Server Components with fresh data</li>
</ol>

<h3>1.3 File Organization</h3>
<table class="data-table">
  <tr><th>Directory</th><th>Purpose</th></tr>
  <tr><td><code>app/</code></td><td>Route pages (dashboard, courses, assignments, tasks, calendar, analytics, admin, login, signup)</td></tr>
  <tr><td><code>components/</code></td><td>Reusable UI components organized by feature (admin/, assignments/, calendar/, etc.)</td></tr>
  <tr><td><code>lib/actions/</code></td><td>Server Actions for CRUD operations (10 action modules)</td></tr>
  <tr><td><code>lib/auth/</code></td><td>JWT session management (create, verify, destroy)</td></tr>
  <tr><td><code>lib/authorization/</code></td><td>RBAC utilities (requireUser, requireAdmin, assertOwnership)</td></tr>
  <tr><td><code>lib/store/</code></td><td>Zustand stores for client state</td></tr>
  <tr><td><code>prisma/</code></td><td>Database schema, seed, and PostgreSQL variant</td></tr>
</table>

<h2>2. Database Design</h2>
<h3>2.1 Prisma Schema</h3>
<p>The database schema is defined in <code>prisma/schema.prisma</code> with 5 models:</p>

<h4>Entity Relationship Summary</h4>
<table class="data-table">
  <tr><th>Model</th><th>Fields</th><th>Relationships</th></tr>
  <tr><td><b>User</b></td><td>id, name, email (unique), password, role (STUDENT/ADMIN), timestamps</td><td>Has many: courses, assignments, tasks, auditLogs</td></tr>
  <tr><td><b>Course</b></td><td>id, code, name, instructor, credits, progress, userId, timestamps</td><td>Belongs to: User. Has many: assignments</td></tr>
  <tr><td><b>Assignment</b></td><td>id, title, description?, courseId, userId, dueDate, priority, status, timestamps</td><td>Belongs to: User, Course</td></tr>
  <tr><td><b>Task</b></td><td>id, title, description?, dueDate?, priority, completed, userId, timestamps</td><td>Belongs to: User</td></tr>
  <tr><td><b>AuditLog</b></td><td>id, userId, action, entityType, entityId?, metadata?, createdAt</td><td>Belongs to: User</td></tr>
</table>

<h3>2.2 Foreign Keys and Cascading</h3>
<p>All relationships use <code>onDelete: Cascade</code>, meaning:</p>
<ul>
  <li>Deleting a User cascades to their courses, assignments, tasks, and audit logs</li>
  <li>Deleting a Course cascades to its assignments</li>
</ul>
<pre>// Example: Course → User relationship with cascade delete
model Course {
  userId  String
  user    User @relation(fields: [userId], references: [id], onDelete: Cascade)
}</pre>

<h3>2.3 Database Configuration</h3>
<pre>// lib/db.ts — Singleton Prisma client with hot-reload protection
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;</pre>

<h2>3. Database Operations (CRUD & Server Actions)</h2>
<h3>3.1 Server Actions Overview</h3>
<table class="data-table">
  <tr><th>Module</th><th>Operations</th><th>File</th></tr>
  <tr><td>Courses</td><td>getCourses, getCourseById, createCourse, updateCourse, deleteCourse</td><td><code>lib/actions/courses.ts</code></td></tr>
  <tr><td>Assignments</td><td>getAssignments, createAssignment, toggleAssignmentStatus, updateAssignment, deleteAssignment</td><td><code>lib/actions/assignments.ts</code></td></tr>
  <tr><td>Tasks</td><td>getTasks, createTask, toggleTaskComplete, updateTask, deleteTask</td><td><code>lib/actions/tasks.ts</code></td></tr>
  <tr><td>Dashboard</td><td>getDashboardData</td><td><code>lib/actions/dashboard.ts</code></td></tr>
  <tr><td>Calendar</td><td>getCalendarEvents</td><td><code>lib/actions/calendar.ts</code></td></tr>
  <tr><td>Analytics</td><td>getAcademicAnalytics</td><td><code>lib/actions/analytics.ts</code></td></tr>
  <tr><td>Notifications</td><td>getNotifications</td><td><code>lib/actions/notifications.ts</code></td></tr>
  <tr><td>Admin</td><td>getAdminStats, getAdminUsers, updateUserRole</td><td><code>lib/actions/admin.ts</code></td></tr>
  <tr><td>Auth</td><td>loginAction, signupAction, logoutAction</td><td><code>lib/actions/auth.ts</code></td></tr>
  <tr><td>Audit</td><td>logAuditEvent, getAuditLogs</td><td><code>lib/actions/audit.ts</code></td></tr>
</table>

<h3>3.2 User-Scoped Queries</h3>
<p>Every data-fetching Server Action enforces user isolation by filtering with the authenticated user's ID:</p>
<pre>// Every query includes userId for data isolation
const courses = await prisma.course.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: "desc" },
});
// Ownership verification before mutations
const existing = await prisma.course.findFirst({
  where: { id, userId: user.id },
});</pre>

<h3>3.3 Validation Flow</h3>
<p>Server Actions validate before executing: empty string checks, date parsing, numeric validation, and ownership verification. All mutations log audit events via <code>logAuditEvent()</code> and call <code>revalidatePath()</code> for cache invalidation.</p>

<h2>4. Seeding / Test Data</h2>
<h3>4.1 Seed Implementation</h3>
<p>The project includes <code>prisma/seed.ts</code> which creates initial test data using Prisma Client directly (no Faker library). It is configured in <code>package.json</code>:</p>
<pre>"prisma": { "seed": "npx tsx prisma/seed.ts" }</pre>

<h3>4.2 Seeded Data</h3>
<table class="data-table">
  <tr><th>Entity</th><th>Records</th><th>Details</th></tr>
  <tr><td>Admin User</td><td>1</td><td>admin@scholr.edu / adminpassword123 (ADMIN role)</td></tr>
  <tr><td>Student User</td><td>1</td><td>alex@scholr.edu / password123 (STUDENT role)</td></tr>
  <tr><td>Courses</td><td>3</td><td>DBMS, Machine Learning (AI401), Computer Networks (CS302)</td></tr>
  <tr><td>Assignments</td><td>4</td><td>Mix of PENDING/COMPLETED, HIGH/MEDIUM priority, various due dates</td></tr>
  <tr><td>Tasks</td><td>3</td><td>Mix of completed/pending, HIGH/MEDIUM/LOW priority</td></tr>
</table>
<p>Passwords are hashed with bcrypt (cost factor 10) before storage. The seed checks for existing users to prevent duplicate creation.</p>

<h2>5. Authentication</h2>
<h3>5.1 Authentication Flow</h3>
<ol>
  <li><b>Signup:</b> User submits name, email, password, confirmPassword → Server Action validates → bcrypt hashes password → Prisma creates User → JWT session created → Cookie set → Redirect to dashboard</li>
  <li><b>Login:</b> Email/password submitted → Prisma finds user → bcrypt.compare verifies → JWT created → HTTP-only cookie set → Redirect to dashboard</li>
  <li><b>Logout:</b> Server Action deletes the session cookie → Redirect to /login</li>
</ol>

<h3>5.2 JWT Session Architecture</h3>
<pre>// lib/auth/session.ts
export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  cookieStore.set("scholr_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}</pre>

<h3>5.3 Security Features</h3>
<ul>
  <li><b>HTTP-only cookies:</b> Session token cannot be accessed by client-side JavaScript</li>
  <li><b>Secure flag:</b> Cookie only sent over HTTPS in production</li>
  <li><b>SameSite: lax:</b> CSRF protection</li>
  <li><b>bcrypt hashing:</b> Passwords stored as bcrypt hashes with cost factor 10</li>
  <li><b>7-day expiration:</b> JWT tokens auto-expire after one week</li>
  <li><b>HS256 algorithm:</b> HMAC-SHA256 signing with server-side secret</li>
</ul>

<h2>6. Authorization / RBAC</h2>
<h3>6.1 Role System</h3>
<p>Scholr implements two roles: <b>STUDENT</b> (default) and <b>ADMIN</b>, stored as a string field on the User model.</p>

<h3>6.2 Authorization Functions</h3>
<pre>// lib/authorization/index.ts
export async function requireUser() {
  const user = await getCurrentAuthenticatedUser();
  if (!user) redirect("/login");  // Unauthenticated → login page
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard"); // Non-admin → dashboard
  return user;
}

export function assertOwnership(resourceUserId, currentUserId) {
  if (resourceUserId !== currentUserId)
    throw new Error("Unauthorized: Access denied.");
}</pre>

<h3>6.3 Protected Routes</h3>
<p>Admin pages (<code>/admin</code>, <code>/admin/users</code>, <code>/admin/audit-logs</code>) call <code>requireAdmin()</code> at the page level. All data pages call <code>requireUser()</code> which redirects unauthenticated users to <code>/login</code>. The sidebar conditionally renders admin navigation links only when <code>user.role === "ADMIN"</code>.</p>

<h2>7. Admin System</h2>
<h3>7.1 Admin Dashboard</h3>
<p>The admin dashboard shows platform-wide statistics and quick navigation links:</p>
${imgTag("adminDash", "Admin Control Center — platform statistics, user management and audit log navigation")}

<h3>7.2 User Management</h3>
<p>Admins can view all registered users with their roles, registration dates, and resource counts (courses/assignments/tasks). Role switching (Promote to Admin / Demote to Student) is supported with audit logging.</p>
${imgTag("adminUsers", "User Management — accounts table with role badges and promote/demote actions")}

<h3>7.3 Audit Logs</h3>
<p>All entity CRUD operations are recorded in the AuditLog table. The audit log viewer provides filtering by action type and entity type.</p>
${imgTag("adminAudit", "System Audit Logs — filterable audit trail for all entity operations")}

<h2>8. Notifications</h2>
<h3>8.1 Notification Types</h3>
<table class="data-table">
  <tr><th>Type</th><th>Trigger</th><th>Icon</th></tr>
  <tr><td>OVERDUE</td><td>Assignment/task due date has passed and item is not completed</td><td>AlertTriangle (amber)</td></tr>
  <tr><td>DUE_SOON</td><td>Assignment/task is due today or tomorrow and not completed</td><td>Clock (purple)</td></tr>
  <tr><td>COMPLETED</td><td>Assignment/task has been marked as completed</td><td>CheckCircle (green)</td></tr>
</table>

<h3>8.2 Implementation</h3>
<p>Notifications are generated server-side by <code>getNotifications()</code> which queries all user assignments and tasks, evaluates due dates against the current date using <code>isOverdue()</code> and <code>isSameDay()</code> utilities, and sorts results by priority (overdue first).</p>

<h3>8.3 Read/Unread Handling</h3>
<p>Read state is managed client-side using <code>localStorage</code>. Users can dismiss individual notifications or mark all as read. The notification bell shows an unread count badge.</p>

<h2>9. Calendar and Analytics Backend</h2>
<h3>9.1 Calendar Events</h3>
<p>The <code>getCalendarEvents()</code> Server Action fetches all user assignments and tasks with due dates, maps them to <code>CalendarEventItem</code> objects with computed status (PENDING/COMPLETED/OVERDUE), and returns them for the calendar component to render on the appropriate dates.</p>

<h3>9.2 Analytics Calculations</h3>
<p><code>getAcademicAnalytics()</code> computes metrics from database records:</p>
<ul>
  <li>Assignment completion rate: <code>(completed / total) * 100</code></li>
  <li>Task completion rate: <code>(completed / total) * 100</code></li>
  <li>Overdue detection using <code>isOverdue(dueDate, false)</code></li>
  <li>Course progress: calculated from assignment completion ratio per course</li>
</ul>

<h3>9.3 Date Utilities</h3>
<p><code>lib/utils/date.ts</code> provides helper functions: <code>formatDateHuman</code> (relative dates like "Today", "Tomorrow"), <code>isOverdue</code> (compares due date to current date, excludes completed items), <code>isSameDay</code>, and <code>formatDateFull</code>.</p>

<h2>10. PostgreSQL / Deployment Readiness</h2>
<h3>10.1 Current Setup</h3>
<p>Development uses SQLite via <code>DATABASE_URL="file:./dev.db"</code> in <code>.env</code>. The Prisma schema specifies <code>provider = "sqlite"</code>.</p>

<h3>10.2 PostgreSQL Schema</h3>
<p>A production-ready PostgreSQL variant exists at <code>prisma/schema.prisma.postgresql</code>. Key differences:</p>
<ul>
  <li><code>provider = "postgresql"</code> instead of <code>"sqlite"</code></li>
  <li>Added <code>directUrl = env("DIRECT_URL")</code> for connection pooling (Supabase/Neon compatibility)</li>
  <li>All models and relationships remain identical</li>
</ul>

<h3>10.3 Environment Variables</h3>
<pre>// .env.example provides the template:
DATABASE_URL="postgresql://user:password@host:5432/scholr"
DIRECT_URL="postgresql://user:password@host:5432/scholr"
JWT_SECRET="your-production-secret-key"</pre>

<h3>10.4 Migration Steps</h3>
<ol>
  <li>Replace <code>schema.prisma</code> with <code>schema.prisma.postgresql</code></li>
  <li>Set PostgreSQL connection string in <code>DATABASE_URL</code></li>
  <li>Run <code>npx prisma db push</code> to create tables</li>
  <li>Run <code>npx prisma db seed</code> to populate initial data</li>
</ol>
<div class="highlight-box"><b>Note:</b> PostgreSQL deployment is prepared but not yet deployed to production. The current application runs on local SQLite for development.</div>

<h2>11. Testing and Verification</h2>
<h3>11.1 ESLint</h3>
<p>Running <code>npm run lint</code> produces 3 errors and 1 warning, all in the <code>scripts/</code> directory (PDF generation utility scripts, not core application code). The core application code passes lint checks cleanly.</p>

<h3>11.2 Production Build</h3>
<p><code>npm run build</code> completes successfully with exit code 0. All 16 routes compile and generate correctly:</p>
<pre>Route (app)
├ /                    ├ /admin
├ /admin/audit-logs    ├ /admin/users
├ /analytics           ├ /assignments
├ /calendar            ├ /courses
├ /courses/[id]        ├ /dashboard
├ /login               ├ /settings
├ /signup              ├ /tasks
└ /_not-found          └ /admin/email-events

✓ Generating static pages (7/7) in 243ms
Exit code: 0</pre>

<h3>11.3 Verification Summary</h3>
<table class="data-table">
  <tr><th>Check</th><th>Result</th></tr>
  <tr><td><code>npm run build</code></td><td>✓ Success (exit code 0)</td></tr>
  <tr><td><code>npm run lint</code></td><td>3 errors in scripts/ only; core app clean</td></tr>
  <tr><td>Lighthouse Performance</td><td>87</td></tr>
  <tr><td>Lighthouse Accessibility</td><td>100</td></tr>
  <tr><td>Lighthouse Best Practices</td><td>100</td></tr>
  <tr><td>Lighthouse SEO</td><td>100</td></tr>
  <tr><td>Authentication flow</td><td>✓ Login, signup, logout verified</td></tr>
  <tr><td>RBAC enforcement</td><td>✓ Admin-only pages redirect non-admin users</td></tr>
  <tr><td>Database seeding</td><td>✓ 2 users, 3 courses, 4 assignments, 3 tasks created</td></tr>
</table>

<h2>12. Assignment 2 Conclusion</h2>
<p>Assignment 2 demonstrates the complete backend, database, and security architecture powering the Scholr application. The system uses Prisma ORM with a 5-model relational schema (User, Course, Assignment, Task, AuditLog) with cascading deletes and user-scoped data isolation. Authentication is implemented with bcrypt password hashing and JWT sessions stored in HTTP-only cookies via the jose library. RBAC is enforced through <code>requireUser()</code> and <code>requireAdmin()</code> guards. The admin system provides user management with role switching and a comprehensive audit trail. Notifications are computed server-side from deadline comparison logic. Calendar and analytics features are backed by database-driven metrics computations. A PostgreSQL schema variant is prepared for production deployment. The production build completes successfully with all 16 routes verified.</p>
`;

// ========== FINAL SUMMARY ==========
const finalSummary = `
<h2>Final Project Summary</h2>
<p>Scholr is a comprehensive full-stack academic productivity workspace that successfully implements:</p>
<ul>
  <li>A modern Next.js 16 application with React Server Components and Client Components</li>
  <li>Brutalist/editorial UI design with Playfair Display typography and responsive layouts</li>
  <li>Complete CRUD operations for courses, assignments, and tasks via Server Actions</li>
  <li>JWT-based authentication with bcrypt password hashing and HTTP-only cookie sessions</li>
  <li>Role-based access control (STUDENT/ADMIN) with protected routes</li>
  <li>Admin control center with user management and audit logging</li>
  <li>Real-time notifications for overdue, due-soon, and completed items</li>
  <li>Academic calendar and analytics with database-driven metrics</li>
  <li>Strong web performance (Lighthouse: Performance 87, Accessibility 100, Best Practices 100, SEO 100)</li>
  <li>PostgreSQL deployment readiness with prepared schema variant</li>
</ul>
<p style="margin-top:14px;"><b>Student:</b> Mohammad Jaffer Hussin &nbsp;|&nbsp; <b>SAP ID:</b> 60017240129 &nbsp;|&nbsp; <b>Roll No:</b> A021</p>
`;

// ========== GENERATE PDF ==========
async function generatePDF() {
  const fullHTML = `<!DOCTYPE html><html><head><meta charset="utf-8">${CSS}</head><body>
    ${assignment1HTML}
    <div class="page-break"></div>
    ${assignment2HTML}
    <div class="page-break"></div>
    ${finalSummary}
  </body></html>`;

  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(fullHTML, { waitUntil: "networkidle0", timeout: 60000 });

  const outPath = path.join("d:/Rehan/coding/scholr_", "Scholr_Final_Assignment_Report.pdf");
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", right: "18mm", bottom: "20mm", left: "18mm" },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;text-align:center;font-size:9px;color:#999;"><span class="pageNumber"></span></div>',
  });

  await browser.close();
  console.log(`PDF generated at: ${outPath}`);
}

generatePDF().catch(e => { console.error(e); process.exit(1); });
