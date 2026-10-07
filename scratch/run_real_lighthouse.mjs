import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';

async function runLighthouseAndCapture() {
  console.log('Starting genuine Lighthouse audit against http://localhost:3000/login...');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ['--no-sandbox', '--disable-gpu', '--remote-debugging-port=9222'],
  });

  const endpoint = new URL(browser.wsEndpoint());
  const port = Number(endpoint.port || 9222);

  const result = await lighthouse('http://localhost:3000/login', {
    port: port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    output: ['json', 'html'],
  });

  const htmlReport = result.report[1];
  const jsonReport = result.report[0];

  // Save raw evidence
  fs.writeFileSync('scratch/lighthouse_report.html', htmlReport);
  fs.writeFileSync('scratch/lighthouse_report.json', jsonReport);
  console.log('Saved raw report evidence to scratch/lighthouse_report.html');

  // Extract empirical scores
  const categories = result.lhr.categories;
  const scores = {};
  for (const [key, val] of Object.entries(categories)) {
    scores[key] = Math.round(val.score * 100);
  }

  const audits = result.lhr.audits;
  const vitals = {
    FCP: audits['first-contentful-paint']?.displayValue || 'N/A',
    LCP: audits['largest-contentful-paint']?.displayValue || 'N/A',
    TBT: audits['total-blocking-time']?.displayValue || 'N/A',
    CLS: audits['cumulative-layout-shift']?.displayValue || 'N/A',
    SI: audits['speed-index']?.displayValue || 'N/A',
  };

  console.log('=== EMPIRICAL LIGHTHOUSE SCORES ===');
  console.log(JSON.stringify(scores, null, 2));
  console.log('=== EMPIRICAL CORE WEB VITALS ===');
  console.log(JSON.stringify(vitals, null, 2));

  // Now open the generated HTML report in Puppeteer to capture a genuine screenshot of the Lighthouse UI
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
  
  const reportPath = path.resolve('scratch/lighthouse_report.html');
  await page.goto(`file:///${reportPath}`, { waitUntil: 'networkidle0' });

  // Wait for LH styles to load and capture screenshot of top scores section
  await page.waitForSelector('.lh-topbar', { timeout: 5000 }).catch(() => {});
  
  const screenshotPath = path.resolve('public/report_screenshots/fig_lighthouse.png');
  await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 1200, height: 750 } });

  console.log(`Genuine Lighthouse report screenshot saved to: ${screenshotPath}`);

  await browser.close();
}

runLighthouseAndCapture().catch(err => {
  console.error('Lighthouse audit failed:', err);
  process.exit(1);
});
