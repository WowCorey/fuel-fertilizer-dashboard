# Fuel Resilience AU

[![Deploy GitHub Pages](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/workflows/pages.yml/badge.svg)](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/workflows/pages.yml)

A neutral, public-interest dashboard for everyday Australians — tracking the
bits of the energy and agricultural supply chain that most shape prices at the
pump and at the farm gate. Written in plain English, sourced from named public
Australian and international sources, and explicit when data is unavailable.

**Status:** Seven dashboard surfaces read from a shared JSON-envelope data
pipeline. Programmatic live sources now include ABS petroleum imports and YoY,
ABS fertiliser imports, APS net-import cover, APS refinery production series,
AIP terminal gate prices, RBA AUD/USD, EIA/FRED crude and refined-fuel series,
and the multi-state retail fuel average. The national status page adds a
manually verified PM&C/DCCEEW public fuel-supply snapshot. The resource value
page adds official tax, PRRT, WA/NWS and Queensland royalty receipts,
export-value and Norway comparison envelopes, while leaving unsupported leakage and price-comparison claims
unavailable. The fuel-security page reuses the public PM&C/DCCEEW snapshot,
APS product-flow envelopes and ABS import data to show what is observable,
derived, partial or unavailable. Other sources remain manual or unavailable
until a named public source can support the value.

## What this is

Australia imports around 90% of its refined fuel and the majority of its
fertiliser. When overseas supply wobbles, it shows up domestically within days
to weeks. Most of the raw numbers are public but scattered across government
reports and trade databases. This project pulls the source references into one
place, fetches the sources that are safe to fetch, and leaves every unverified
figure visibly unavailable.

The dashboards have no publisher brand, no sponsors, and no affiliation with
any government department or industry body. The project does not fabricate,
interpolate or estimate missing numbers.

## Dashboards

| Page | Version | What it covers | Current data state |
|---|---|---|---|
| [National status](ui_kits/national-status-dashboard/index.html) | v1.4 | National Fuel Security Plan level, MSO reserves, ships on water and retail stock-outs | PM&C/DCCEEW public fuel-supply snapshot hand-keyed; direct scripted access is blocked/deferred until a stable machine-readable endpoint exists |
| [Fuel security](ui_kits/fuel-security-dashboard/index.html) | v1.6 | Product days remaining, PM&C/DCCEEW fuel-supply snapshot, APS stocks/sales/imports, import/shipping risk context and unavailable operational feeds | Product days are derived from the named PM&C/DCCEEW snapshot; APS/ABS and public retail feeds are loaded where available; live station outage, vessel tracking, terminal capacity and status-score feeds remain unavailable |
| [Resource value](ui_kits/resource-value-dashboard/index.html) | v1.5 | Company tax, PRRT, petroleum royalties, LNG/oil export value, gas origin, export destinations, domestic-vs-netback context and Norway comparison | Official receipt, export, production, destination and gas-price comparison envelopes are hand-keyed from named public sources, including WA/NWS and Queensland petroleum royalty receipt context; value-leakage estimate remains unavailable until a documented denominator and method exist |
| [Fuel](ui_kits/fuel-dashboard/index.html) | v1.0 | Imports, prices, days of net import cover | ABS imports, ABS YoY, APS net-import cover, AIP TGP and public-feed retail averages for ULP 91, diesel, premium 95 and E10 fetched; AIP national retail reports remain manual |
| [Fertilizer](ui_kits/fertilizer-dashboard/index.html) | v1.1 | Imports by fertiliser category, price index, supplier concentration | ABS SITC 562 total imports and source-country top-3 concentration fetched; nutrient subseries, ABARES price and stock cover remain manual/unavailable |
| [Oil & production](ui_kits/oil-and-production/index.html) | v1.2 | Brent/WTI/Tapis, domestic refining, IEA gap, Fuel Security payments | Brent/WTI, AUD conversions, EIA diesel/jet, APS production and APS product-flow series fetched; DCCEEW FSSP/offshore disclosures are hand-keyed; Tapis and refinery utilisation remain unavailable |
| [Who pays what](ui_kits/who-pays-what/index.html) | v1.3 | Revenue, tax paid and effective tax rates for major energy companies, plus retail-price breakdown | ATO 2023-24 corporate tax fields, five company profit rows and ACCC December quarter 2025 petrol components are hand-keyed; remaining private Australian subsidiary profit stays unavailable until source filings are verified |

