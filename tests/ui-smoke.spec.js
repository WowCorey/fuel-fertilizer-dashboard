const { test, expect } = require('@playwright/test');

const routes = [
  { path: '/', heading: 'Australian resilience dashboard prototype' },
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
  { path: '/ui_kits/missing-data-scoreboard/index.html', heading: 'What Australia can see, and what is still missing.' },
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
    if (route.path !== '/') {
      await expect(page.getByLabel('Refresh status')).toContainText(/Refreshed|Refresh status unavailable|No successful refresh recorded|Page data retrieved/);
      await expect(page.getByText('Refreshed means the automated pipeline last ran successfully').first()).toBeVisible();
      await expect(page.getByText('Page data retrieved', { exact: true }).first()).toBeVisible();
    }
    await expect(page.locator('body')).not.toContainText("There isn't a GitHub Pages site here.");
    expect(pageErrors).toEqual([]);
    expect(consoleErrors.filter(text => !text.includes('favicon'))).toEqual([]);
  });
}

test('homepage presents the national summary and status legend', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Australian resilience dashboard prototype' })).toBeVisible();
  await expect(page.getByText('A public-source dashboard showing what can be verified')).toBeVisible();
  const heroLinks = page.getByLabel('Best first dashboard links');
  await expect(heroLinks.getByRole('link', { name: 'Open National Fuel Security' })).toBeVisible();
  await expect(heroLinks.getByRole('link', { name: 'View Missing Data Scoreboard' })).toBeVisible();
  await expect(heroLinks.getByRole('link', { name: 'View National Readiness Matrix' })).toBeVisible();
  await expect(heroLinks.getByRole('link', { name: 'View Food, Farms & Water' })).toBeVisible();
  await expect(heroLinks.getByRole('link', { name: 'View AU Economics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where to start' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For the fuel dashboard request' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For what still needs publishing' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A 30-second view of national resilience signals' })).toBeVisible();
  await expect(page.getByText('This site is an independent public-source prototype, not an official government dashboard.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fuel security' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Food, farms and water', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Economy and housing pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Power, manufacturing and infrastructure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Defence and strategic resources' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI, workforce and future pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Status labels are part of the evidence' })).toBeVisible();
  await expect(page.getByText('Unavailable and source-gated data is not a dashboard failure.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Who is this for?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Travellers and tourism operators' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Farmers' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MPs and policy staff' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Public-data gaps are now tracked as a product' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open missing data scoreboard' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'National readiness priority matrix' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open priority matrix' })).toBeVisible();
});

test('missing data scoreboard keeps roadmap areas source-gated', async ({ page }) => {
  await page.goto('/ui_kits/missing-data-scoreboard/index.html');
  await expect(page.getByRole('heading', { name: 'What Australia can see, and what is still missing.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Unavailable data is evidence of a public-data gap' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start with the gap, then the action' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scoreboard', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Priority matrix', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Action queue', exact: true })).toBeVisible();
  await expect(page.getByText('Source-backed and current enough for its cadence.')).toBeVisible();
  await expect(page.getByText('Waiting for a verified source, field, period, unit and reuse rights.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'National readiness priority matrix' })).toBeVisible();
  await expect(page.getByText('Priority bands are editorial/product triage only, not official risk ratings or numeric scores.')).toBeVisible();
  await expect(page.getByText('Immediate').first()).toBeVisible();
  await expect(page.getByText('High').first()).toBeVisible();
  await expect(page.getByText('Medium').first()).toBeVisible();
  await expect(page.getByText('Roadmap').first()).toBeVisible();
  await expect(page.getByText('Product-level fuel days cover and MSO reserves')).toBeVisible();
  await expect(page.getByText('Forward fuel/fertiliser contract coverage')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Next action queue' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source verification' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Data access request' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Methodology needed' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Grouped by who needs the missing data' })).toBeVisible();
  await expect(page.getByText('Public / travellers')).toBeVisible();
  await expect(page.getByText('Defence / national security')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What would make this operational?' })).toBeVisible();
  await expect(page.getByText('machine-readable official/public feeds')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="no-estimate-h"]').getByRole('heading', { name: 'No-estimate rule' })).toBeVisible();
  await expect(page.getByText('This dashboard does not fill missing government or industry feeds with guesses.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Missing data scoreboard' })).toBeVisible();
  await expect(page.getByText('Fuel security').first()).toBeVisible();
  await expect(page.getByText('Queensland fuel sovereignty').first()).toBeVisible();
  await expect(page.getByText('Food, farms and water').first()).toBeVisible();
  await expect(page.getByText('Economy and housing').first()).toBeVisible();
  await expect(page.getByText('Defence and procurement').first()).toBeVisible();
  await expect(page.getByText('Brisbane 2032 readiness').first()).toBeVisible();
  await expect(page.getByText('AI and workforce').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Next national dashboard areas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Australian fuel strategy tracker' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Housing and economic pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Defence procurement watch' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Brisbane 2032 readiness' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI automation and workforce pressure' })).toBeVisible();
  await expect(page.getByText('Pending official Defence or procurement source verification.')).toBeVisible();
  await expect(page.getByText('No AI causation or fake exposure score is published.')).toBeVisible();
  await expect(page.getByText('It does not invent government strategy facts')).toBeVisible();
});

test('fuel security page keeps operational gaps fail-closed', async ({ page }) => {
  await page.goto('/ui_kits/fuel-security-dashboard/index.html');
  await expect(page.getByRole('heading', { name: 'What a transparent Australian fuel dashboard should show.' })).toBeVisible();
  await expect(page.getByText('Public calls for a national fuel dashboard are about certainty')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Site refresh:|Refresh status unavailable|No successful refresh recorded/ })).toBeVisible();
  await expect(page.getByText('Latest verified page data retrieved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The national fuel dashboard structure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Use this fuel page in order' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fuel sovereignty pathway' })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Queensland fuel sovereignty and storage pathway' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Six-port fuel hub pathway' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'State-owned land and industrial fuel hubs' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Private-sector proposals and EOI status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Forward contracts and supply coverage' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="horizon-h"]').getByRole('heading', { name: 'What is on its way' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Small business planning signals' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'New Zealand comparison' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Taroom Trough' })).toBeVisible();
  await expect(page.getByText('Submission count, proponents and contracts remain unavailable')).toBeVisible();
  await expect(page.getByText('Terminal visibility boundary')).toBeVisible();
  await expect(page.getByText('Source investigation result')).toBeVisible();
});

test('food farms and water page keeps unavailable source gates explicit', async ({ page }) => {
  await page.goto('/ui_kits/fertilizer-dashboard/index.html');
  await expect(page.getByText('Food, farms & water security')).toBeVisible();
  await expect(page.getByRole('heading', { name: "Australia's food, farm inputs and water pressure, in plain English." })).toBeVisible();
  await expect(page.getByText('independent public-source prototype')).toBeVisible();
  await expect(page.getByText('not an official government dashboard')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Site refreshed|Refresh status unavailable|No successful refresh recorded/ })).toBeVisible();
  await expect(page.getByText('Latest verified page data retrieved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source status comes first' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How to use this food and farm page' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Real now' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Farm planning gaps' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Australia grows' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Australia buys' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Australia sells' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fertiliser and farm inputs' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Farmer decision pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Water and seasonal pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What government still needs to publish' })).toBeVisible();
  await expect(page.getByText('Can farmers see fertiliser cover?')).toBeVisible();
  await expect(page.getByText('Can farmers see farm diesel risk?')).toBeVisible();
  await expect(page.getByText('Can farmers see water allocation by production region?')).toBeVisible();
  await expect(page.getByText('Can farmers see rainfall/drought pressure?')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Food import value' })).toBeVisible();
  await expect(page.getByText('Food-import exposure needs a verified ABS trade concept')).toBeVisible();
  await expect(page.getByText('No public Australian fertiliser cover row is loaded.')).toBeVisible();
  await expect(page.getByText('This page does not infer drought or farm-level water availability from maps or commentary.')).toBeVisible();
});

test('AU economics page separates latest cash rate from monthly history', async ({ page }) => {
  await page.goto('/ui_kits/au-economics-dashboard/index.html');
  await expect(page.getByRole('heading', { name: "Australia's economy, in plain English." })).toBeVisible();
  await expect(page.getByText('Latest official cash-rate target decision published by the RBA. No forecast or estimate is used.')).toBeVisible();
  await expect(page.getByText('The headline card above uses the latest official decision-table row instead.')).toBeVisible();
  await expect(page.getByText('The chart preserves the F1.1 monthly-average cash-rate target history.')).toBeVisible();
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
