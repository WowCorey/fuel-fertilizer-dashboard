// data-loader.js - fetches normalised JSON from data/generated and data/manual
//
// Each dashboard calls window.FR.load(['series_a', 'series_b', ...]) and gets
// back a Promise<{ series_a: {...}, series_b: {...} }>. The loader uses
// data/source_manifest.json to avoid expected 404 probes for manual sources.
// If the manifest is unavailable it falls back to generated-then-manual lookup.
//
// JSON schema (see scripts/validate_data.py):
//   {
//     series_id, source_id, source_name, source_url, unit,
//     retrieved_at (ISO | null), stub_created_at (ISO | optional),
//     last_data_point (YYYY-MM-DD | null), values: [{t, v}], notes,
//     status ("ok"|"unavailable"), manual_entry: bool
//   }

(function(){
  // Repo-relative paths. The dashboards live at ui_kits/<name>/index.html
  // so the data/ dir is two levels up.
  const GEN_BASE = '../../data/generated/';
  const MAN_BASE = '../../data/manual/';
  const MANIFEST_URL = '../../data/source_manifest.json';
  let manifestPromise = null;

  async function tryFetch(url) {
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  function sourcePath(dir, id) {
    return (dir === 'generated' ? GEN_BASE : MAN_BASE) + id + '.json';
  }

  async function loadManifest() {
    if (!manifestPromise) {
      manifestPromise = tryFetch(MANIFEST_URL).then(doc => (
        doc && doc.schema === 'fuel_resilience_source_manifest.v1' ? doc : null
      ));
    }
    return manifestPromise;
  }

  function attachMeta(env, meta) {
    if (env && meta) env._meta = meta;
    return env;
  }

  function unavailableEnvelope(id, meta, notes) {
    return attachMeta({
      series_id: id,
      source_id: id,
      source_name: meta?.human_name || id,
      source_url: meta?.canonical_url || '',
      unit: '',
      retrieved_at: null,
      last_data_point: null,
      values: [],
      notes: notes || 'No JSON file found in data/generated/ or data/manual/.',
      status: 'unavailable',
      manual_entry: meta?.fetch === 'manual',
    }, meta);
  }

  async function loadOne(id, manifest) {
    const meta = manifest?.sources?.[id] || null;
    if (meta) {
      const dirs = meta.preferred_dir === 'generated'
        ? ['generated', 'manual']
        : ['manual', 'generated'];
      for (const dir of dirs) {
        if (dir === 'generated' && !meta.has_generated) continue;
        if (dir === 'manual' && !meta.has_manual) continue;
        const env = await tryFetch(sourcePath(dir, id));
        if (env) return attachMeta(env, meta);
      }
      return unavailableEnvelope(id, meta);
    }

    const gen = await tryFetch(GEN_BASE + id + '.json');
    if (gen) return gen;
    const man = await tryFetch(MAN_BASE + id + '.json');
    if (man) return man;
    return unavailableEnvelope(id, null);
  }

  async function load(ids) {
    const manifest = await loadManifest();
    const entries = await Promise.all(ids.map(async id => [id, await loadOne(id, manifest)]));
    const out = {};
    for (const [id, val] of entries) out[id] = val;
    return out;
  }

  // Utility: format a retrieved_at ISO string for display.
  function fmtRetrieved(iso) {
    if (!iso) return 'unknown';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const dd = String(d.getUTCDate()).padStart(2,'0');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${dd} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }

  function verifiedEnvelopes(data) {
    return Object.values(data || {}).filter(env => (
      env && env.status === 'ok' && env.retrieved_at
    ));
  }

  function parseDateish(value) {
    if (!value) return null;
    const text = String(value);
    const d = text.length === 7 ? new Date(text + '-01T00:00:00Z') : new Date(text + 'T00:00:00Z');
    return isNaN(d) ? null : d;
  }

  const STALE_GRACE_DAYS = { daily: 7, weekly: 21, monthly: 75, quarterly: 140, annual: 460 };

  function daysOld(env) {
    const d = parseDateish(env?.last_data_point);
    if (!d) return null;
    return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
  }

  function freshness(env) {
    const mode = env?._meta?.fetch;
    const cadence = env?._meta?.update_cadence;
    if (!env || env.status !== 'ok') {
      return { state: 'awaiting', label: 'Awaiting source', daysOld: null };
    }
    if (mode === 'derived') {
      return { state: 'derived', label: 'Derived', daysOld: daysOld(env) };
    }
    const age = daysOld(env);
    const grace = STALE_GRACE_DAYS[cadence];
    if (grace != null && age != null && age > grace) {
      return { state: 'stale', label: `Verified, ${age} days old`, daysOld: age };
    }
    return { state: 'verified', label: 'Verified', daysOld: age };
  }

  function coverage(data) {
    const envs = Object.values(data || {});
    const out = { total: envs.length, verified: 0, stale: 0, awaiting: 0, derived: 0, programmatic: 0, manual: 0 };
    for (const env of envs) {
      const f = freshness(env);
      if (f.state === 'verified') out.verified++;
      if (f.state === 'stale') out.stale++;
      if (f.state === 'awaiting') out.awaiting++;
      if (f.state === 'derived') out.derived++;
      if (env?._meta?.fetch === 'programmatic') out.programmatic++;
      if (env?.manual_entry) out.manual++;
    }
    return out;
  }

  function latestVerifiedRetrieved(data) {
    const dates = verifiedEnvelopes(data).map(env => env.retrieved_at).filter(Boolean).sort();
    return dates.length ? dates[dates.length - 1] : null;
  }

  function fmtVerifiedUpdated(iso) {
    return iso ? fmtRetrieved(iso) : 'No verified data loaded yet';
  }

  // Utility: "YYYY-MM" or "YYYY-MM-DD" -> "Mon YY"
  function fmtMonth(t) {
    if (!t) return '';
    const [y, m] = t.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const mi = parseInt(m, 10) - 1;
    if (mi < 0 || mi > 11) return t;
    return `${months[mi]} ${String(y).slice(-2)}`;
  }

  // Utility: build a source line from an envelope. Includes source_id so a
  // reader can cross-reference against data/sources.yml.
  function sourceLine(env) {
    if (!env) return '';
    const sid = env.source_id ? ` [${env.source_id}]` : '';
    if (env.status !== 'ok') {
      return `Source unavailable - awaiting verified data from ${env.source_name}${sid}.`;
    }
    const ret = env.retrieved_at ? ` Retrieved ${fmtRetrieved(env.retrieved_at)}.` : '';
    const last = env.last_data_point ? ` Latest data point: ${env.last_data_point}.` : '';
    return `Source: ${env.source_name}${sid}.${last}${ret}`;
  }

  window.FR = {
    load,
    loadOne,
    loadManifest,
    fmtRetrieved,
    fmtVerifiedUpdated,
    fmtMonth,
    latestVerifiedRetrieved,
    sourceLine,
    verifiedEnvelopes,
    freshness,
    coverage,
  };
})();