Every page cross-links to the others in the header nav.

Known missing data is tracked in
[`docs/remaining-data-gaps.md`](docs/remaining-data-gaps.md). Those gaps stay
unavailable until a named public source supports the exact value.
Fuel-security source investigations are recorded in
[`docs/fuel-security-source-investigation.md`](docs/fuel-security-source-investigation.md),
including the current PM&C/DCCEEW access result, station-outage limits,
shipping limits and terminal-capacity decision.

## Run locally

The committed site can be served as static files because the dashboard JSX is
precompiled. Serve the repo root with any static server - `fetch()` of the JSON
envelopes does not work from `file://`, so you must use a server.

```sh
python3 -m http.server 8000
# then visit:
#   http://localhost:8000/ui_kits/national-status-dashboard/index.html
#   http://localhost:8000/ui_kits/fuel-security-dashboard/index.html
#   http://localhost:8000/ui_kits/resource-value-dashboard/index.html
#   http://localhost:8000/ui_kits/fuel-dashboard/index.html
#   http://localhost:8000/ui_kits/fertilizer-dashboard/index.html
#   http://localhost:8000/ui_kits/oil-and-production/index.html
#   http://localhost:8000/ui_kits/who-pays-what/index.html
```

## Data pipeline

Every series shown on the site lives as a JSON envelope on disk. Envelopes are
produced by `scripts/fetch_data.py` for programmatic sources or hand-keyed into
`data/manual/` for PDFs, paywalls, JS-rendered tables and sources that require a
human check. The dashboards read those JSON files via
`ui_kits/shared/data-loader.js`.

```
data/
  sources.yml              master registry — every dataset used, with
                           publisher, URLs, cadence, rights and fetch mode
  source_manifest.json     browser manifest that tells dashboards whether to
                           look in generated/ or manual/ first
  generated/*.json         produced by scripts/fetch_data.py
  manual/*.json            hand-keyed from the named public document
```

### Source registry contract

Each source in `data/sources.yml` must have:

- `id`, `human_name`, `publisher`, `format`, `update_cadence`, `last_verified`
- `url` and `canonical_url` for the human-facing publisher page
- `fetch` set to `programmatic`, `derived`, `manual` or `unavailable`
- `fetch_url` only when `fetch: programmatic`
- `rights`, `rights_url`, `citation` and `reuse_notes` describing upstream source rights
- `used_by` listing the dashboard surfaces that depend on it

`url` remains for compatibility with existing scripts; new code should prefer
`canonical_url` for citations and `fetch_url` for machine retrieval. Sources may
also include fetcher-specific keys such as ABS SDMX parameters or APS workbook
sheet/column names.

### Envelope schema

A successful envelope uses `status: "ok"` and must carry a real retrieval time,
a latest data point and either numeric `values` or a structured `extra` block.

```json
{
  "series_id": "eia_brent",
  "source_id": "eia_brent",
  "source_name": "Brent crude spot price (EIA)",
  "source_url": "https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm",
  "unit": "USD per barrel",
  "retrieved_at": "2026-04-18T00:00:00+00:00",
  "last_data_point": "2026-04-01",
  "values": [{"t": "2026-04", "v": 66.42}],
  "notes": "Monthly average from published daily observations.",
  "status": "ok",
  "manual_entry": false
}
```

An unavailable stub must not look freshly retrieved:

```json
{
  "series_id": "aps_monthly",
  "source_id": "aps_monthly",
  "retrieved_at": null,
  "stub_created_at": "2026-04-18T12:27:44+00:00",
  "last_data_point": null,
  "values": [],
  "notes": "Awaiting hand-keyed values from the named public source.",
  "status": "unavailable",
  "manual_entry": true
}
```

The page-level `Updated` stamp is computed only from verified `status: "ok"`
envelopes. If a page has no verified loaded data, it says so instead of showing
a stub timestamp.

When `status` is anything other than `"ok"`, the dashboard shows a
**"Source unavailable — awaiting data"** placeholder instead of a value. We
never estimate.

## Validation and CI

Run the validator before opening or merging a PR:

```sh
pip install -r requirements.txt
npm ci
npm run check:ui
npm run smoke:ui
python3 scripts/validate_data.py
python3 scripts/validate_data.py --json
python3 scripts/build_source_manifest.py --check
python3 scripts/review_due.py
python3 -m unittest discover -s tests
```

