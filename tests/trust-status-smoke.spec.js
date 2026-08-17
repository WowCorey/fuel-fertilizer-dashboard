const { test, expect } = require('@playwright/test');
const { siteUrl } = require('./site-target');

test('Trust Status v2 renders generated repository evidence without external React', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));

  const response = await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole('heading', { name: 'Trust Status', exact: true })).toBeVisible();
  await expect(page.getByText('Not an official government dashboard.', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source inventory' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Validation and review debt' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Link health' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Workflow evidence' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Confidence bands and trust rules' })).toBeVisible();
  await expect(page.getByText('Total registered sources', { exact: true })).toBeVisible();
  await expect(page.getByText('Programmatic feeds', { exact: true })).toBeVisible();
  await expect(page.getByText('Manual snapshots', { exact: true })).toBeVisible();
  await expect(page.getByText('Unavailable / source-gated', { exact: true })).toBeVisible();
  await expect(page.locator('#claim-boundary')).toContainText('not a certification');
  await expect(page.locator('#claim-boundary')).toContainText('not a security audit');
  await expect(page.locator('#claim-boundary')).toContainText('not a risk score');
  await expect(page.locator('#overall-badge')).not.toHaveText('Loading');
  await expect(page.locator('#source-metrics .metric-card')).toHaveCount(8);
  await expect(page.locator('script[src*="unpkg"]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText("There isn't a GitHub Pages site here.");
  expect(pageErrors).toEqual([]);
  expect(consoleErrors.filter(text => !text.includes('favicon'))).toEqual([]);
});

test('Trust Status v2 separates workflow configuration from run conclusions', async ({ page }) => {
  await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));
  await expect(page.getByText('This section proves that controls are configured in the repository. It does not claim the conclusion of the latest CI or deployment run.')).toBeVisible();
  const workflowCards = page.locator('#workflow-grid .workflow-card');
  await expect(workflowCards).toHaveCount(4);
  await expect(workflowCards.first()).toContainText('Configured');
});

test('Trust Status labels the committed refresh marker without inventing deployment evidence', async ({ page, request }) => {
  const manifest = await (await request.get(siteUrl('/data/trust_status_manifest.json'))).json();
  await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));
  const refresh = page.locator('#refresh-list');
  await expect(refresh).toContainText('Workflow input SHA');
  await expect(refresh).toContainText('Output commit SHA');
  if (manifest.latest_refresh.marker_schema === 'fuel_resilience_refresh_status.v2') {
    await expect(refresh).toContainText('Published');
    await expect(refresh).toContainText(manifest.latest_refresh.workflow_input_sha);
    await expect(refresh).toContainText(manifest.latest_refresh.output_commit_sha);
    await expect(refresh).toContainText('not proof of the latest deployed commit');
  } else {
    await expect(refresh).toContainText('Legacy Unverified');
    await expect(refresh).toContainText('Not recorded');
    await expect(page.locator('#refresh-summary')).toContainText('does not prove the output commit or deployed commit');
  }
});

test('Trust Status renders v2 input and pushed output commits as different evidence', async ({ page }) => {
  await page.route('**/data/trust_status_manifest.json', async route => {
    const response = await route.fetch();
    const manifest = await response.json();
    manifest.latest_refresh = {
      status: 'success',
      marker_schema: 'fuel_resilience_refresh_status.v2',
      publication_state: 'published',
      refreshed_at: '2026-08-02T16:00:00+00:00',
      source_data_refreshed_at: '2026-08-02T16:00:00+00:00',
      workflow: 'Weekly data refresh',
      run_id: '12345',
      run_attempt: '2',
      ref: 'refs/heads/main',
      branch: 'main',
      reported_git_sha: '1'.repeat(40),
      workflow_input_sha: '1'.repeat(40),
      output_commit_sha: '2'.repeat(40),
      output_commit_pushed: true,
      sha_semantics: 'The output is an earlier pushed commit, not the later marker commit and not proof of the latest deployed commit.',
      evidence_path: 'data/last_successful_refresh.json'
    };
    await route.fulfill({ response, json: manifest });
  });
  await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));
  const refresh = page.locator('#refresh-list');
  await expect(refresh).toContainText('Published');
  await expect(refresh).toContainText('1'.repeat(40));
  await expect(refresh).toContainText('2'.repeat(40));
  await expect(refresh).toContainText('Output commit pushed');
  await expect(refresh).toContainText('Yes');
  await expect(refresh).toContainText('not proof of the latest deployed commit');
});

test('Trust Status v2 exposes a visible unavailable state without fallback metrics', async ({ page }) => {
  await page.route('**/data/trust_status_manifest.json', route => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));

  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('#overall-badge')).toHaveText('Unavailable');
  await expect(page.locator('#overall-value')).toHaveText('No generated trust evidence loaded');
  await expect(page.locator('#source-metrics .metric-card')).toHaveCount(0);
});

test('Trust Status v2 does not coerce missing counts to zero', async ({ page }) => {
  await page.route('**/data/trust_status_manifest.json', async route => {
    const response = await route.fetch();
    const manifest = await response.json();
    manifest.source_inventory.modes.total = null;
    await route.fulfill({ response, json: manifest });
  });
  await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));

  const totalCard = page.locator('#source-metrics .metric-card').filter({ hasText: 'Total registered sources' });
  await expect(totalCard.locator('.metric-card__value')).toHaveText('Unavailable');
});

test('Trust Status v2 renders classified link category IDs literally', async ({ page }) => {
  await page.route('**/data/trust_status_manifest.json', async route => {
    const response = await route.fetch();
    const manifest = await response.json();
    manifest.link_health = {
      status: 'available',
      generated_at: '2026-08-02T00:00:00+00:00',
      advisory: true,
      repair_required_count: 0,
      registered_source_count: 2,
      classified_source_count: 2,
      checker_failure_count: 0,
      classification_complete: true,
      categories: { access_blocked: 2 },
      claim_boundary: 'A blocked request is not proof that a dataset is unavailable.',
      evidence_path: 'data/source_link_health.json'
    };
    await route.fulfill({ response, json: manifest });
  });
  await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));

  await expect(page.locator('#link-list span').filter({ hasText: 'access_blocked' })).toHaveText('access_blocked');
  await expect(page.locator('#link-list')).not.toContainText('Access Blocked');
});

test('Trust Status v2 has a usable narrow layout and keyboard skip link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(siteUrl('/ui_kits/trust-status-dashboard/index.html'));
  await expect(page.locator('#overall-badge')).not.toHaveText('Loading');

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Trust status navigation' })).toBeVisible();
});
