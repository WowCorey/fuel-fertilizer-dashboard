# Phase 1 Repository and Pipeline Audit

**Project:** Fuel Resilience AU  
**Repository:** `WowCorey/fuel-fertilizer-dashboard`  
**Audit date:** 2026-08-02 AEST  
**Audited main commit before this report:** `93957932a49f66c7aa9b38f25e9c2d4c4939d157`  
**Latest audited refresh workflow run:** `30211934616` (`Weekly data refresh`, 2026-07-26 UTC)

## Executive conclusion

The project is alive, but unevenly alive.

The automated programmatic pipeline is still functioning and successfully refreshed the repository on 2026-07-26. The latest run wrote 55 generated or derived envelopes, rebuilt the source manifest, passed schema/data validation, wrote the refresh marker and committed 56 changed data files.

The weak layer is now the human-reviewed and source-governance layer:

- 27 freshness warnings remain after the latest successful refresh;
- 20 of those warnings are manual public-source envelopes;
- central fuel-security snapshot fields and their derived product-day cards are stale for their declared weekly cadence;
- the broad source-link diagnostic reports 73 errors, although many are anti-bot responses or publisher timeouts rather than proof that the underlying dataset is dead;
- public pages still contain placeholder review stamps with no defensible date;
- the existing Trust Status pull request is based on May data and has diverged from current `main`;
- several canonical URLs, internal documentation URLs and one blank source URL require repair;
- the frontend remains dependent on externally hosted React development bundles.

The right next move is not to add more dashboard surfaces. It is to repair source governance, refresh manual evidence, improve diagnostic reporting and consolidate the public trust layer.

---

## 1. Audit scope and method

This phase audited the connected GitHub repository and the latest accessible GitHub Actions refresh run. It covered:

- repository and route inventory;
- build, validation, refresh, deployment and manual-review workflows;
- source-registry and envelope architecture;
- latest refresh logs and validation warnings;
- source-link diagnostics;
- public metadata and dependency debt;
- open trust-layer work and repository hygiene.

This was a repository-side audit. It did **not** independently clone and execute the full project locally, because a local clone was not available in the audit environment. The latest refresh run verifies the data fetch and validation path, but this report does not claim that the latest `main` CI, Pages deployment or manual-review artifact was independently rerun during this audit.

---

## 2. Current baseline inventory

### Public surfaces

The UI build register contains **21 dashboard routes**. With the static homepage, the project has **22 public routes**.

Dashboard routes:

1. National status
2. National fuel security
3. Australian fuel strategy
4. Queensland fuel sovereignty
5. Resource value
6. State petroleum ledger
7. Strategic resources
8. Defence posture
9. Defence procurement
10. Fuel
11. Food, farms and water
12. Oil and production
13. Who pays what
14. AU economics
15. Housing and economic pressure
16. Manufacturing
17. Power grid
18. Infrastructure
19. Brisbane 2032 readiness
20. Employment and automation
21. Missing Data Scoreboard

### Source registry and data pipeline

The latest refresh run processed a registry of **218 sources**:

- 55 generated or derived envelopes were written;
- 163 sources were skipped because they were manual, unavailable by design or retained through a documented non-blocking fallback.

Core architecture remains sound:

- `data/sources.yml` — canonical source registry;
- `data/generated/` — programmatic and derived envelopes;
- `data/manual/` — human-entered public-source snapshots and unavailable stubs;
- `data/source_manifest.json` — browser loading manifest;
- `data/last_successful_refresh.json` — latest successful automated refresh marker;
- `scripts/fetch_data.py` — source fetch and transformation pipeline;
- `scripts/validate_data.py` — source/envelope/dashboard-reference validation;
- `scripts/review_due.py` — advisory manual-review report;
- `scripts/build_source_manifest.py` — manifest generator.

### Automation

Four primary workflows are present:

- `.github/workflows/ci.yml`
- `.github/workflows/refresh-data.yml`
- `.github/workflows/manual-data-review.yml`
- `.github/workflows/pages.yml`

Current CI checks compiled UI freshness, Python compilation, source/envelope validation, source-manifest consistency, unit tests and browser smoke tests.

---

## 3. What is healthy

