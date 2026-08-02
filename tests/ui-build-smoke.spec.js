const { test, expect } = require('@playwright/test');
const { siteUrl } = require('./site-target');
const expectedSourceManifest = require('../data/source_manifest.json');
const expectedRouteRegistry = require('../data/site_routes.json');

const requiredPublicFiles = [
  '/data/source_manifest.json',
  '/data/trust_status_manifest.json',
  '/data/last_successful_refresh.json',
  '/data/site_routes.json',
  '/ui_kits/shared/react-vendor.js',
  '/ui_kits/shared/routes.generated.js',
  '/ui_kits/shared/THIRD_PARTY_LICENSES.txt',
];

test('required public manifests and local UI artifacts return HTTP 200', async ({ request }) => {
  for (const publicPath of requiredPublicFiles) {
    const response = await request.get(siteUrl(publicPath));
    expect(response.status(), publicPath).toBe(200);
  }

  const sourceManifest = await (await request.get(siteUrl('/data/source_manifest.json'))).json();
  const routeRegistry = await (await request.get(siteUrl('/data/site_routes.json'))).json();
  expect(Object.keys(sourceManifest.sources)).toHaveLength(Object.keys(expectedSourceManifest.sources).length);
  expect(routeRegistry.routes.filter(route => route.public)).toHaveLength(
    expectedRouteRegistry.routes.filter(route => route.public).length,
  );
});

test('local React bundle deploys preserved copyright and MIT licence notices', async ({ request }) => {
  const vendor = await request.get(siteUrl('/ui_kits/shared/react-vendor.js'));
  const licences = await request.get(siteUrl('/ui_kits/shared/THIRD_PARTY_LICENSES.txt'));
  expect(vendor.ok()).toBeTruthy();
  expect(licences.ok()).toBeTruthy();
  const vendorText = await vendor.text();
  const licenceText = await licences.text();
  expect(vendorText).toContain('react.production.min.js');
  expect(vendorText).toContain('react-dom.production.min.js');
  expect(vendorText).toContain('licensed under the MIT license');
  expect(vendorText).not.toContain('unpkg.com');
  expect(vendorText).not.toContain('react.development.js');
  expect(vendorText).not.toContain('react-dom.development.js');
  expect(licenceText).toContain('React 18.3.1');
  expect(licenceText).toContain('ReactDOM 18.3.1');
  expect(licenceText).toContain('Scheduler 0.23.2');
  expect(licenceText).toContain('Permission is hereby granted, free of charge');
  expect(licenceText).toContain('Modernizr 3.0.0pre (Custom Build) | MIT');
});
