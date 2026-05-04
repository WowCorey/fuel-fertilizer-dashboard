const { test, expect } = require('@playwright/test');

const routes = [
  { path: '/', heading: "Australia's fuel, food and resilience data, without estimates." },
  { path: '/ui_kits/national-status-dashboard/index.html', heading: 'A single public snapshot of Australian fuel resilience.' },
  { path: '/ui_kits/fuel-security-dashboard/index.html', heading: 'What a transparent Australian fuel dashboard should show.' },
  { path: '/ui_kits/resource-value-dashboard/index.html', heading: 'Who captures Australian oil and gas value?' },
  { path: '/ui_kits/state-contribution-dashboard/index.html', heading: "What each state contributes to Australia's petroleum system." },
  { path: '/ui_kits/strategic-resources-dashboard/index.html', heading: "Australia's strategic resources, in plain English." },
  { path: '/ui_kits/defence-alliances-dashboard/index.html', heading: "Australia's defence posture, in plain English." },
  { path: '/ui_kits/fuel-dashboard/index.html', heading: "Australia's liquid fuel, in plain English." },
  { path: '/ui_kits/fertilizer-dashboard/index.html', heading: "Australia's food, farm inputs and water pressure, in plain English." },
  { path: '/ui_kits/oil-and-production/index.html', heading: 'What crude costs, what we refine, and what the government pays.' },
  { path: '/ui_kits/who-pays-what/index.html', heading: 'What companies earn, what tax they pay, and what consumers pay.' },
  { path: '/ui_kits/au-economics-dashboard/index.html', heading: "Australia's economy, in plain English." },
  { path: '/ui_kits/manufacturing-dashboard/index.html', heading: 'What Australia still makes, in plain English.' },
  { path: '/ui_kits/power-grid-dashboard/index.html', heading: "Australia's power grid, in plain English." },
  { path: '/ui_kits/infrastructure-dashboard/index.html', heading: "Australia's infrastructure, in plain English." },
  { path: '/ui_kits/employment-automation-dashboard/index.html', heading: "Australia's labour market during the AI rollout era." },
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
  await expect(page.getByRole('heading', { name: 'What a transparent Australian fuel dashboard should show.' })).toBeVisible();
  await expect(page.getByText('Public calls for a national fuel dashboard are about certainty')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Last verified source retrieval|Programmatic refresh not recorded yet/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The national fuel dashboard structure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What government and industry still need to publish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For travellers and tourism operators' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Partial Queensland fuel visibility, not live station coverage' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Supply resilience belongs beside price pressure' })).toBeVisible();
  await expect(page.getByText('Status unavailable').first()).toBeVisible();
  await expect(page.getByText('No public national live station outage feed is loaded.')).toBeVisible();
  await expect(page.getByText('WA weekly stockouts')).toBeVisible();
  await expect(page.getByText('WA-only dated public update')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'QLD unavailable fuel reports' }).first()).toBeVisible();
  await expect(page.getByText('Monthly Queensland Open Data rows where Price = 9999')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Inbound fuel evidence board, not a live map' })).toBeVisible();
  await expect(page.getByText('Live vessel identities / ETAs')).toBeVisible();
  await expect(page.getByText('This dashboard is a public-source fuel-security prototype, not a live service-station finder.')).toBeVisible();
  await expect(page.getByText('Terminal visibility boundary')).toBeVisible();
  await expect(page.getByText('Source investigation result')).toBeVisible();
});

test('food farms and water page keeps unavailable source gates explicit', async ({ page }) => {
  await page.goto('/ui_kits/fertilizer-dashboard/index.html');
  await expect(page.getByText('Food, farms & water security')).toBeVisible();
  await expect(page.getByRole('heading', { name: "Australia's food, farm inputs and water pressure, in plain English." })).toBeVisible();
  await expect(page.getByText('independent public-source prototype')).toBeVisible();
  await expect(page.getByText('not an official government dashboard')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Verified data retrieved|Programmatic refresh not recorded yet/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source status comes first' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Australia grows' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Australia buys' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Australia sells' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fertiliser and farm inputs' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Water and seasonal pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What government still needs to publish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Food import value' })).toBeVisible();
  await expect(page.getByText('Food-import exposure needs a verified ABS trade concept')).toBeVisible();
  await expect(page.getByText('No workflow timestamp is invented here.')).toBeVisible();
  await expect(page.getByText('No public Australian fertiliser cover row is loaded.')).toBeVisible();
  await expect(page.getByText('This page does not infer drought or farm-level water availability from maps or commentary.')).toBeVisible();
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

test('defence posture page keeps readiness and alliance boundaries explicit', async ({ page }) => {
  await page.goto('/ui_kits/defence-alliances-dashboard/index.html');
  await expect(page.getByRole('heading', { name: "Australia's defence posture, in plain English." })).toBeVisible();
  await expect(page.getByText('No readiness, mission-capable or live operational availability metric is loaded.')).toBeVisible();
  await expect(page.getByText('Budget, public assets, alliances and readiness are separate fields.')).toBeVisible();
  await expect(page.getByText('Defence spending as share of GDP')).toBeVisible();
  await expect(page.getByText('Quad').first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Diplomatic partnership, not a formal alliance' })).toBeVisible();
  await expect(page.getByText('Unavailable').first()).toBeVisible();
});
