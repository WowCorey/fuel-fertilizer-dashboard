const { test, expect } = require('@playwright/test');

const routes = [
  { path: '/', heading: /Tracking what Australia.{1,5}s resilience data shows/ },
  { path: '/ui_kits/national-status-dashboard/index.html', heading: 'A single public snapshot of Australian fuel resilience.' },
  { path: '/ui_kits/fuel-security-dashboard/index.html', heading: /What Australia.{1,5}s public fuel-security data can verify/ },
  { path: '/ui_kits/australian-fuel-strategy-dashboard/index.html', heading: /What Australia.{1,5}s public fuel-strategy data can verify/ },
  { path: '/ui_kits/qld-fuel-sovereignty-dashboard/index.html', heading: /What Queensland.{1,5}s public fuel-sovereignty data can verify/ },
  { path: '/ui_kits/resource-value-dashboard/index.html', heading: 'Who captures Australian oil and gas value?' },
  { path: '/ui_kits/state-contribution-dashboard/index.html', heading: "What each state contributes to Australia's petroleum system." },
  { path: '/ui_kits/strategic-resources-dashboard/index.html', heading: "Australia's strategic resources, in plain English." },
  { path: '/ui_kits/defence-alliances-dashboard/index.html', heading: "Australia's defence posture, in plain English." },
  { path: '/ui_kits/defence-procurement-watch/index.html', heading: 'Defence procurement watch' },
  { path: '/ui_kits/fuel-dashboard/index.html', heading: "Australia's liquid fuel, in plain English." },
  { path: '/ui_kits/fertilizer-dashboard/index.html', heading: /What Australia.{1,5}s public food-system data can verify/ },
  { path: '/ui_kits/oil-and-production/index.html', heading: 'What crude costs, what we refine, and what the government pays.' },
  { path: '/ui_kits/who-pays-what/index.html', heading: 'What companies earn, what tax they pay, and what consumers pay.' },
  { path: '/ui_kits/au-economics-dashboard/index.html', heading: "Australia's economy, in plain English." },
  { path: '/ui_kits/housing-economic-pressure-dashboard/index.html', heading: 'Housing and economic pressure' },
  { path: '/ui_kits/manufacturing-dashboard/index.html', heading: 'What Australia still makes, in plain English.' },
  { path: '/ui_kits/power-grid-dashboard/index.html', heading: "Australia's power grid, in plain English." },
  { path: '/ui_kits/infrastructure-dashboard/index.html', heading: "Australia's infrastructure, in plain English." },
  { path: '/ui_kits/brisbane-2032-readiness-dashboard/index.html', heading: 'Brisbane 2032 readiness' },
  { path: '/ui_kits/employment-automation-dashboard/index.html', heading: "Australia's labour market during the AI rollout era." },
  { path: '/ui_kits/missing-data-scoreboard/index.html', heading: /The public-data gaps behind Australia.{1,5}s resilience picture/ },
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
  await expect(page.getByRole('heading', { name: /Tracking what Australia.{1,5}s resilience data shows/ })).toBeVisible();
  await expect(page.getByText('A public-interest dashboard that separates verified public data from missing, stale, partial and source-gated feeds')).toBeVisible();
  const heroLinks = page.getByLabel('Hero actions');
  await expect(heroLinks.getByRole('link', { name: 'Open Missing Data Scoreboard' })).toBeVisible();
  await expect(heroLinks.getByRole('link', { name: 'Open National Fuel Security' })).toBeVisible();
  await expect(heroLinks.getByRole('link')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'Status labels are part of the evidence' })).toBeVisible();
  await expect(page.getByText('Unavailable and source-gated data is not a dashboard failure.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where to start' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For the fuel dashboard request' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For fuel strategy and reserves' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For Queensland fuel delivery' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For Defence procurement' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For what still needs publishing' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For housing pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For Brisbane 2032 readiness' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Fuel Strategy' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View QLD Fuel Delivery' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View National Readiness Matrix' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Food, Farms & Water' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Housing Pressure' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Brisbane 2032' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View AU Economics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A 30-second view of national resilience signals' })).toBeVisible();
  await expect(page.getByText('This site is an independent public-source prototype, not an official government dashboard.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fuel security' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Food, farms and water', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Economy and housing pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Power, manufacturing and infrastructure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Defence and strategic resources' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI, workforce and future pressure' })).toBeVisible();
  await expect(page.getByText('Last updated: source metadata pending').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Who is this for?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Travellers and tourism operators' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Farmers' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MPs and policy staff' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Public-data gaps are now tracked as a product' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Housing pressure' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fuel strategy' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'QLD fuel sovereignty' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open defence procurement watch' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Brisbane 2032 readiness', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open missing data scoreboard' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'National readiness priority matrix' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open priority matrix' })).toBeVisible();
});

