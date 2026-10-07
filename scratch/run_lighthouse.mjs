import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import fs from 'fs';

async function runLighthouse() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const port = new URL(browser.wsEndpoint()).port;

  const result = await lighthouse('http://localhost:3000/login', {
    port: Number(port),
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    output: ['json', 'html'],
  });

  // Write HTML report
  fs.writeFileSync('d:/Rehan/coding/scholr_/scratch/lighthouse_report.html', result.report[1]);

  // Extract scores
  const categories = result.lhr.categories;
  const scores = {};
  for (const [key, val] of Object.entries(categories)) {
    scores[key] = Math.round(val.score * 100);
  }

  console.log('=== LIGHTHOUSE SCORES ===');
  console.log(JSON.stringify(scores, null, 2));

  // Extract Core Web Vitals
  const audits = result.lhr.audits;
  const vitals = {
    FCP: audits['first-contentful-paint']?.displayValue,
    LCP: audits['largest-contentful-paint']?.displayValue,
    TBT: audits['total-blocking-time']?.displayValue,
    CLS: audits['cumulative-layout-shift']?.displayValue,
    SI: audits['speed-index']?.displayValue,
  };
  console.log('\n=== CORE WEB VITALS ===');
  console.log(JSON.stringify(vitals, null, 2));

  await browser.close();
  console.log('\nDone!');
}

runLighthouse().catch(e => {
  console.error(e);
  process.exit(1);
});