The validator checks `data/sources.yml`, all generated/manual envelopes and the
source IDs referenced by dashboard pages. It rejects duplicate IDs, missing
registry entries, invalid status/timestamp semantics, inconsistent manual-entry
flags, malformed values and unstructured `extra` data.

`.github/workflows/ci.yml` runs on pull requests and pushes. It installs the
minimal Python dependencies in `requirements.txt` and the pinned Node build
dependencies in `package-lock.json`, checks that compiled dashboard JS is fresh,
compile-checks scripts, runs the data validator, checks the browser source
manifest, and runs unit tests for the fetch/data-entry transforms.

`.github/workflows/manual-data-review.yml` runs weekly and on demand. It runs
the validator, writes a `scripts/review_due.py` summary to the Actions job
summary, and uploads JSON/text review artifacts. The workflow is advisory: a
source can be due or intentionally unavailable without inventing a replacement
number.

## Run the pipeline locally

```sh
pip install -r requirements.txt
python3 scripts/fetch_data.py                 # pull every programmatic source
python3 scripts/fetch_data.py --only eia_brent
python3 scripts/fetch_data.py --check         # blocking check: programmatic fetch URLs only
python3 scripts/fetch_data.py --check-all-links  # broad link-health check for canonical pages
python3 scripts/init_manual_stubs.py          # create missing manual stubs
python3 scripts/build_source_manifest.py      # update browser loader manifest
python3 scripts/validate_data.py              # validate registry and envelopes
```

### Weekly refresh

`.github/workflows/refresh-data.yml` runs every Monday at 02:00 AEST
(`cron: "0 16 * * 0"`). It:

1. Checks only programmatic `fetch_url` endpoints as a blocking preflight.
2. Runs broad canonical/manual link health as a non-blocking diagnostic.
3. Refreshes programmatic JSON envelopes.
4. Creates any missing manual stubs.
5. Rebuilds `data/source_manifest.json`.
6. Runs `scripts/validate_data.py` before committing.
7. Commits changed data files to the repository only after validation passes.

Manual and canonical publisher pages should not block a valid programmatic data
refresh; broken programmatic fetch URLs should fail loudly.

To run the scheduled refresh manually, open the repository on GitHub, go to
Actions, choose **Weekly data refresh**, then use **Run workflow** on `main`.
That refresh only updates programmatic envelopes and stubs. Manual public
snapshot sources, such as PM&C national status, FSSP disclosures, company
profits and resource-value receipts, still need a human review before changing
their JSON.

To run the manual review report from GitHub, open Actions, choose
**Manual data review**, then use **Run workflow** on `main`. Read the summary
before editing manual JSON; stale and unavailable items are prompts for review,
not permission to estimate.

### Add or update a source

1. Add or edit an entry in `data/sources.yml` with the full source registry contract above.
2. If `fetch: programmatic`, register a fetcher in `FETCHERS` inside
   `scripts/fetch_data.py` that returns `{unit, values, last_data_point, notes}`.
3. If `fetch: manual`, run `python3 scripts/init_manual_stubs.py` to create
   the placeholder, then use `python3 scripts/enter_manual.py` after verifying
   the named publisher document. Time-series values use `--point
   YYYY-MM=123.4 --unit <unit>`. Scalar records, such as company tax table
   fields, use typed `extra.fields`, for example `--field
   fiscal_year=2023-24 --field total_income=1234 --last-data-point
   2024-06-30`.
   Use `python3 scripts/enter_manual.py --examples` for source-specific command
   templates and review `docs/manual-entry-templates.md` before updating public
   snapshot sources.
4. When manual values are verified, set `status` to `"ok"`, set `retrieved_at`
   to the data-entry timestamp, set `last_data_point`, and keep
   `manual_entry: true`.
5. If `fetch: unavailable`, leave the stub unavailable until a named public
   source can support the figure.
6. Reference the envelope from one of the dashboard pages by adding its ID to
   the page's `SERIES` array and passing `fromEnvelope={data.<id>}` to
   `<MetricCard>` or `<ChartCard>`.
7. Run `python3 scripts/build_source_manifest.py` and
   `python3 scripts/validate_data.py` before committing.

### Manual review due report

Run this when checking whether hand-keyed sources need attention:

```sh
python3 scripts/review_due.py
python3 scripts/review_due.py --used-by national_status
python3 scripts/review_due.py --used-by resource_value --json
```

