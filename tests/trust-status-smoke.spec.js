const { test, expect } = require('@playwright/test');

test('Trust Status v2 renders generated repository evidence without external React', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));

  const response = await page.goto('/ui_kits/trust-status-dashboard/index.html');
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
  await page.goto('/ui_kits/trust-status-dashboard/index.html');
  await expect(page.getByText('This section proves that controls are configured in the repository. It does not claim the conclusion of the latest CI or deployment run.')).toBeVisible();
  const workflowCards = page.locator('#workflow-grid .workflow-card');
  await expect(workflowCards).toHaveCount(4);
  await expect(workflowCards.first()).toContainText('Configured');
});

test('Trust Status v2 exposes a visible unavailable state without fallback metrics', async ({ page }) => {
  await page.route('**/data/trust_status_manifest.json', route => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.goto('/ui_kits/trust-status-dashboard/index.html');

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
  await page.goto('/ui_kits/trust-status-dashboard/index.html');

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
  await page.goto('/ui_kits/trust-status-dashboard/index.html');

  await expect(page.locator('#link-list span').filter({ hasText: 'access_blocked' })).toHaveText('access_blocked');
  await expect(page.locator('#link-list')).not.toContainText('Access Blocked');
});

test('Trust Status v2 has a usable narrow layout and keyboard skip link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ui_kits/trust-status-dashboard/index.html');
  await expect(page.locator('#overall-badge')).not.toHaveText('Loading');

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Trust status navigation' })).toBeVisible();
});
