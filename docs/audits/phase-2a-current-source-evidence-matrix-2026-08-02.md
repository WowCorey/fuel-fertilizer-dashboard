# Phase 2A Current-Source Evidence Matrix

**Project:** Fuel Resilience AU  
**Repository:** `WowCorey/fuel-fertilizer-dashboard`  
**Review date:** 2026-08-02 AEST  
**Scope:** Current official-source verification of the stale PM&C / Fuel Plan / DCCEEW national fuel-security cluster identified in Phase 1.

## Executive result

Phase 2A verified the national fuel-security cluster against the current official Australian Government sources and refreshed the corresponding repository envelopes.

The PM&C public-fuel-supply URL now redirects to the Australian Government Fuel Plan fuel-statistics page. That page remained at **Level 2** when reviewed and published current operational tables dated **28 July 2026** and **31 July 2026**.

This phase refreshed:

- 6 manual official-source envelopes;
- 3 product-specific derived envelopes;
- 9 stale warnings in the Phase 1 cluster, subject to confirmation by the next validator run.

No estimate, interpolation or media-derived value was introduced.

---

## 1. Source hierarchy used

### Primary operational source

**Australian Government Fuel Plan — Fuel statistics**  
Canonical current page: `https://fuelplan.gov.au/fuel-statistics`  
Repository compatibility URL: `https://www.pmc.gov.au/domestic-policy/fuel-supply-taskforce/public-information-fuel-supply`

The PM&C URL redirects to the Fuel Plan page. The current page states that data is compiled by the Department of Climate Change, Energy, the Environment and Water and provides:

- National Fuel Security Plan level;
- current fuel and crude-oil price context;
- national MSO days of coverage;
- MSO reserve volumes;
- four-week forward import volume;
- ships on water;
- retail stock-outs.

### Supporting stock source

**DCCEEW — Minimum stockholding obligation for liquid fuels: statistics**  
`https://www.dcceew.gov.au/energy/security/australias-fuel-security/minimum-stockholding-obligation/statistics`

The DCCEEW page confirms the quarterly comparator figures and explains that:

- regulated entities report Tuesday stock positions by Friday;
- weekly aggregate statistics are published on Saturday unless otherwise stated;
- compliance is based on volume held, not days of coverage;
- March-quarter 2026 average stocks were 1,592 ML petrol, 2,966 ML diesel and 833 ML jet fuel;
- March-quarter 2026 average days were 37 petrol, 32 diesel and 30 jet fuel.

### Jurisdictional cross-check

**WA Government — Weekly Fuel Update**  
`https://www.wa.gov.au/government/publications/fuel-security-wa-government-weekly-fuel-update`

The latest available WA update reviewed was dated 24 July 2026. It stated that statewide stock-outs remained low, supplies were stable for July and August, cargoes continued to arrive as planned and 20 million litres of WA strategic diesel stock were accessible across five locations. It did not publish a current exact statewide stock-out number in the HTML page or one-page update.

Therefore, the separate `wa_fuel_security_stockouts` numeric envelope was **not** refreshed in Phase 2A. Its current evidence problem is not source absence; it is that the newest official publication changed from a quantified statewide total to a qualitative statement.

---

## 2. Current-source evidence matrix

