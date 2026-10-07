/* eslint-disable */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generateERDiagram() {
  console.log("Generating ER Diagram from Prisma schema...");

  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 780" width="1100" height="780" style="background-color: #ffffff; font-family: 'Times New Roman', serif;">
    <!-- Background & Grid -->
    <rect width="1100" height="780" fill="#ffffff"/>
    
    <!-- Title Header -->
    <rect x="30" y="20" width="1040" height="50" fill="#f8f9fa" stroke="#000000" stroke-width="1.5"/>
    <text x="550" y="50" text-anchor="middle" font-size="18" font-weight="bold" fill="#000000" letter-spacing="0.5">
      SCHOLR DATABASE SCHEMA — ENTITY RELATIONSHIP DIAGRAM (PRISMA ORM)
    </text>

    <!-- Defs for arrows -->
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#000000" />
      </marker>
      <marker id="crow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 M 10 5 L 0 5" fill="none" stroke="#000000" stroke-width="1.5" />
      </marker>
    </defs>

    <!-- ENTITY 1: USER (Central Entity) -->
    <g transform="translate(410, 90)">
      <!-- Table Container -->
      <rect x="0" y="0" width="280" height="230" fill="#ffffff" stroke="#000000" stroke-width="2"/>
      <!-- Header -->
      <rect x="0" y="0" width="280" height="36" fill="#e2e8f0" stroke="#000000" stroke-width="1.5"/>
      <text x="140" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="#000000">User [Model]</text>
      <!-- Fields -->
      <text x="12" y="56" font-size="12" font-weight="bold" fill="#000000">PK  id : String (CUID)</text>
      <text x="12" y="78" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name : String</text>
      <text x="12" y="100" font-size="12" font-weight="bold" fill="#000000">UQ  email : String</text>
      <text x="12" y="122" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password : String (Bcrypt)</text>
      <text x="12" y="144" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role : String [STUDENT|ADMIN]</text>
      <text x="12" y="166" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;createdAt : DateTime</text>
      <text x="12" y="188" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;updatedAt : DateTime</text>
      <!-- Footer badge -->
      <rect x="0" y="204" width="280" height="26" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
      <text x="140" y="221" text-anchor="middle" font-size="10" font-style="italic" fill="#334155">Relations: Course, Assignment, Task, AuditLog</text>
    </g>

    <!-- ENTITY 2: COURSE -->
    <g transform="translate(50, 90)">
      <rect x="0" y="0" width="280" height="230" fill="#ffffff" stroke="#000000" stroke-width="2"/>
      <rect x="0" y="0" width="280" height="36" fill="#e2e8f0" stroke="#000000" stroke-width="1.5"/>
      <text x="140" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="#000000">Course [Model]</text>
      <text x="12" y="56" font-size="12" font-weight="bold" fill="#000000">PK  id : String (CUID)</text>
      <text x="12" y="78" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code : String</text>
      <text x="12" y="100" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name : String</text>
      <text x="12" y="122" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;instructor : String</text>
      <text x="12" y="144" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;credits : Float</text>
      <text x="12" y="166" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;progress : Int = 0</text>
      <text x="12" y="188" font-size="12" font-weight="bold" fill="#000000">FK  userId : String (User.id)</text>
      <rect x="0" y="204" width="280" height="26" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
      <text x="140" y="221" text-anchor="middle" font-size="10" font-style="italic" fill="#334155">onDelete: Cascade</text>
    </g>

    <!-- ENTITY 3: ASSIGNMENT -->
    <g transform="translate(50, 440)">
      <rect x="0" y="0" width="280" height="250" fill="#ffffff" stroke="#000000" stroke-width="2"/>
      <rect x="0" y="0" width="280" height="36" fill="#e2e8f0" stroke="#000000" stroke-width="1.5"/>
      <text x="140" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="#000000">Assignment [Model]</text>
      <text x="12" y="56" font-size="12" font-weight="bold" fill="#000000">PK  id : String (CUID)</text>
      <text x="12" y="78" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title : String</text>
      <text x="12" y="100" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;description : String?</text>
      <text x="12" y="122" font-weight="bold" font-size="12" fill="#000000">FK  courseId : String (Course.id)</text>
      <text x="12" y="144" font-weight="bold" font-size="12" fill="#000000">FK  userId : String (User.id)</text>
      <text x="12" y="166" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dueDate : DateTime</text>
      <text x="12" y="188" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;priority : String [LOW|MED|HIGH]</text>
      <text x="12" y="210" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status : String [PENDING|DONE]</text>
      <rect x="0" y="224" width="280" height="26" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
      <text x="140" y="241" text-anchor="middle" font-size="10" font-style="italic" fill="#334155">onDelete: Cascade (User & Course)</text>
    </g>

    <!-- ENTITY 4: TASK -->
    <g transform="translate(410, 440)">
      <rect x="0" y="0" width="280" height="230" fill="#ffffff" stroke="#000000" stroke-width="2"/>
      <rect x="0" y="0" width="280" height="36" fill="#e2e8f0" stroke="#000000" stroke-width="1.5"/>
      <text x="140" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="#000000">Task [Model]</text>
      <text x="12" y="56" font-size="12" font-weight="bold" fill="#000000">PK  id : String (CUID)</text>
      <text x="12" y="78" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title : String</text>
      <text x="12" y="100" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;description : String?</text>
      <text x="12" y="122" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dueDate : DateTime?</text>
      <text x="12" y="144" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;priority : String [LOW|MED|HIGH]</text>
      <text x="12" y="166" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;completed : Boolean = false</text>
      <text x="12" y="188" font-size="12" font-weight="bold" fill="#000000">FK  userId : String (User.id)</text>
      <rect x="0" y="204" width="280" height="26" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
      <text x="140" y="221" text-anchor="middle" font-size="10" font-style="italic" fill="#334155">onDelete: Cascade</text>
    </g>

    <!-- ENTITY 5: AUDITLOG -->
    <g transform="translate(770, 260)">
      <rect x="0" y="0" width="280" height="230" fill="#ffffff" stroke="#000000" stroke-width="2"/>
      <rect x="0" y="0" width="280" height="36" fill="#e2e8f0" stroke="#000000" stroke-width="1.5"/>
      <text x="140" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="#000000">AuditLog [Model]</text>
      <text x="12" y="56" font-size="12" font-weight="bold" fill="#000000">PK  id : String (CUID)</text>
      <text x="12" y="78" font-size="12" font-weight="bold" fill="#000000">FK  userId : String (User.id)</text>
      <text x="12" y="100" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action : String</text>
      <text x="12" y="122" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entityType : String</text>
      <text x="12" y="144" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entityId : String?</text>
      <text x="12" y="166" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;metadata : String?</text>
      <text x="12" y="188" font-size="12" fill="#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;createdAt : DateTime</text>
      <rect x="0" y="204" width="280" height="26" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
      <text x="140" y="221" text-anchor="middle" font-size="10" font-style="italic" fill="#334155">onDelete: Cascade</text>
    </g>

    <!-- RELATIONSHIP LINES -->

    <!-- User (1) to Course (N) -->
    <path d="M 410 180 L 330 180" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="365" y="172" font-size="11" font-weight="bold" text-anchor="middle">1 : N</text>

    <!-- User (1) to Task (N) -->
    <path d="M 550 320 L 550 440" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="565" y="380" font-size="11" font-weight="bold">1 : N</text>

    <!-- User (1) to AuditLog (N) -->
    <path d="M 690 205 L 770 295" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="740" y="240" font-size="11" font-weight="bold">1 : N</text>

    <!-- User (1) to Assignment (N) -->
    <path d="M 410 240 L 360 240 L 360 490 L 330 490" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="380" y="360" font-size="11" font-weight="bold">1 : N</text>

    <!-- Course (1) to Assignment (N) -->
    <path d="M 190 320 L 190 440" fill="none" stroke="#000000" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="205" y="380" font-size="11" font-weight="bold">1 : N</text>

    <!-- Legend Footer -->
    <rect x="30" y="715" width="1040" height="45" fill="#f8f9fa" stroke="#000000" stroke-width="1.5"/>
    <text x="50" y="742" font-size="11" font-weight="bold" fill="#000000">Legend:</text>
    <text x="110" y="742" font-size="11" fill="#000000">PK = Primary Key (CUID) | FK = Foreign Key | UQ = Unique Constraint | ? = Optional Field | 1:N = One-to-Many Relational Cardinality</text>
  </svg>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 780, deviceScaleFactor: 2 });
  await page.setContent(svgContent);

  const outputPath = path.join(__dirname, "../public/report_screenshots/fig_er_diagram.png");
  await page.screenshot({ path: outputPath });
  await browser.close();

  console.log(`ER Diagram PNG saved to: ${outputPath}`);
}

generateERDiagram().catch(console.error);