### H-01 — The weekly programmatic refresh is operational

The 2026-07-26 run completed successfully. It:

- passed the blocking programmatic endpoint preflight;
- fetched and wrote 55 generated or derived files;
- retained the previous verified REMP envelope when its non-critical workbook timed out;
- created no unnecessary manual stubs;
- rebuilt `data/source_manifest.json`;
- passed `scripts/validate_data.py`;
- wrote the refresh marker;
- committed and pushed the updated data.

### H-02 — Fail-closed data semantics remain intact

The project still separates:

- programmatic data;
- manual data;
- derived data;
- unavailable/source-gated data.

Unavailable rows remain visible instead of being replaced with estimates. This is still the strongest design choice in the repository and must not be weakened during the reboot.

### H-03 — Programmatic fetch URLs are generally strong

The latest blocking preflight succeeded for the major machine-readable paths, including:

- Australian Petroleum Statistics through the data.gov.au CKAN endpoint;
- ABS SDMX endpoints;
- AIP terminal gate pricing;
- Queensland and WA retail-fuel sources;
- FRED/EIA price mirrors;
- RBA CSV/data pages;
- NOPTA ArcGIS endpoints;
- AEMO price-and-demand archives.

### H-04 — Route smoke coverage is broad

`tests/ui-smoke.spec.js` enumerates the homepage and all 21 dashboard routes. It checks route rendering, heading presence, refresh language, console errors and page-level content expectations.

---

## 4. Priority findings

### P0-01 — Manual evidence is materially stale

The latest successful validator run completed with **27 warnings**. Twenty are manual public-source envelopes.

This means the site can truthfully say the automated pipeline refreshed, but many important public claims still rely on older hand-reviewed snapshots.

#### Generated or derived warnings

| Envelope | Declared cadence |
|---|---:|
| `abs_food_beverage_employment` | quarterly |
| `abs_manufacturing_employment` | quarterly |
| `abs_population_growth_rate` | quarterly |
| `abs_population_quarterly` | quarterly |
| `fuel_security_diesel_days_remaining` | weekly |
| `fuel_security_jet_days_remaining` | weekly |
| `fuel_security_petrol_days_remaining` | weekly |

#### Manual warnings

| Envelope | Declared cadence |
|---|---:|
| `accc_nbn_broadband_speeds` | quarterly |
| `accc_petrol_gird_component` | quarterly |
| `accc_petrol_mogas95_component` | quarterly |
| `accc_petrol_other_costs_margins_component` | quarterly |
| `accc_petrol_tax_component` | quarterly |
| `aemo_coal_retirement_timeline` | quarterly |
| `aemo_generation_information_register` | quarterly |
| `aemo_nem_fuel_mix` | quarterly |
| `aemo_wem_summary` | quarterly |
| `dcceew_electricity_emissions` | quarterly |
| `fuel_security_payment` | quarterly |
| `pmc_forward_import_orders` | weekly |
| `pmc_fuel_security_level` | weekly |
| `pmc_mso_days_cover` | weekly |
| `pmc_mso_fuel_reserves` | weekly |
| `pmc_retail_stockouts` | weekly |
| `pmc_tankers_on_water` | weekly |
| `resource_domestic_gas_prices_accc` | quarterly |
| `resource_lng_netback_accc` | monthly |
| `wa_fuel_security_stockouts` | weekly |

**Impact:** The most prominent fuel-security summary can appear recently refreshed while its manual national snapshot and derived days-cover inputs are outside cadence.

**Required action:** Phase 2 must review every warning against the current publisher source, then update, reclassify cadence, replace the source or document why the publication itself has not advanced.

---

### P0-02 — Source-link health is degraded but poorly classified

The latest broad canonical/manual link diagnostic reported **73 errors**. This step is advisory and correctly does not block a valid data refresh. However, its output mixes several very different conditions:

- publisher anti-bot responses (`403`);
- publisher or network timeouts;
- genuinely obsolete URLs (`404`);
- inaccessible PDFs;
- blank URLs;
- internal project documentation links that no longer exist.

Representative definite repair candidates include:

