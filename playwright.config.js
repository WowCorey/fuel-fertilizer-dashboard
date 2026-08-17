const { defineConfig, devices } = require('@playwright/test');

const deployedSiteBaseUrl = process.env.PLAYWRIGHT_SITE_BASE_URL?.trim();
const localBaseUrl = 'http://127.0.0.1:4173';

module.exports = defineConfig({
  timeout: 30_000,
  use: {
    baseURL: deployedSiteBaseUrl || localBaseUrl,
    trace: 'retain-on-failure',
  },
  webServer: deployedSiteBaseUrl
    ? undefined
    : {
        command: 'python -m http.server 4173',
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 20_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
