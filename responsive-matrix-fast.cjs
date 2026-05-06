const fs = require('fs');
const { chromium } = require('@playwright/test');

(async () => {
  const base = process.env.BASE_URL || 'http://127.0.0.1:3001';
  const appUrl = (route) => `${base}/#${route}`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultNavigationTimeout(15000);

  await page.goto(appUrl('/login'), { waitUntil: 'domcontentloaded' });
  await page.locator('input[type=email]').fill('test@example.com');
  await page.locator('input[type=password]').fill('123456');
  await page.locator('form button[type=submit]').click();
  await page.waitForURL('**/#/dashboard');

  const widths = [320, 375, 390, 768, 1024, 1440];
  const routes = [
    '/dashboard','/live-map','/dispatch/new','/dispatch','/trips','/trips/1','/rentals','/rentals/bookings','/rentals/catalog',
    '/school-shuttles','/school-shuttles/routes','/school-shuttles/operations','/school-shuttles/students','/school-shuttles/students/1/attendance',
    '/school-shuttles/safety','/school-shuttles/performance','/school-shuttles/calendar','/tours','/tours/list','/tours/bookings','/tours/1',
    '/ambulance','/ambulance/dispatch','/drivers','/drivers/1','/vehicles','/vehicles/1','/earnings','/earnings/payouts','/earnings/statements',
    '/compliance','/compliance/incidents','/settings/profile','/settings/account-security/2fa-setup','/settings/activity-log','/help','/support/messages'
  ];
  const themes = ['light', 'dark'];

  const failures = [];
  const navErrors = [];
  let total = 0;

  for (const theme of themes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        total += 1;
        try {
          await page.goto(appUrl(route), { waitUntil: 'domcontentloaded' });
          await page.waitForFunction((r) => location.hash === `#${r}`, route, { timeout: 5000 });
          await page.evaluate((t) => {
            const root = document.documentElement;
            root.classList.toggle('dark', t === 'dark');
            localStorage.setItem('theme', t);
          }, theme);
          await page.waitForTimeout(350);

          const data = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const main = document.querySelector('main');
            const docOverflow = docEl.scrollWidth - window.innerWidth;
            const bodyOverflow = body.scrollWidth - window.innerWidth;
            const mainOverflow = main ? main.scrollWidth - main.clientWidth : 0;
            const overflow = Math.max(docOverflow, bodyOverflow, mainOverflow);
            return { hash: location.hash, docW: docEl.scrollWidth, bodyW: body.scrollWidth, mainW: main ? main.scrollWidth : null, innerW: window.innerWidth, docOverflow, bodyOverflow, mainOverflow, overflow };
          });

          if (data.overflow > 1) {
            failures.push({ theme, width, route, ...data });
          }
        } catch (err) {
          navErrors.push({ theme, width, route, error: String(err).slice(0, 220) });
        }
      }
    }
  }

  const result = { totalChecks: total, failureCount: failures.length, failures, navErrors };
  fs.writeFileSync('/tmp/responsive_results.json', JSON.stringify(result, null, 2));
  console.log(`DONE total=${total} failures=${failures.length} navErrors=${navErrors.length}`);
  await browser.close();
})();