The report uses the same freshness windows as the validator and flags missing,
unavailable or stale manual envelopes. It does not fail CI by default because
some public sources legitimately lag; use `--fail-on-due` only for an
intentional manual-data review workflow.

## Fuel Stress Index gate

The Fuel Stress Index has not been implemented. Its input, exclusion,
freshness, confidence and coverage rules are locked in
`docs/fuel-stress-index-spec.md`. Do not add scoring code or public labels until
the score can show missing inputs, stale/manual status and component coverage
beside the number. The fuel-security dashboard is not the Fuel Stress Index; its
methodology and unavailable operational feeds are documented in
`docs/fuel-security-methodology.md`.

## Repo layout

```
README.md                      This file
SKILL.md                       Agent Skill front-matter
colors_and_type.css            Design tokens (color, type, spacing, motion)
assets/                        Logo mark, Australia outline
preview/                       Small HTML reference cards for each token group

data/
  sources.yml                  Master source registry
  generated/                   JSON produced by fetch_data.py
  manual/                      Hand-keyed JSON for sources we can't fetch
  source_manifest.json         Browser loader manifest

scripts/
  build_source_manifest.py     Builds data/source_manifest.json
  enter_manual.py              Safer manual data-entry helper
  fetch_data.py                Pipeline entry point
  init_manual_stubs.py         Creates missing data/manual/*.json stubs
  review_due.py                Reports manual sources that need review
  validate_data.py             Validates registry, envelopes and dashboard refs
  write_refresh_status.py      Writes data/last_successful_refresh.json after refresh

tests/
  test_fetch_transforms.py     Fetch/derivation transform coverage
  test_enter_manual.py         Manual-entry helper coverage
  ui-smoke.spec.js             Playwright smoke tests for every dashboard route

.github/workflows/
  ci.yml                       PR/push validation
  manual-data-review.yml       Weekly/manual advisory stale-source report
  refresh-data.yml             Weekly Monday 02:00 AEST data refresh

ui_kits/
  shared/                      Header, Footer, MetricCard, ChartCard,
                               InsightFeed, data-loader, styles — used by
                               every dashboard
  national-status-dashboard/   v1.4 — public fuel-status snapshot
  fuel-security-dashboard/     v1.6 — fuel-security visibility and gaps
  resource-value-dashboard/    v1.5 — tax, PRRT, royalties, export value
  fuel-dashboard/              v1.0 — liquid fuel
  fertilizer-dashboard/        v1.1 — fertiliser
  oil-and-production/          v1.2 — crude, refining, government spending
  who-pays-what/               v1.3 — tax vs consumer price vs profit
```

## Accessibility

- WCAG AA contrast on all text and data colours
- Skip link on every page
- Keyboard-navigable charts (arrow keys scrub; Escape clears)
- ARIA labels on all non-text affordances
- `prefers-reduced-motion` honoured

## Editorial rules

- Plain English. Any acronym expanded on first use.
- Every chart has a one-line plain-English takeaway above it, units on axes,
  and a source line below it.
- No fonts, colours or tokens outside `colors_and_type.css`.
- No dark mode. No emojis. No gradients.
- No made-up data. Ever. If a number cannot be sourced from a named public
  document, the card renders "Source unavailable" — never an estimate.
- Do not describe a page as live or current unless the referenced envelopes have
  `status: "ok"` and valid freshness metadata.
- On the fuel-security surfaces, "shipping" means aggregate public PM&C tanker
  counts unless a future source-safe vessel feed is explicitly registered.

## Deployment (suggested, not configured)

Either option works — both are free for public static sites and trigger on
push to `main`:

- **GitHub Pages** — simplest. Settings → Pages → Build from branch `main`,
  folder `/`. Note that GitHub Pages serves the entire repo, so the JSON
  envelopes under `data/` are fetched the same way the dev server resolves
  them.
- **Cloudflare Pages** — more control. Connect the repo, set build command
  to none and output directory to `/`.

## License and source rights

Project code is MIT licensed. Project-authored prose and metadata are released
under CC BY 4.0 unless a file states otherwise.

Upstream source data remains under the rights, terms and citation requirements
of each publisher. Those publisher rights are tracked per source in
`data/sources.yml` through `rights`, `rights_url`, `citation` and
`reuse_notes`. Do not assume this repository can relicense upstream source data.
