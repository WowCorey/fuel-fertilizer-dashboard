const { test, expect } = require('@playwright/test');

const routes = [
  { path: '/', heading: "Australia's fuel and fertiliser data, without estimates." },
  { path: '/ui_kits/national-status-dashboard/index.html', heading: 'A single public snapshot of Australian fuel resilience.' },
  { path: '/ui_kits/fuel-security-dashboard/index.html', heading: 'What Australia can see from public fuel-security data.' },
  { path: '/ui_kits/resource-value-dashboard/index.html', heading: 'Who captures Australian oil and gas value?' },
  { path: '/ui_kits/fuel-dashboard/index.html', heading: "Australia's liquid fuel, in plain English." },
  { path: '/ui_kits/fertilizer-dashboard/index.html', heading: "Australia's fertiliser, in plain English." },
  { path: '/ui_kits/oil-and-production/index.html', heading: 'What crude costs, what we refine, and what the government pays.' },
  { path: '/ui_kits/who-pays-what/index.html', heading: 'What companies earn, what tax they pay, and what consumers pay.' },
];

for (const route of routes) {
  test(`${route.path} renders without console errors`, async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => pageErrors.push(err.message));

    const response = await page.goto(route.path);
    expect(response?.ok(), route.path).toBeTruthy();
    await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
    await expect(page.locator('body')).not.toContainText("There isn't a GitHub Pages site here.");
    expect(pageErrors).toEqual([]);
    expect(consoleErrors.filter(text => !text.includes('favicon'))).toEqual([]);
  });
}
