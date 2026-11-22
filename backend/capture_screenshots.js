const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../report_assets/screenshots');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiMDI5YjFiODJhMjU1MGFhODk3MGFlYiIsImlhdCI6MTc5NTM3MjQyNywiZXhwIjoxNzk3OTY0NDI3fQ.DynPndFFW7OyVwTmB_v9VBwmBWez8fRUAHioHbtXtIE';
const user = {
  _id: '6b029b1b82a2550aa8970aeb',
  name: 'Harsh',
  email: 'harsh@test.com'
};

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Landing Page
  console.log('Navigating to landing page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_landing_portal.png') });
  console.log('Saved 01_landing_portal.png');

  // Set auth in localStorage
  await page.evaluate((tok, usr) => {
    localStorage.setItem('rca_token', tok);
    localStorage.setItem('rca_user', JSON.stringify(usr));
  }, token, user);

  // 2. Dashboard Page
  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_system_dashboard.png') });
  console.log('Saved 02_system_dashboard.png');

  // 3. Create Incident Page
  console.log('Navigating to create incident...');
  await page.goto('http://localhost:5173/new-analysis', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_create_incident.png') });
  console.log('Saved 03_create_incident.png');

  // 4. Incident Detail / 5-Whys Analysis Page
  console.log('Navigating to incident detail...');
  await page.goto('http://localhost:5173/analysis/6b029b1b82a2550aa8970aee', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1', { timeout: 5000 });
  // wait 1 sec for animations/charts to settle
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_issue_details_rca.png') });
  console.log('Saved 04_issue_details_rca.png');

  // 5. Issues & History Filter Page
  console.log('Navigating to history...');
  await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_issue_history_table.png') });
  console.log('Saved 05_issue_history_table.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
