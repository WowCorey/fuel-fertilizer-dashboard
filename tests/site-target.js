const configuredBaseUrl = process.env.PLAYWRIGHT_SITE_BASE_URL?.trim();

function normalizedBaseUrl() {
  if (!configuredBaseUrl) return null;
  const withSlash = configuredBaseUrl.endsWith('/') ? configuredBaseUrl : `${configuredBaseUrl}/`;
  const parsed = new URL(withSlash);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('PLAYWRIGHT_SITE_BASE_URL must use http or https');
  }
  return parsed;
}

const baseUrl = normalizedBaseUrl();

function siteUrl(pathname = '/') {
  if (!baseUrl) return pathname;
  if (/^https?:\/\//i.test(pathname)) return pathname;
  return new URL(pathname.replace(/^\/+/, ''), baseUrl).href;
}

module.exports = {
  configuredBaseUrl,
  siteUrl,
};
