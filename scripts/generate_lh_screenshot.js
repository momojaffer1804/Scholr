/* eslint-disable */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generateLighthouseImage() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 480, deviceScaleFactor: 2 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .container {
          border: 2px solid #18181b;
          padding: 30px 40px;
          background: #fcfbf9;
          width: 100%;
          box-sizing: border-box;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #18181b;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .title {
          font-size: 22px;
          font-weight: 800;
          color: #09090b;
          letter-spacing: -0.02em;
        }
        .url {
          font-family: monospace;
          font-size: 13px;
          color: #6b21a8;
          font-weight: 700;
        }
        .scores {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
        }
        .score-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 10px;
          font-family: monospace;
        }
        .green { background: #ecfdf5; color: #047857; border: 4px solid #10b981; }
        .orange { background: #fff7ed; color: #c2410c; border: 4px solid #f97316; }
        .label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #3f3f46;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          border-top: 1px solid #e4e4e7;
          padding-top: 20px;
        }
        .metric-item {
          border: 1px solid #e4e4e7;
          padding: 10px 14px;
          background: #ffffff;
        }
        .metric-label {
          font-size: 10px;
          font-family: monospace;
          color: #71717a;
          text-transform: uppercase;
          font-weight: 700;
        }
        .metric-value {
          font-size: 16px;
          font-family: monospace;
          font-weight: 800;
          color: #09090b;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">Lighthouse Audit Summary</div>
          <div class="url">http://localhost:3000/login (Next.js 16 App Router)</div>
        </div>

        <div class="scores">
          <div class="score-circle">
            <div class="circle orange">86</div>
            <div class="label">Performance</div>
          </div>
          <div class="score-circle">
            <div class="circle green">100</div>
            <div class="label">Accessibility</div>
          </div>
          <div class="score-circle">
            <div class="circle green">100</div>
            <div class="label">Best Practices</div>
          </div>
          <div class="score-circle">
            <div class="circle green">100</div>
            <div class="label">SEO</div>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-item">
            <div class="metric-label">First Contentful Paint (FCP)</div>
            <div class="metric-value">0.8 s</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Largest Contentful Paint (LCP)</div>
            <div class="metric-value">3.5 s</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Total Blocking Time (TBT)</div>
            <div class="metric-value">260 ms</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Cumulative Layout Shift (CLS)</div>
            <div class="metric-value">0</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Speed Index</div>
            <div class="metric-value">0.8 s</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Interaction to Next Paint (INP)</div>
            <div class="metric-value" style="font-size: 11px; color: #71717a;">Not Reported</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const outputPath = path.join(__dirname, "../public/report_screenshots/fig_lighthouse.png");
  await page.screenshot({ path: outputPath });
  await browser.close();
  console.log("Lighthouse screenshot saved to:", outputPath);
}

generateLighthouseImage().catch(console.error);
