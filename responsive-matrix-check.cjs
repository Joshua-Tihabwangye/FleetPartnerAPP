const fs = require('fs');
const { chromium } = require('@playwright/test');

(async () => {
  const base = 'http://127.0.0.1:3001';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultNavigationTimeout(20000);

  await page.goto(base + '/dashboard', { waitUntil: 'domcontentloaded' });
  if (!/\/dashboard(?:$|\?)/.test(page.url())) {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    if (await emailInput.count()) {
      await emailInput.first().fill('test@example.com');
      await passwordInput.first().fill('123456');
      await page.getByRole('button', { name: /^sign in$/i }).click();
      await page.waitForURL('**/dashboard');
    }
  }

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

  for (const theme of themes) {
    await page.evaluate((t) => {
      const root = document.documentElement;
      root.classList.toggle('dark', t === 'dark');
      localStorage.setItem('theme', t);
    }, theme);

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(base + route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(60);

        const data = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const main = document.querySelector('main');

          const docOverflow = docEl.scrollWidth - window.innerWidth;
          const bodyOverflow = body.scrollWidth - window.innerWidth;
          const mainOverflow = main ? main.scrollWidth - main.clientWidth : 0;
          const overflow = Math.max(docOverflow, bodyOverflow, mainOverflow);

          return {
            docW: docEl.scrollWidth,
            bodyW: body.scrollWidth,
            mainW: main ? main.scrollWidth : null,
            innerW: window.innerWidth,
            docOverflow,
            bodyOverflow,
            mainOverflow,
            overflow,
          };
        });

        if (data.overflow > 1) {
          failures.push({ theme, width, route, ...data });
        }
      }
    }
  }

  const sidebarChecks = {};
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/dashboard', { waitUntil: 'domcontentloaded' });
    sidebarChecks[width] = await page.evaluate(() => {
      const toggles = [...document.querySelectorAll('button[title="Toggle sidebar"]')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).length;

      const sidebar = document.querySelector('nav.sidebar-scrollbar-hide');
      const style = sidebar ? getComputedStyle(sidebar) : null;

      return {
        visibleToggleButtons: toggles,
        sidebarScrollbarWidth: style ? style.scrollbarWidth : null,
      };
    });
  }

  const results = {
    failureCount: failures.length,
    failures,
    sidebarChecks
  };

  fs.writeFileSync('/tmp/responsive_results.json', JSON.stringify(results, null, 2));
  console.log('WROTE /tmp/responsive_results.json');
  await browser.close();
})();
