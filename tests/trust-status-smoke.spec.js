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
  await expect(page.getByText('Not an official government dashboard.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source inventory' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Validation and review debt' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Link health' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Workflow evidence' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Confidence bands and trust rules' })).toBeVisible();
  await expect(page.getByText('Total registered sources')).toBeVisible();
  await expect(page.getByText('Programmatic feeds')).toBeVisible();
  await expect(page.getByText('Manual snapshots')).toBeVisible();
  await expect(page.getByText('Unavailable / source-gated')).toBeVisible();
  await expect(page.locator('#claim-boundary')).toContainText('not a certification');
  await expect(page.locator('#claim-boundary')).toContainText('not a security audit');
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
