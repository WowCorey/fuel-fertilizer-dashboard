const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const loaderSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'ui_kits', 'shared', 'data-loader.js'),
  'utf8',
);

function publishedV2(overrides = {}) {
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

function loadWithMarker(marker) {
  const context = vm.createContext({
    window: {},
    fetch: async () => ({
      ok: true,
      json: async () => marker,
    }),
  });
  vm.runInContext(loaderSource, context, { filename: 'data-loader.js' });
  return context.window.FR;
}

test('legacy v1 refresh markers remain readable', async () => {
  const marker = {
    schema: 'fuel_resilience_refresh_status.v1',
    status: 'success',
    refreshed_at: '2026-08-02T16:00:00+00:00',
    workflow: 'Weekly data refresh',
    run_id: '12345',
    run_attempt: '1',
  };
  const fr = loadWithMarker(marker);
  const loaded = await fr.loadRefreshStatus();

  assert.equal(loaded.schema, marker.schema);
  assert.equal(loaded.status, 'success');
  assert.equal(fr.isPublishedRefreshStatus(loaded), true);
  assert.equal(fr.fmtRefreshStatus(loaded), '02 Aug 2026');
});

test('prepared v2 markers fail closed', async () => {
  const fr = loadWithMarker(publishedV2({
    status: 'pending_publication',
    publication_state: 'prepared',
    output_commit_sha: null,
    output_commit_pushed: false,
  }));
  const loaded = await fr.loadRefreshStatus();

  assert.equal(loaded.status, 'unavailable');
  assert.equal(fr.isPublishedRefreshStatus(loaded), false);
  assert.equal(fr.fmtRefreshStatus(loaded), 'Refresh status unavailable');
});

test('finalized and pushed v2 markers are readable', async () => {
  const marker = publishedV2();
  const fr = loadWithMarker(marker);
  const loaded = await fr.loadRefreshStatus();

  assert.equal(loaded.schema, marker.schema);
  assert.equal(loaded.publication_state, 'published');
  assert.equal(loaded.output_commit_sha, '2'.repeat(40));
  assert.equal(fr.isPublishedRefreshStatus(loaded), true);
  assert.equal(fr.fmtRefreshStatus(loaded), '02 Aug 2026');
});

test('published v2 markers without push proof fail closed', async () => {
  const fr = loadWithMarker(publishedV2({ output_commit_pushed: false }));
  const loaded = await fr.loadRefreshStatus();

  assert.equal(loaded.status, 'unavailable');
  assert.equal(fr.isPublishedRefreshStatus(loaded), false);
});

test('incomplete published v2 markers fail closed', async () => {
  const marker = publishedV2();
  delete marker.output_commit_sha;
  const fr = loadWithMarker(marker);
  const loaded = await fr.loadRefreshStatus();

  assert.equal(loaded.status, 'unavailable');
  assert.equal(fr.isPublishedRefreshStatus(loaded), false);
});

test('unknown refresh marker schemas remain unavailable', async () => {
  const fr = loadWithMarker({
    schema: 'fuel_resilience_refresh_status.v99',
    status: 'success',
    refreshed_at: '2026-08-02T16:00:00+00:00',
  });
  const loaded = await fr.loadRefreshStatus();

  assert.equal(loaded.schema, null);
  assert.equal(loaded.status, 'unavailable');
  assert.equal(fr.isPublishedRefreshStatus(loaded), false);
  assert.equal(fr.fmtRefreshStatus(loaded), 'Refresh status unavailable');
});
