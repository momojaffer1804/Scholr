/* eslint-disable */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.join(__dirname, "../public/report_screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  console.log("Navigating to login page...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_login.png") });

  // 1. Log in as Student (alex@scholr.edu / password123)
  console.log("Logging in as Student (alex@scholr.edu)...");
  await page.type('input[type="email"]', "alex@scholr.edu");
  await page.type('input[type="password"]', "password123");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  // Capture Student pages
  console.log("Capturing Dashboard...");
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_dashboard.png") });

  console.log("Capturing Notification Menu...");
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label^="Notifications"]');
    if (btn) btn.click();
  });
  await page.evaluate(() => new Promise(r => setTimeout(r, 600)));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_notifications.png") });

  console.log("Capturing Courses...");
  await page.goto(`${BASE_URL}/courses`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_courses.png") });

  console.log("Capturing Course Detail...");
  const viewCourseLink = await page.$('a[href^="/courses/"]');
  if (viewCourseLink) {
    const href = await page.evaluate(el => el.getAttribute("href"), viewCourseLink);
    await page.goto(`${BASE_URL}${href}`, { waitUntil: "networkidle0" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_course_detail.png") });
  }

  console.log("Capturing Assignments...");
  await page.goto(`${BASE_URL}/assignments`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_assignments.png") });

  console.log("Capturing Tasks...");
  await page.goto(`${BASE_URL}/tasks`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_tasks.png") });

  console.log("Capturing Calendar...");
  await page.goto(`${BASE_URL}/calendar`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_calendar.png") });

  console.log("Capturing Analytics...");
  await page.goto(`${BASE_URL}/analytics`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_analytics.png") });

  // 2. Clear cookies and Log in as Admin (admin@scholr.edu / adminpassword123)
  console.log("Clearing session and logging in as Admin (admin@scholr.edu)...");
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
  
  await page.type('input[type="email"]', "admin@scholr.edu");
  await page.type('input[type="password"]', "adminpassword123");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  console.log("Capturing Admin Dashboard...");
  await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_admin_dashboard.png") });

  console.log("Capturing User Management...");
  await page.goto(`${BASE_URL}/admin/users`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_admin_users.png") });

  console.log("Capturing Audit Logs...");
  await page.goto(`${BASE_URL}/admin/audit-logs`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fig_admin_audit_logs.png") });

  await browser.close();
  console.log("All screenshots captured successfully in public/report_screenshots!");
}

capture().catch(err => {
  console.error("Capture failed:", err);
  process.exit(1);
});