| Repository envelope | Current official evidence | Data date used | Repository value | Evidence decision |
|---|---|---:|---:|---|
| `pmc_fuel_security_level` | Fuel Plan page states Level 2 | Observed 2026-08-02 | 2 | Refreshed using observation date because no separate level-effective date is published |
| `pmc_mso_days_cover` | Petrol 43 days; diesel 39; jet fuel 34 | 2026-07-28 | 34 | Refreshed; display value remains the lowest product coverage |
| `pmc_mso_fuel_reserves` | Petrol 1,825 ML; diesel 3,640 ML; jet fuel 933 ML | 2026-07-28 | 6,398 ML | Refreshed; display value is the published product sum |
| `pmc_forward_import_orders` | At least 3.1 billion litres scheduled in next four weeks | Observed 2026-08-02 | 3.1 billion L | Refreshed; source publishes no separate date for this sentence |
| `pmc_tankers_on_water` | 6 crude tankers and 38 clean-product tankers | 2026-07-31 | 44 tankers | Refreshed; retained product split and equivalent-day fields |
| `pmc_retail_stockouts` | Australia: 52 petrol sites and 65 diesel sites | 2026-07-31 | 65 sites | Refreshed; display value remains national diesel stock-outs |
| `fuel_security_petrol_days_remaining` | Typed selection from current MSO parent | 2026-07-28 | 43 days | Derived envelope refreshed |
| `fuel_security_diesel_days_remaining` | Typed selection from current MSO parent | 2026-07-28 | 39 days | Derived envelope refreshed |
| `fuel_security_jet_days_remaining` | Typed selection from current MSO parent | 2026-07-28 | 34 days | Derived envelope refreshed |
| `wa_fuel_security_stockouts` | Latest WA update says stock-outs remain low but publishes no exact total | 2026-07-24 | Existing April figure not refreshed | Deferred for source-semantics decision |

---

## 3. Detailed verified values

### 3.1 National Fuel Security Plan level

Current official status observed on 2 August 2026:

- **Level 2 — National Fuel Security Plan**

The source does not attach a separate commencement or effective date to the level. The repository now records the page observation date and explicitly states this limitation rather than presenting a guessed effective date.

### 3.2 National MSO days of coverage

Official Fuel Plan table, data as at 28 July 2026:

| Product | Current days | March-quarter 2026 average |
|---|---:|---:|
| Petrol | 43 | 37 |
| Diesel | 39 | 32 |
| Jet fuel | 34 | 30 |

Repository display rule:

- `pmc_mso_days_cover.values[0].v` remains the lowest current product value: **34 days**.

This is a presentation rule, not an independent national reserve estimate. The product values remain available in typed `extra.fields` and in the three product-specific derived envelopes.

### 3.3 MSO reserve volumes

Official Fuel Plan table, data as at 28 July 2026:

| Product | Current volume | March-quarter 2026 average |
|---|---:|---:|
| Petrol | 1,825 ML | 1,592 ML |
| Diesel | 3,640 ML | 2,966 ML |
| Jet fuel | 933 ML | 833 ML |
| **Total** | **6,398 ML** | **5,391 ML** |

The source states that these figures include stocks in Australia and stocks on water in Australia’s exclusive economic zone.

### 3.4 Four-week forward import orders

The current Fuel Plan page states that **at least 3.1 billion litres** of crude, diesel, jet fuel and petrol are scheduled to arrive from overseas in the next four weeks.

The statement includes fuel:

- already on ships in transit;
- awaiting departure.

It excludes:

- domestic refinery supply, described on the page as around 20% of national supply;
- stocks already in Australia.

The sentence has no separate publication or data date. The repository therefore uses the official-page observation date and records the missing source date explicitly.

### 3.5 Ships on water

Official table, as at 31 July 2026:

| Cargo group | Tankers | Equivalent days |
|---|---:|---:|
| Crude oil | 6 | 12 |
| Clean refined products | 38 | 13 |
| **Total tankers** | **44** | Not summed |

Previous official comparison, as at 24 July 2026:

- crude oil: 7 tankers, equivalent to 16 days;
- clean refined products: 44 tankers, equivalent to 14 days.

The source defines clean products as diesel, jet fuel, petrol and blend stocks. The equivalent-day measures must not be added together because they refer to different product groups.

### 3.6 Retail stock-outs

Official table, data as at 31 July 2026:

| Jurisdiction | Petrol stock-outs | Petrol 7-day change | Diesel stock-outs | Diesel 7-day change |
|---|---:|---:|---:|---:|
| ACT | 1 | 0 | 1 | 0 |
| NSW | 16 | 0 | 19 | 0 |
| VIC | 5 | 0 | 8 | 0 |
| QLD | 16 | +6 | 19 | +5 |
| SA | 10 | -2 | 14 | -1 |
| TAS | 1 | 0 | 1 | 0 |
| NT | 0 | -3 | 0 | -3 |
| WA | 3 | +1 | 3 | 0 |
| **Australia** | **52** | **+2** | **65** | **+1** |

The table covers 8,118 sites nationally. The repository display value remains the national diesel stock-out count because that was the original dashboard series definition. Unlike the April source snapshot, the current table publishes national totals for both petrol and diesel.

---

## 4. Repository changes completed

### Manual envelopes refreshed

- `data/manual/pmc_fuel_security_level.json`
- `data/manual/pmc_mso_days_cover.json`
- `data/manual/pmc_mso_fuel_reserves.json`
- `data/manual/pmc_forward_import_orders.json`
- `data/manual/pmc_tankers_on_water.json`
- `data/manual/pmc_retail_stockouts.json`

### Derived envelopes refreshed

- `data/generated/fuel_security_petrol_days_remaining.json`
- `data/generated/fuel_security_diesel_days_remaining.json`
- `data/generated/fuel_security_jet_days_remaining.json`

### Provenance improvements included

- PM&C/Fuel Plan redirect relationship documented;
- observation-date treatment documented where the source publishes no data date;
- March-quarter comparator field names replaced the obsolete December-quarter names;
- MSO compliance-volume caveat added;
- current clean-product definition added;
- national petrol stock-out total added;
- national site coverage added;
- derived parent dates aligned with the current parent envelope.

---

## 5. Claims deliberately not made

Phase 2A does not claim that:

- days of coverage are the legal MSO compliance test;
- 6,398 ML is all fuel physically available to Australia;
- equivalent days for crude and clean products can be summed;
- scheduled four-week imports are guaranteed deliveries;
- all retail stations reporting a stock-out are completely without every fuel product;
- Level 2 commenced on the repository observation date;
- the latest WA weekly update contains a quantified statewide stock-out count;
- the full repository validation and browser suite passed after these connected-file updates.

---

## 6. Remaining decisions after Phase 2A

### A. WA stock-out envelope

Choose one governed treatment:

1. retain the last quantified April snapshot but label it historical and stale;
2. change the envelope to unavailable for current numeric reporting;
3. replace it with the national Fuel Plan WA petrol/diesel row;
4. split the concepts into:
   - WA Government qualitative weekly situation;
   - national Fuel Plan quantified WA stock-outs.

Option 4 is the cleanest because it preserves both official products without pretending they measure the same thing.

### B. Source canonicalisation

The old PM&C path remains useful as a compatibility URL but redirects to `fuelplan.gov.au/fuel-statistics`. Phase 2B should decide whether `data/sources.yml` stores:

- the current final canonical URL;
- the historical PM&C compatibility URL;
- or both as canonical and legacy URLs.

### C. Automated current-source extraction

The current Fuel Plan page is structured enough to investigate a cautious parser, but automation should not be added until:

- table headings and field labels are contract-tested;
- missing-section behaviour fails closed;
- observation dates are extracted separately for each section;
- free-text forward-order values are treated as a distinct fragile parser;
- a captured-source fixture is included for regression tests.

### D. Validation confirmation

The next validation run should confirm that the stale-warning count falls by nine. If it does not, the validator’s cadence or date-handling rules should be inspected rather than changing source dates merely to silence warnings.

---

## Phase 2A conclusion

The central national fuel-security evidence is no longer anchored to the April snapshot. Current official evidence now supports the project’s Level 2 status, MSO days, reserve volumes, forward import statement, ships-on-water count, national retail stock-outs and the three product-specific days-cover cards.

The main remaining credibility issue in this cluster is the separate WA numeric stock-out envelope, whose original metric is no longer published in the same form by the latest WA weekly update.
