// data-loader.js — fetches normalised JSON from data/generated and data/manual
//
// Each dashboard calls window.FR.load(['series_a', 'series_b', ...]) and gets
// back a Promise<{ series_a: {...}, series_b: {...} }>. The loader first tries
// data/generated/<id>.json (fresh pull from scripts/fetch_data.py) and falls
// back to data/manual/<id>.json (hand-keyed). If neither exists it returns a
// synthetic "unavailable" envelope so the UI can render a placeholder card.
//
// JSON schema (see scripts/fetch_data.py):
//   {
//     series_id, source_id, source_name, source_url, unit,
//     retrieved_at (ISO), last_data_point (YYYY-MM-DD | null),
//     values: [{t, v}], notes, status ("ok"|"unavailable"),
//     manual_entry: bool
//   }

(function(){
  // Repo-relative paths. The dashboards live at ui_kits/<name>/index.html
  // so the data/ dir is two levels up.
  const GEN_BASE = '../../data/generated/';
  const MAN_BASE = '../../data/manual/';

  async function tryFetch(url) {
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  async function loadOne(id) {
    const gen = await tryFetch(GEN_BASE + id + '.json');
    if (gen && gen.status === 'ok') return gen;
    const man = await tryFetch(MAN_BASE + id + '.json');
    if (man) return man;
    return {
      series_id: id,
      source_id: id,
      source_name: id,
      source_url: '',
      unit: '',
      retrieved_at: null,
      last_data_point: null,
      values: [],
      notes: 'No JSON file found in data/generated/ or data/manual/.',
      status: 'unavailable',
      manual_entry: false,
    };
  }

  async function load(ids) {
    const entries = await Promise.all(ids.map(async id => [id, await loadOne(id)]));
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

  // Utility: "YYYY-MM" or "YYYY-MM-DD" -> "Mon YY"
  function fmtMonth(t) {
    if (!t) return '';
    const [y, m] = t.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const mi = parseInt(m, 10) - 1;
    if (mi < 0 || mi > 11) return t;
    return `${months[mi]} ${String(y).slice(-2)}`;
  }

  // Utility: build a source line from an envelope.
  function sourceLine(env) {
    if (!env) return '';
    const ret = env.retrieved_at ? ` Retrieved ${fmtRetrieved(env.retrieved_at)}.` : '';
    const last = env.last_data_point ? ` Latest data point: ${env.last_data_point}.` : '';
    return `Source: ${env.source_name}.${last}${ret}`;
  }

  window.FR = { load, loadOne, fmtRetrieved, fmtMonth, sourceLine };
})();