- old ACCC petroleum-monitoring URLs returning `404`;
- the ABS residential dwelling canonical page returning `404`;
- `ai_rollout_timeline_context` and `automation_exposure_context` pointing to a missing `docs/employment-automation-methodology.md` page;
- `au_data_centre_capacity_register` carrying a blank canonical URL, which causes a `MissingSchema` error.

Other failures, such as AEMO `403`, BOM `403`, Defence timeouts and DCCEEW timeouts, do not necessarily mean the source is invalid. In several cases the machine fetch endpoint still works while the human-facing canonical page rejects the Actions runner.

**Impact:** A single “73 errors” number is too noisy to guide repairs and cannot safely be exposed as source failure.

**Required action:** Replace the flat diagnostic with machine-readable categories:

1. confirmed broken URL;
2. access blocked / anti-bot;
3. transient timeout;
4. blank or malformed registry URL;
5. internal documentation missing;
6. healthy canonical page;
7. fetch endpoint healthy while canonical page is blocked.

---

### P0-03 — Central fuel-security freshness is the main public credibility risk

The PM&C/DCCEEW snapshot envelopes for national fuel level, days cover, reserves, forward orders, tanker context and retail stock-outs are manual and stale against their weekly registry cadence. The product-specific petrol, diesel and jet days remaining are derived from that stale parent material and are also warned as stale.

**Impact:** This affects the project’s flagship public topic and the dashboard most likely to be interpreted as current operational information.

**Required action:** Before any design upgrade, either:

- manually verify and update the current PM&C snapshot;
- identify a stable current official source;
- or change the public presentation so the dated snapshot is unmistakably historical rather than operationally current.

Do not launch a Stable/Tight/Disrupted/Critical status model during this reboot unless the existing documented coverage gate is genuinely satisfied.

---

### P0-04 — Trust Status PR #108 is obsolete as an implementation branch

PR #108 was created from the 2026-05-24 main state. It contains a good product idea, but its branch is now diverged from `main` and its manifest includes May-era metadata.

**Impact:** Merging it unchanged would reintroduce stale trust metadata and create avoidable conflicts with two months of data commits.

**Required action:** Preserve the specification, not the branch. Close or supersede PR #108 after Trust Status v2 is rebuilt from current `main` with generated values and current workflow evidence.

---

## 5. High-priority technical and product debt

### P1-01 — NSW is absent from the “multi-state” retail series

The refresh workflow does not currently have `NSW_FUELCHECK_API_KEY` configured. The latest ULP 91 envelope contains Queensland and Western Australia only and explicitly notes that NSW contributes only when the secret is configured.

Current ULP 91 coverage in the latest envelope:

- Queensland: 1,559 stations, source date 2026-06-30;
- Western Australia: 937 stations, source date 2026-07-27;
- New South Wales: absent.

The envelope is transparent, but the series name can still be read as broader Australian coverage than it is.

**Required action:** Either configure the NSW key, rename the series to reflect actual coverage, or generate a visible coverage label from `extra.fields.states`.

---

### P1-02 — placeholder review metadata is embedded in public pages and tests

An unresolved last-reviewed placeholder appears across many source dashboard files, including fuel security, fuel strategy, Queensland fuel sovereignty, food/farms/water, AU economics, manufacturing, infrastructure, power, strategic resources, defence, resource value and the Missing Data Scoreboard.

The smoke tests explicitly assert that placeholder text exists. That means the test suite currently protects unfinished metadata as expected behaviour.

**Required action:** Introduce real review metadata and replace placeholder assertions with generated review-date/freshness assertions.

---

### P1-03 — Runtime depends on external React development bundles

Dashboard pages load:

- `https://unpkg.com/react@18.3.1/umd/react.development.js`
- `https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js`

This has already caused certificate/network failures in restricted test environments and creates an avoidable runtime dependency for a static public-interest site.

**Required action:** Vendor or bundle production React/ReactDOM into the site, then test the complete site without third-party JavaScript network access.

---

### P1-04 — Successful refresh status hides degraded diagnostics

The public refresh marker records the successful programmatic pipeline, which is correct. But the same workflow may have dozens of canonical-link failures and a non-blocking fetch fallback.

**Impact:** “Refresh succeeded” currently answers only one question: whether validated data was committed. It does not answer whether source landing pages, manual evidence or optional fetchers are healthy.