test('homepage hero shows neutral deployment status line', async ({ page }) => {
  await page.goto('/');
  const status = page.locator('#refresh-badge');
  await expect(status).toContainText('Last deployed:');
  await expect(status).toContainText('Programmatic refresh: in rollout');
  await expect(status).toContainText('Manual public-source snapshots are labelled where used');
  await expect(status).not.toContainText('no successful refresh recorded');
});

test('homepage shows audit snapshot derived from source manifest', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'What public sources we track' })).toBeVisible();
  await expect(page.locator('[data-band="verified"]')).not.toHaveText('—');
  await expect(page.locator('[data-band="manual"]')).not.toHaveText('—');
  await expect(page.locator('[data-band="derived"]')).not.toHaveText('—');
  await expect(page.locator('[data-band="unavailable"]')).not.toHaveText('—');
});

test('homepage primary nav exposes category groups', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Missing Data Scoreboard', exact: true })).toBeVisible();
  await expect(nav.getByRole('button', { name: /Fuel & Energy/ })).toBeVisible();
  await expect(nav.getByRole('button', { name: /Food & Farms/ })).toBeVisible();
  await expect(nav.getByRole('button', { name: /Economy & Households/ })).toBeVisible();
  await expect(nav.getByRole('button', { name: /Defence & Strategic/ })).toBeVisible();
  await expect(nav.getByRole('button', { name: /Infrastructure/ })).toBeVisible();
  await expect(nav.getByRole('button', { name: /Workforce/ })).toBeVisible();
  await nav.getByRole('button', { name: /Fuel & Energy/ }).click();
  await expect(nav.getByRole('menuitem', { name: 'National fuel security' })).toBeVisible();
  await expect(nav.getByRole('menuitem', { name: 'Power grid' })).toBeVisible();
});

