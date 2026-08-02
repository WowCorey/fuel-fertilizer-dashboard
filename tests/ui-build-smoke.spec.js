const { test, expect } = require('@playwright/test');

test('local React bundle deploys preserved copyright and MIT licence notices', async ({ request }) => {
  const vendor = await request.get('/ui_kits/shared/react-vendor.js');
  const licences = await request.get('/ui_kits/shared/THIRD_PARTY_LICENSES.txt');
  expect(vendor.ok()).toBeTruthy();
  expect(licences.ok()).toBeTruthy();
  const vendorText = await vendor.text();
  const licenceText = await licences.text();
  expect(vendorText).toContain('react.production.min.js');
  expect(vendorText).toContain('react-dom.production.min.js');
  expect(vendorText).toContain('licensed under the MIT license');
  expect(licenceText).toContain('React 18.3.1');
  expect(licenceText).toContain('ReactDOM 18.3.1');
  expect(licenceText).toContain('Permission is hereby granted, free of charge');
  expect(licenceText).toContain('Modernizr 3.0.0pre (Custom Build) | MIT');
});