**Required action:** Trust Status v2 should report separate signals:

- data refresh succeeded;
- validation warning count;
- manual review due count;
- confirmed broken canonical URLs;
- access-blocked canonical URLs;
- optional fetch fallbacks used;
- programmatic source coverage;
- latest Pages deployment status.

---

### P1-05 — Refresh marker SHA is semantically ambiguous

`scripts/write_refresh_status.py` writes `GITHUB_SHA` before the workflow creates the new data commit. Therefore `git_sha` identifies the workflow input commit, not the resulting committed refresh.

**Required action:** Rename it to `input_git_sha`, or update the marker after creating the data commit and store both `input_git_sha` and `published_git_sha`.

---

### P1-06 — CI and workflow maintenance gaps

Current CI is strong on schema and rendering, but it does not currently:

- run programmatic endpoint preflight;
- validate a trust-status manifest;
- classify link-health output;
- validate the committed knowledge graph;
- verify that public review placeholders are absent;
- test the site without external JavaScript dependencies.

The latest Actions logs also warn that `actions/checkout@v4` and `actions/setup-python@v5` target deprecated Node 20 internals and are being forced onto Node 24 by the runner.

**Required action:** Refresh action versions or pin supported revisions and add the missing audit checks deliberately rather than placing every network diagnostic in blocking CI.

---

### P1-07 — The manual-review workflow is advisory but not publicly summarized

The weekly manual-review workflow produces JSON/text artifacts and a job summary. It does not update a committed public review state, open an issue, or feed the homepage/trust layer.

**Required action:** Commit a small generated review summary or publish it through Trust Status v2. Keep unavailable-by-design rows separate from genuinely overdue manual values so the report remains actionable.

---

## 6. Repository hygiene and maintainability

### P2-01 — Knowledge-graph and Cursor state files require an explicit decision

A 2026-06-02 workspace commit added:

- `.kg/`
- `.cursor/hooks/state/continual-learning.json`

The knowledge graph may become useful for architecture discovery, but its competency-question verification log remains pending and its validator is not part of CI. The Cursor state file appears tool-specific rather than product-specific.

**Required action:**

- keep `.kg/` only if it is regenerated, documented and validated;
- remove tool-session state from the public repository unless it has a defined project purpose;
- add ignore rules for transient agent state.

### P2-02 — Navigation and route configuration are duplicated

The root homepage maintains static grouped navigation while dashboard pages use the shared React `Header.jsx`. Route lists also exist in the UI build script and smoke tests.

**Impact:** New routes require coordinated edits across multiple places, increasing drift risk.

**Required action:** Create one canonical route/navigation manifest that drives:

- homepage navigation;
- shared header/footer;
- build entries;
- route smoke tests;
- public dashboard inventory.

### P2-03 — Documentation freshness is itself stale

`docs/remaining-data-gaps.md` says `Last reviewed: 2026-05-06`. The repo has since completed multiple weekly data refreshes, but the research register has not received an equivalent human review.

**Required action:** Treat the gap register as a governed dataset with per-row review dates, reviewer/source notes and status transitions.

### P2-04 — Broad link checking wastes time on known inaccessible landing pages

The latest broad diagnostic spent roughly 28 minutes and still produced mostly non-blocking anti-bot/time-out noise.

**Required action:** Add retry/backoff and host-aware rules, but more importantly, stop repeatedly checking known blocked human pages at the same frequency as machine endpoints. Use separate cadences for:

- programmatic fetch endpoints;
- canonical publication pages;
- manual PDFs;
- internal project documentation.

---

## 7. Open work requiring re-triage

The existing source-research issues remain conceptually valid but need an August 2026 re-check:

- programmatic PM&C/DCCEEW fuel snapshot access;
- state and territory outage-source expansion;
- terminal-capacity source viability;
- vessel/shipping data suitability and rights;
- launch gate for any national fuel-status model.

Each issue should end Phase 2 in one of four states:

1. implemented from a verified source;
2. re-scoped to a safe aggregate;
3. blocked with current evidence and a next-review date;
4. closed because the requested public source does not exist or is inappropriate.

---

## 8. Phase 1 risk register

