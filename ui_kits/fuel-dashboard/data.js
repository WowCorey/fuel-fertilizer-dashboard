// data.js — thin loader for the fuel dashboard.
//
// Defers to window.FR.load() (ui_kits/shared/data-loader.js). Series ids
// below map directly to data/sources.yml entries. Each file has the same
// envelope schema — see scripts/fetch_data.py for the contract.
//
// No hand-keyed numbers live in this file. When an envelope's status is
// not "ok" the shared MetricCard / ChartCard render a "Source unavailable"
// placeholder.
window.FUEL_SERIES = [
  'aps_monthly',
  'abs_petroleum_imports',
  'abs_petroleum_imports_yoy',
  'aus_retail_fuel_multistate',
  'aus_retail_fuel_multistate_diesel',
  'aus_retail_fuel_multistate_premium95',
  'aus_retail_fuel_multistate_e10',
  'aip_tgp',
  'iea_90day',
];
