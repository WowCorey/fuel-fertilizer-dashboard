const { test, expect } = require('@playwright/test');
const { siteUrl } = require('./site-target');

const fuelPath = siteUrl('/ui_kits/fuel-dashboard/index.html');

async function waitForFuelReady(page) {
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('.loading-wrap')).toHaveCount(0);
  await expect(page.locator('footer.site-footer')).toBeVisible();
}

function publishedRefreshV2(overrides = {}) {
  return {
    schema: 'fuel_resilience_refresh_status.v2',
    status: 'success',
    publication_state: 'published',
    refreshed_at: '2026-08-02T16:00:00+00:00',
    source_data_refreshed_at: '2026-08-02T16:00:00+00:00',
    workflow: 'Weekly data refresh',
    run_id: '12345',
    run_attempt: '2',
    ref: 'refs/heads/main',
    branch: 'main',
    workflow_input_sha: '1'.repeat(40),
    output_commit_sha: '2'.repeat(40),
    output_commit_pushed: true,
    ...overrides,
  };
}

async function openFuelWithRefreshMarker(page, marker) {
  await page.route('**/data/last_successful_refresh.json', route => route.fulfill({ json: marker }));
  await page.goto(fuelPath);
  await waitForFuelReady(page);
  return {
    header: page.getByLabel('Refresh status'),
    footer: page.locator('.site-footer__base'),
  };
}

test('dashboard headers and footers keep legacy v1 refresh markers readable', async ({ page }) => {
  const ui = await openFuelWithRefreshMarker(page, {
    schema: 'fuel_resilience_refresh_status.v1',
    status: 'success',
    refreshed_at: '2026-08-02T16:00:00+00:00',
    workflow: 'Weekly data refresh',
    run_id: '12345',
    run_attempt: '1',
  });
  await expect(ui.header).toHaveText('Refreshed 02 Aug 2026');
  await expect(ui.footer).toContainText('Site refresh: 02 Aug 2026');
});

test('dashboard headers and footers fail closed for prepared v2 refresh markers', async ({ page }) => {
  const ui = await openFuelWithRefreshMarker(page, publishedRefreshV2({
    status: 'pending_publication',
    publication_state: 'prepared',
    output_commit_sha: null,
    output_commit_pushed: false,
  }));
  await expect(ui.header).toHaveText('Refresh status unavailable');
  await expect(ui.footer).toContainText('Site refresh: Refresh status unavailable');
  await expect(ui.header).not.toContainText('Refreshed 02 Aug 2026');
  await page.goto(siteUrl('/'));
  await expect(page.locator('#refresh-date')).toHaveText('unavailable');
});

test('dashboard headers and footers render finalized and pushed v2 refresh markers', async ({ page }) => {
  const ui = await openFuelWithRefreshMarker(page, publishedRefreshV2());
  await expect(ui.header).toHaveText('Refreshed 02 Aug 2026');
  await expect(ui.footer).toContainText('Site refresh: 02 Aug 2026');
  await page.goto(siteUrl('/'));
  await expect(page.locator('#refresh-date')).toContainText('published output marker; deployment not proven');
});

test('dashboard headers and footers reject unknown refresh marker schemas', async ({ page }) => {
  const ui = await openFuelWithRefreshMarker(page, {
    schema: 'fuel_resilience_refresh_status.v99',
    status: 'success',
    refreshed_at: '2026-08-02T16:00:00+00:00',
  });
  await expect(ui.header).toHaveText('Refresh status unavailable');
  await expect(ui.footer).toContainText('Site refresh: Refresh status unavailable');
});

test('homepage labels committed refresh evidence without claiming deployment', async ({ page, request }) => {
  const marker = await (await request.get(siteUrl('/data/last_successful_refresh.json'))).json();
  await page.goto(siteUrl('/'));
  const status = page.locator('#refresh-badge');
  await expect(status).toContainText('Recorded source refresh:');
  if (marker.schema === 'fuel_resilience_refresh_status.v2') {
    await expect(status).toContainText('published output marker; deployment not proven');
  } else {
    await expect(status).toContainText('legacy marker; output publication unverified');
  }
  await expect(status).toContainText('Programmatic refresh:');
  await expect(status).toContainText('Manual public-source snapshots are labelled where used');
  await expect(status).not.toContainText('Last deployed:');
});
