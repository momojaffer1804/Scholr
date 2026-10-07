const puppeteer = require("puppeteer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const OUTPUT_IMG = path.join(__dirname, "../public/report_screenshots/fig_database_records.png");

async function captureDatabaseRecords() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  const courses = await prisma.course.findMany({ select: { id: true, code: true, name: true, credits: true, progress: true } });
  const assignments = await prisma.assignment.findMany({ select: { id: true, title: true, priority: true, status: true, dueDate: true } });
  const tasks = await prisma.task.findMany({ select: { id: true, title: true, priority: true, completed: true } });
  const auditLogs = await prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: "desc" } });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Courier New', monospace; background-color: #09090b; color: #f4f4f5; padding: 24px; margin: 0; }
      h2 { color: #a855f7; border-bottom: 2px solid #a855f7; padding-bottom: 6px; font-size: 16px; margin-top: 20px; }
      .header-title { font-size: 20px; font-weight: bold; color: #ffffff; margin-bottom: 4px; text-transform: uppercase; }
      .header-sub { font-size: 13px; color: #a1a1aa; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
      th, td { border: 1px solid #27272a; padding: 6px 10px; text-align: left; }
      th { background-color: #18181b; color: #e4e4e7; font-weight: bold; }
      tr:nth-child(even) { background-color: #121215; }
      .badge-student { background: #1e293b; color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
      .badge-admin { background: #31103f; color: #c084fc; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="header-title">PRISMA DATABASE RECORD PERSISTENCE EXPLORER</div>
    <div class="header-sub">Database Provider: SQLite / Prepared PostgreSQL | Engine Version: Prisma 6.19.3 | Host: Local Server</div>

    <h2>1. USER ENTITY RECORDS (User Table)</h2>
    <table>
      <tr><th>ID (CUID)</th><th>NAME</th><th>EMAIL</th><th>ROLE</th></tr>
      ${users.map(u => `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td><span class="${u.role === 'ADMIN' ? 'badge-admin' : 'badge-student'}">${u.role}</span></td></tr>`).join('')}
    </table>

    <h2>2. COURSE ENTITY RECORDS (Course Table)</h2>
    <table>
      <tr><th>ID</th><th>CODE</th><th>NAME</th><th>CREDITS</th><th>PROGRESS (%)</th></tr>
      ${courses.map(c => `<tr><td>${c.id}</td><td>${c.code}</td><td>${c.name}</td><td>${c.credits}</td><td>${c.progress}%</td></tr>`).join('')}
    </table>

    <h2>3. ASSIGNMENT ENTITY RECORDS (Assignment Table)</h2>
    <table>
      <tr><th>ID</th><th>TITLE</th><th>PRIORITY</th><th>STATUS</th><th>DUE DATE</th></tr>
      ${assignments.map(a => `<tr><td>${a.id}</td><td>${a.title}</td><td>${a.priority}</td><td>${a.status}</td><td>${new Date(a.dueDate).toISOString().split('T')[0]}</td></tr>`).join('')}
    </table>

    <h2>4. SYSTEM AUDIT LOG RECORDS (AuditLog Table)</h2>
    <table>
      <tr><th>ID</th><th>ACTION</th><th>ENTITY TYPE</th><th>TIMESTAMP</th></tr>
      ${auditLogs.map(l => `<tr><td>${l.id}</td><td>${l.action}</td><td>${l.entityType}</td><td>${new Date(l.createdAt).toISOString()}</td></tr>`).join('')}
    </table>
  </body>
  </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 950 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({ path: OUTPUT_IMG, fullPage: true });
  await browser.close();
  await prisma.$disconnect();
  console.log("Database records screenshot captured cleanly to fig_database_records.png");
}

captureDatabaseRecords().catch(err => {
  console.error("Database screenshot error:", err);
  process.exit(1);
});
