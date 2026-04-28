const { test, expect } = require('@playwright/test');

const routes = [
  { path: '/', heading: "Australia's fuel and fertiliser data, without estimates." },
  { path: '/ui_kits/national-status-dashboard/index.html', heading: 'A single public snapshot of Australian fuel resilience.' },
  { path: '/ui_kits/fuel-security-dashboard/index.html', heading: 'What Australia can see from public fuel-security data.' },
  { path: '/ui_kits/resource-value-dashboard/index.html', heading: 'Who captures Australian oil and gas value?' },
  { path: '/ui_kits/state-contribution-dashboard/index.html', heading: "What each state contributes to Australia's petroleum system." },
  { path: '/ui_kits/strategic-resources-dashboard/index.html', heading: "Australia's strategic resources, in plain English." },
  { path: '/ui_kits/fuel-dashboard/index.html', heading: "Australia's liquid fuel, in plain English." },
  { path: '/ui_kits/fertilizer-dashboard/index.html', heading: "Australia's fertiliser, in plain English." },
  { path: '/ui_kits/oil-and-production/index.html', heading: 'What crude costs, what we refine, and what the government pays.' },
  { path: '/ui_kits/who-pays-what/index.html', heading: 'What companies earn, what tax they pay, and what consumers pay.' },
  { path: '/ui_kits/au-economics-dashboard/index.html', heading: "Australia's economy, in plain English." },
  { path: '/ui_kits/manufacturing-dashboard/index.html', heading: 'What Australia still makes, in plain English.' },
  { path: '/ui_kits/power-grid-dashboard/index.html', heading: "Australia's power grid, in plain English." },
  { path: '/ui_kits/infrastructure-dashboard/index.html', heading: "Australia's infrastructure, in plain English." },
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

test('fuel security page keeps operational gaps fail-closed', async ({ page }) => {
  await page.goto('/ui_kits/fuel-security-dashboard/index.html');
  await expect(page.getByRole('heading', { name: 'What Australia can see from public fuel-security data.' })).toBeVisible();
  await expect(page.getByText('Status unavailable').first()).toBeVisible();
  await expect(page.getByText('No public national live station outage feed is loaded.')).toBeVisible();
  await expect(page.getByText('WA weekly stockouts')).toBeVisible();
  await expect(page.getByText('WA-only dated public update')).toBeVisible();
  await expect(page.getByText('QLD unavailable fuel reports')).toBeVisible();
  await expect(page.getByText('Monthly Queensland Open Data rows where Price = 9999')).toBeVisible();
  await expect(page.getByText('Live vessel identities and ETAs')).toBeVisible();
  await expect(page.getByText('Terminal visibility boundary')).toBeVisible();
  await expect(page.getByText('Source investigation result')).toBeVisible();
});

test('state contribution page keeps tax attribution boundaries explicit', async ({ page }) => {
  await page.goto('/ui_kits/state-contribution-dashboard/index.html');
  await expect(page.getByRole('heading', { name: "What each state contributes to Australia's petroleum system." })).toBeVisible();
  await expect(page.getByText('No state-level federal tax allocation is estimated.')).toBeVisible();
  await expect(page.getByText('State royalties are not the same as Commonwealth PRRT, company tax, excise or GST.')).toBeVisible();
  await expect(page.getByText('Federal tax attribution').first()).toBeVisible();
  await expect(page.getByText('Combined context').first()).toBeVisible();
  await expect(page.getByText('Project/site/permit counts by state')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'State to basin to project/company, where sources publish it' })).toBeVisible();
  await expect(page.getByText('NOPTA production licence').first()).toBeVisible();
  await expect(page.getByText('REMP oil & gas project').first()).toBeVisible();
  await expect(page.getByText('Separate petroleum object classes, not one vague site count')).toBeVisible();
  await expect(page.getByText('Operating refineries').first()).toBeVisible();
});

test('strategic resources page keeps metric types and gaps explicit', async ({ page }) => {
  await page.goto('/ui_kits/strategic-resources-dashboard/index.html');
  await expect(page.getByRole('heading', { name: "Australia's strategic resources, in plain English." })).toBeVisible();
  await expect(page.getByText('No underground-wealth total is published.')).toBeVisible();
  await expect(page.getByText('Production, exports, reserves/resources and strategic role are separate fields.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Resource comparison table' })).toBeVisible();
  await expect(page.getByText('Rare earths').first()).toBeVisible();
  await expect(page.getByText('Sulphur').first()).toBeVisible();
  await expect(page.getByText('No official national sulphur production or export row is loaded.', { exact: true })).toBeVisible();
});
