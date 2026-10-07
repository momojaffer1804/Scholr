const puppeteer = require("puppeteer");
const path = require("path");

const OUTPUT_IMG = path.join(__dirname, "../public/report_screenshots/fig_database_records.png");

async function capturePrismaStudio() {
  console.log("Connecting to live Prisma Studio at http://localhost:5555 ...");
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--window-size=1280,800"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Navigate to Prisma Studio home
  await page.goto("http://localhost:5555", { waitUntil: "networkidle0" });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 2. Click on the 'User' model tab/card if available, or navigate to model page
  const userTab = await page.$("a[href*='User'], div[data-testid*='User']");
  if (userTab) {
    await userTab.click();
    await new Promise((resolve) => setTimeout(resolve, 2500));
  } else {
    await page.goto("http://localhost:5555/User", { waitUntil: "networkidle0" }).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }

  // 3. Take real screenshot of Prisma Studio UI
  console.log("Capturing authentic Prisma Studio screenshot...");
  await page.screenshot({ path: OUTPUT_IMG, fullPage: false });

  await browser.close();
  console.log(`Authentic Prisma Studio screenshot successfully saved to: ${OUTPUT_IMG}`);
}

capturePrismaStudio().catch((err) => {
  console.error("Failed to capture Prisma Studio screenshot:", err);
  process.exit(1);
});