| ID | Risk | Severity | Current evidence | Required owner/action |
|---|---|---:|---|---|
| R-01 | Manual fuel-security snapshot outside cadence | P0 | 7 stale PM&C/WA manual warnings plus 3 stale derived product-day warnings | Human source review before redesign |
| R-02 | Source health diagnostic too noisy to act on | P0 | 73 mixed errors in latest broad link check | Build classified source-health report |
| R-03 | Stale trust implementation | P0 | PR #108 based on May branch and diverged | Supersede with Trust Status v2 |
| R-04 | Manual/public-source layer broadly overdue | P0 | 20 manual warnings | Source-by-source refresh matrix |
| R-05 | NSW missing from multi-state retail average | P1 | Secret absent; latest envelope contains QLD and WA only | Configure secret or relabel coverage |
| R-06 | Review metadata placeholders public and test-protected | P1 | unresolved review labels across source pages and smoke tests | Generate real review metadata |
| R-07 | External React CDN is a runtime dependency | P1 | All React dashboards load unpkg development bundles | Vendor/bundle production dependencies |
| R-08 | Refresh success does not expose diagnostic degradation | P1 | Link-health errors are non-blocking and not public | Multi-signal trust/status surface |
| R-09 | Refresh SHA points to pre-refresh commit | P1 | Marker written before git commit | Store input and published SHAs separately |
| R-10 | Broken or malformed canonical/internal URLs | P1 | ACCC/ABS 404s, two internal doc 404s, one blank URL | Registry URL repair pass |
| R-11 | Tool-generated repository files lack governance | P2 | `.kg/` pending; `.cursor` state committed | Keep/integrate or remove |
| R-12 | Route/navigation definitions are duplicated | P2 | homepage, Header, build script and tests each carry route knowledge | Canonical route manifest |

---

## 9. Phase 1 exit criteria

Phase 1 is complete when this audit is accepted as the current baseline. No data or UI claims were changed by the audit itself.

Before implementation begins, the reboot should adopt these non-negotiable boundaries:

1. No source value is updated from memory, search snippets or secondary summaries.
2. Every manual update records publisher, exact document/page/table, reporting period, retrieval date and reuse boundary.
3. A `403` or timeout is not automatically classified as a dead source.
4. A `200` response is not automatically classified as usable data.
5. The dashboard must distinguish site refresh, source-period freshness, manual-review freshness and source-link health.
6. No composite status or risk model launches while required inputs remain stale, unavailable or source-gated.
7. Trust Status v2 must be generated from current repository evidence rather than hand-maintained claims.

---

## 10. Recommended handoff sequence

### Phase 2A — Current source evidence matrix

Research every P0/P1 source family and produce a table with:

- source ID;
- current registry mode;
- current URL/fetch URL;
- latest official publication located;
- exact field/period/unit;
- rights/reuse position;
- current envelope state;
- decision: update, automate, replace, reclassify or remain unavailable.

Priority order:

1. PM&C/DCCEEW national fuel snapshot and WA stock-outs;
2. ACCC petroleum components and gas-price/netback sources;
3. AEMO manual quarterly sources;
4. ABS quarterly employment/population sources;
5. DCCEEW emissions and fuel-security payment;
6. Queensland AFIP/Taroom pages;
7. ABARES/BOM/MDBA food, fertiliser and water gaps;
8. infrastructure, defence, strategic resources and Brisbane 2032 sources;
9. automation/workforce source gates.

### Phase 2B — Technical repair specification for Codex

After source decisions are complete, give Codex an implementation specification covering:

- source registry fixes;
- manual envelope updates;
- fetcher repairs/additions;
- classified source-health JSON;
- Trust Status v2;
- real review metadata;
- external dependency removal;
- canonical route manifest;
- CI/workflow hardening;
- repository hygiene.

---

## Final assessment

**Overall state: operational prototype with a healthy automated spine and an overdue human evidence layer.**

The repository does not need to be rebuilt from scratch. Its source registry, envelope contract, validation rules and fail-closed philosophy are valuable foundations. The reboot should concentrate effort where the audit found the greatest truth risk: stale manual evidence, unclassified source-health failures, ambiguous public freshness and unfinished review metadata.