test('missing data scoreboard keeps roadmap areas source-gated', async ({ page }) => {
  await page.goto('/ui_kits/missing-data-scoreboard/index.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { name: /The public-data gaps behind Australia.{1,5}s resilience picture/ })).toBeVisible();
  await expect(page.getByText('This scoreboard separates verified feeds from missing, stale, partial and source-gated data')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A 30-second view of public-data visibility' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scan the audit by category' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this scoreboard is, and is not' })).toBeVisible();
  await expect(page.getByText('Unavailable means no public source-safe feed has been loaded yet.')).toBeVisible();
  await expect(page.getByText('A missing public feed is a visibility gap, not evidence of wrongdoing.')).toBeVisible();
  await expect(page.getByText('Priority bands are an editorial/product triage view, not official risk ratings or numeric scores.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Public-data gaps grouped by category' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fuel operations and supply visibility' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Food, farms and water', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Economy and households' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Defence and strategic posture' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Infrastructure and Brisbane 2032' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Workforce and automation' })).toBeVisible();
  await expect(main.getByText('Last reviewed: metadata pending').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open the dashboards behind these gaps' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open National Fuel Security' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Queensland Fuel Sovereignty' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Food, Farms & Water' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open AU Economics' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Defence Posture' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Infrastructure' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Employment & Automation' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Brisbane 2032 Readiness' }).first()).toBeVisible();
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
  await expect(page.getByText('Product-level fuel days cover and MSO reserves').first()).toBeVisible();
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
  await expect(main.getByText('Fuel security').first()).toBeVisible();
  await expect(main.getByText('Queensland fuel sovereignty').first()).toBeVisible();
  await expect(main.getByText('Food, farms and water').first()).toBeVisible();
  await expect(main.getByText('Economy and housing').first()).toBeVisible();
  await expect(main.getByText('Defence and procurement').first()).toBeVisible();
  await expect(main.getByText('Brisbane 2032 readiness').first()).toBeVisible();
  await expect(main.getByText('AI and workforce').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Next national dashboard areas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Australian fuel strategy tracker' })).toBeVisible();
  await expect(page.getByText('dedicated Fuel Strategy page now surfaces existing PM&C/DCCEEW indicators')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Housing and economic pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Defence procurement watch' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Brisbane 2032 readiness' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI automation and workforce pressure' })).toBeVisible();
  await expect(page.getByText('A dedicated Defence Procurement Watch page now surfaces these source gates.')).toBeVisible();
  await expect(page.getByText('A dedicated Brisbane 2032 Readiness page now surfaces these source gates.')).toBeVisible();
  await expect(page.getByText('No AI causation or fake exposure score is published.')).toBeVisible();
  await expect(page.getByText('It does not invent government strategy facts')).toBeVisible();
});

test('housing pressure page keeps models source-gated', async ({ page }) => {
  await page.goto('/ui_kits/housing-economic-pressure-dashboard/index.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { name: 'Housing and economic pressure' })).toBeVisible();
  await expect(main.getByText('independent public-source prototype').first()).toBeVisible();
  await expect(page.getByText('It does not estimate household repayments, rental stress, negative-gearing effects or housing affordability')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Read indicators before interpreting pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Interest-rate signal' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Household-debt pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Official indicators loaded now' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest RBA cash-rate target' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'RBA cash-rate target, monthly history' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What remains source-gated' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mortgage repayment pressure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'First-home buyer indicators' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Investor ownership / investor lending' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Rental stress' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Negative gearing model' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Official indicators are not models' })).toBeVisible();
  await expect(page.getByText('This dashboard separates official indicators from models.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Safe aggregate indicators, not private household detail' })).toBeVisible();
  await expect(page.getByText('No-estimate rule')).toBeVisible();
  await expect(page.getByText('No loan-size, term, offset or repayment calculation is added.')).toBeVisible();
});

test('fuel security page keeps operational gaps fail-closed', async ({ page }) => {
  await page.goto('/ui_kits/fuel-security-dashboard/index.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { name: /What Australia.{1,5}s public fuel-security data can verify/ })).toBeVisible();
  await expect(page.getByText('This dashboard separates source-backed fuel-security indicators from partial, stale, manual and source-gated feeds')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this page can verify in 30 seconds' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Status labels used on this page' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this dashboard does, and does not, claim' })).toBeVisible();
  await expect(page.getByText('Unavailable means no public source-safe feed is loaded yet.')).toBeVisible();
  await expect(page.getByText('A missing public feed is a public visibility gap, not evidence of wrongdoing.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open related public-data surfaces' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Missing Data Scoreboard' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Queensland Fuel Sovereignty', exact: true })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Food, Farms & Water' })).toBeVisible();
  await expect(main.getByText('Last reviewed: metadata pending').first()).toBeVisible();
  await expect(page.getByText('Public calls for a national fuel dashboard are about certainty')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Site refresh:|Refresh status unavailable|No successful refresh recorded/ })).toBeVisible();
  await expect(page.getByText('Latest verified page data retrieved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The national fuel dashboard structure' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Use this fuel page in order' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For policy, reserves and MSO context' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Australian Fuel Strategy Tracker' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Defence Procurement Watch' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Brisbane 2032 Readiness' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fuel sovereignty pathway' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For Queensland delivery tracking' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Queensland Fuel Sovereignty Delivery Tracker' })).toBeVisible();
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
  const main = page.locator('main');
  await expect(page.getByText('Food, farms & water security')).toBeVisible();
  await expect(page.getByRole('heading', { name: /What Australia.{1,5}s public food-system data can verify/ })).toBeVisible();
  await expect(page.getByText('This dashboard separates source-backed food, farm, fertiliser and water indicators from partial')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Status labels used on this food-system page' })).toBeVisible();
  await expect(page.getByText('These labels match the Missing Data Scoreboard and the fuel-security audit cluster.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What the food-system audit can and cannot show' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Publicly visible food-system signals' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source-gated fertiliser and water feeds' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What readers should not assume from missing food-system data' })).toBeVisible();
  await expect(page.getByText('Unavailable means no public source-safe feed has been loaded yet.')).toBeVisible();
  await expect(page.getByText('A missing public feed is a public visibility gap.')).toBeVisible();
  await expect(page.getByText('Priority language on this page is editorial/product triage only.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open related public-data surfaces' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Missing Data Scoreboard' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open National Fuel Security' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Australian Fuel Strategy' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open AU Economics' })).toBeVisible();
  await expect(main.getByText('Last reviewed: metadata pending').first()).toBeVisible();
  await expect(main.getByText('independent public-source prototype').first()).toBeVisible();
  await expect(main.getByText('not an official government dashboard').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /Site refreshed|Refresh status unavailable|No successful refresh recorded/ })).toBeVisible();
  await expect(page.getByText('Latest verified page data retrieved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Food-system source status comes first' })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: /What Australia.{1,5}s public food-system data can verify/ })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Status labels used on this food-system page' })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'What the food-system audit can and cannot show' })).toHaveCount(1);
  const legendOrder = await page.evaluate(() => {
    const legend = document.querySelector('#food-status-legend-h')?.closest('section');
    const coverage = document.querySelector('.coverage-strip');
    return !!legend && !!coverage && Boolean(legend.compareDocumentPosition(coverage) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(legendOrder).toBeTruthy();
});

test('fuel strategy tracker keeps policy and operational data source-gated', async ({ page }) => {
  await page.goto('/ui_kits/australian-fuel-strategy-dashboard/index.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { name: /What Australia.{1,5}s public fuel-strategy data can verify/ })).toBeVisible();
  await expect(page.getByText('This tracker separates source-backed national fuel-policy signals from partial, manual and source-gated feeds')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this tracker can verify in 30 seconds' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Status labels used on this page' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this tracker does, and does not, claim' })).toBeVisible();
  await expect(page.getByText('Unavailable means no public source-safe feed has been loaded yet.')).toBeVisible();
  await expect(page.getByText('A missing public feed is a public visibility gap, not evidence of wrongdoing.')).toBeVisible();
  await expect(page.getByText('Likely holder/publisher entries name the agencies most plausibly responsible for the data')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open related public-data surfaces' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open National Fuel Security' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Queensland Fuel Sovereignty', exact: true })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Missing Data Scoreboard' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Food, Farms & Water' })).toBeVisible();
  await expect(main.getByText('Last reviewed: metadata pending').first()).toBeVisible();
  await expect(main.getByText('independent public-source prototype').first()).toBeVisible();
  await expect(page.getByText('It does not infer fuel reserves, contracts, cargoes, emergency powers or security-sensitive holdings')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Defence Procurement Watch' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Policy evidence before operational claims' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="policy-docs-h"]').getByRole('heading', { name: 'Official strategy and policy documents' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="reserve-indicators-h"]').getByRole('heading', { name: 'Public reserve and MSO indicators' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="product-days-h"]').getByRole('heading', { name: 'Product-level days-cover visibility' })).toBeVisible();
  await expect(page.getByText('Product-level days-cover is one of the most important public fuel-security signals.')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="boundary-h"]').getByRole('heading', { name: 'Emergency response and public/private boundary' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="implementation-h"]').getByRole('heading', { name: 'Strategy implementation tracker' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="publish-h"]').getByRole('heading', { name: 'What government still needs to publish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Queensland delivery pathway' })).toBeVisible();
  await expect(page.getByText('For state delivery and six-port AFIP context, see Queensland Fuel Sovereignty')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Queensland Fuel Sovereignty Delivery Tracker' })).toBeVisible();
  await expect(page.getByText('Latest national fuel strategy')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="boundary-h"]').getByRole('cell', { name: 'Terminal inventory' })).toBeVisible();
  await expect(page.getByText('Forward supply/contract coverage')).toBeVisible();
  await expect(page.getByText('No fuel reserves, contracts, cargoes or emergency powers are inferred.')).toBeVisible();
  await expect(page.getByText('No fuel strategy facts, reserve values, days-cover values, emergency policy settings')).toBeVisible();
});

test('Queensland fuel sovereignty tracker keeps delivery data source-gated', async ({ page }) => {
  await page.goto('/ui_kits/qld-fuel-sovereignty-dashboard/index.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { name: /What Queensland.{1,5}s public fuel-sovereignty data can verify/ })).toBeVisible();
  await expect(page.getByText('This tracker separates source-backed delivery signals from partial, manual and source-gated feeds')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this tracker can verify in 30 seconds' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Status labels used on this page' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this tracker does, and does not, claim' })).toBeVisible();
  await expect(page.getByText('Unavailable means no public source-safe feed has been loaded yet.')).toBeVisible();
  await expect(page.getByText('A missing public feed is a public visibility gap, not evidence of wrongdoing.')).toBeVisible();
  await expect(page.getByText('Likely holder/publisher entries name the agencies most plausibly responsible for the data')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open related public-data surfaces' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open National Fuel Security' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Missing Data Scoreboard' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Australian Fuel Strategy Tracker' }).first()).toBeVisible();
  await expect(main.getByRole('link', { name: 'Open Food, Farms & Water' })).toBeVisible();
  await expect(main.getByText('Last reviewed: metadata pending').first()).toBeVisible();
  await expect(main.getByText('independent public-source prototype').first()).toBeVisible();
  await expect(page.getByText('It does not infer land parcels, storage capacity, refinery capacity, proponents, bids, contracts')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delivery evidence before delivery claims' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Six-port delivery pathway' })).toBeVisible();
  await expect(page.getByText('The six-port list is public context. It is not itself a project-status, capacity, land-parcel or approval dataset.')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Brisbane' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Townsville' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Mackay' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Gladstone' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Abbot Point' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Bundaberg' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AFIP and private-sector proposal status' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Submission counts' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Proponent names' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'State-owned land and industrial fuel hubs' })).toBeVisible();
  await expect(page.getByText('A public statement that an audit is underway is not the same as a reusable land-register dataset.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Storage and refining project pathway' })).toBeVisible();
  await expect(page.getByText('This tracker does not derive storage or refinery capacity from broader production datasets.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Taroom Trough and approvals pathway' })).toBeVisible();
  await expect(page.getByText('The tracker does not infer production volume, approval completion, timelines or fuel-security impact')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delivery blockers matrix' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Queensland still needs to publish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How this connects to national fuel strategy' })).toBeVisible();
  await expect(page.getByText('No land parcel, capacity, proponent, bid, contract, approval-completion or operational fuel-holding value is inferred.')).toBeVisible();
});

test('defence procurement watch keeps procurement facts source-gated', async ({ page }) => {
  await page.goto('/ui_kits/defence-procurement-watch/index.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { name: 'Defence procurement watch' })).toBeVisible();
  await expect(main.getByText('independent public-source prototype').first()).toBeVisible();
  await expect(page.getByText('It does not infer contracts, prices, suppliers, delivery dates')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Procurement evidence before procurement claims' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="pathway-h"]').getByRole('heading', { name: 'Procurement pathway' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Japan/Australia warship procurement pathway' })).toBeVisible();
  await expect(page.getByText('No Japan/Australia supplier pathway is asserted.')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="contract-h"]').getByRole('heading', { name: 'Contract and delivery status' })).toBeVisible();
  await expect(page.getByText('Media discussion, political commentary or broad procurement interest is not treated as a contract row.')).toBeVisible();
  const contractSection = page.locator('section[aria-labelledby="contract-h"]');
  await expect(contractSection.getByRole('cell', { name: 'Contract value' })).toBeVisible();
  await expect(contractSection.getByRole('cell', { name: 'Delivery schedule', exact: true })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="industry-h"]').getByRole('heading', { name: 'Industry content and manufacturing dependency' })).toBeVisible();
  await expect(page.getByText('No supplier, workshare, sustainment or workforce commitment is asserted.')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="logistics-h"]').getByRole('heading', { name: 'Naval logistics and fuel implication' })).toBeVisible();
  await expect(page.getByText('Procurement discussion is not itself a fuel/logistics metric.')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="boundary-h"]').getByRole('heading', { name: 'Public/private defence data boundary' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What government still needs to publish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How this connects to the national dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Defence Posture' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Strategic Resources' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Fuel Strategy' })).toBeVisible();
  await expect(page.getByText('No procurement fact is filled from media discussion')).toBeVisible();
});

test('Brisbane 2032 readiness keeps Olympic delivery data source-gated', async ({ page }) => {
  await page.goto('/ui_kits/brisbane-2032-readiness-dashboard/index.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { name: 'Brisbane 2032 readiness' })).toBeVisible();
  await expect(main.getByText('independent public-source prototype').first()).toBeVisible();
  await expect(page.getByText('It does not infer venue delivery, project status, costs, transport capacity')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Readiness evidence before readiness claims' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Existing public indicators used only as context' })).toBeVisible();
  await expect(page.getByText('none of them is treated as a Brisbane 2032 readiness value')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="infra-h"]').getByRole('heading', { name: 'Infrastructure and venue delivery' })).toBeVisible();
  await expect(page.getByText('A venue announcement is not the same as a machine-readable delivery tracker.')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Major venue delivery' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Project cost visibility' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="transport-h"]').getByRole('heading', { name: 'Transport and movement capacity' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Passenger movement capacity' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="accommodation-h"]').getByRole('heading', { name: 'Accommodation and tourism pressure' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Hotel room supply' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="power-fuel-h"]').getByRole('heading', { name: 'Power, fuel and supply-chain readiness' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Emergency fuel logistics' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="safety-h"]').getByRole('heading', { name: 'Public safety and emergency logistics' })).toBeVisible();
  await expect(page.getByText('safe aggregate readiness indicators, not sensitive operational detail')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="blockers-h"]').getByRole('heading', { name: 'Brisbane 2032 delivery blockers matrix' })).toBeVisible();
  await expect(page.getByText('No numeric score, official risk rating or fake readiness model is added.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What government still needs to publish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How this connects to the national dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Infrastructure' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Power Grid' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open National Fuel Security' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Housing Pressure' })).toBeVisible();
  await expect(page.getByText('No Brisbane 2032 value is filled from announcements')).toBeVisible();
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
  await expect(page.getByRole('link', { name: 'Open Defence Procurement Watch' })).toBeVisible();
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
  await expect(page.getByRole('link', { name: 'Open Defence Procurement Watch' })).toBeVisible();
  await expect(page.getByText('Budget, public assets, alliances and readiness are separate fields.')).toBeVisible();
  await expect(page.getByText('Defence spending as share of GDP')).toBeVisible();
  await expect(page.getByText('Quad').first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Diplomatic partnership, not a formal alliance' })).toBeVisible();
  await expect(page.getByText('Unavailable').first()).toBeVisible();
});
