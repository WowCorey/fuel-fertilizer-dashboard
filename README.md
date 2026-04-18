# Fuel Resilience AU

A neutral, public-interest dashboard for everyday Australians — tracking the
bits of the energy and agricultural supply chain that most shape prices at the
pump and at the farm gate. Written in plain English, sourced entirely from
public Australian and international data.

**Status:** v1.3 — four dashboards live, all reading from a shared data pipeline.

## What this is

Australia imports around 90% of its refined fuel and the majority of its
fertiliser. When overseas supply wobbles, it shows up domestically within days
to weeks. Most of the raw numbers are public but scattered across government
reports and trade databases. This project pulls them into one place, refreshes
them weekly, and explains what moved and why.

The dashboards have no publisher brand, no sponsors, and no affiliation with
any government department or industry body. Data is released under CC BY 4.0.

## Dashboards

| Page | Version | What it covers |
|---|---|---|
| [Fuel](ui_kits/fuel-dashboard/index.html) | v1.0 | Imports, prices, days of net import cover |
| [Fertilizer](ui_kits/fertilizer-dashboard/index.html) | v1.1 | Imports by HS-31 subcategory, price index, supplier concentration |
| [Oil & production](ui_kits/oil-and-production/index.html) | v1.2 | Brent/WTI/Tapis, domestic refining, IEA gap, Fuel Security payments |
| [Who pays what](ui_kits/who-pays-what/index.html) | v1.3 | Revenue, tax paid and effective tax rates for major energy companies, plus retail-price breakdown |

Every page cross-links to the others in the header nav.

## Run locally

No build step. Serve the repo root with any static server — `fetch()` of the
JSON envelopes does not work from `file://`, so you must use a server.

```sh
python3 -m http.server 8000
# then visit:
#   http://localhost:8000/ui_kits/fuel-dashboard/index.html
#   http://localhost:8000/ui_kits/fertilizer-dashboard/index.html
#   http://localhost:8000/ui_kits/oil-and-production/index.html
#   http://localhost:8000/ui_kits/who-pays-what/index.html
```

## Data pipeline

Every series shown on the site lives as a JSON envelope on disk. Envelopes are
produced by `scripts/fetch_data.py` (for sources we can fetch) or hand-keyed
into `data/manual/` (for PDFs, paywalls, JS-rendered tables). The dashboards
read those JSON files via `ui_kits/shared/data-loader.js`.

```
data/
  sources.yml              master registry — every dataset used, with
                           publisher, URL, format, cadence and licence
  generated/*.json         produced by scripts/fetch_data.py
  manual/*.json            hand-keyed from the named public document
```

Envelope schema (see `scripts/fetch_data.py`):

```json
{
  "series_id":       "aps_monthly",
  "source_id":       "aps_monthly",
  "source_name":     "Australian Petroleum Statistics (monthly)",
  "source_url":      "https://www.energy.gov.au/...",
  "unit":            "days",
  "retrieved_at":    "2026-04-18T00:00:00+00:00",
  "last_data_point": "2026-03-01",
  "values":          [{"t": "2024-03", "v": 28}, ...],
  "notes":           "...",
  "status":          "ok",
  "manual_entry":    false
}
```

When `status` is anything other than `"ok"`, the dashboard shows a
**"Source unavailable — awaiting data"** placeholder instead of a value. We
never estimate.

### Run the pipeline locally

```sh
pip install pyyaml requests
python3 scripts/fetch_data.py                 # pull every programmatic source
python3 scripts/fetch_data.py --only eia_brent
python3 scripts/fetch_data.py --check         # HTTP-check every source URL
python3 scripts/init_manual_stubs.py          # create missing manual stubs
```

### Weekly refresh

`.github/workflows/refresh-data.yml` runs every Monday at 02:00 AEST
(`cron: "0 16 * * 0"`). It:

1. HTTP-checks every URL in `sources.yml`; if any 4xx/5xx, the job fails loudly.
2. Runs `scripts/fetch_data.py` to refresh programmatic sources.
3. Commits any changed JSON to `main` with `chore(data): weekly refresh <date>`.

### Add a new source

1. Add an entry to `data/sources.yml` with `id`, `human_name`, `publisher`,
   `url`, `format`, `update_cadence`, `last_verified`, `licence` and `fetch`.
2. If `fetch: programmatic`, register a fetcher in `FETCHERS` inside
   `scripts/fetch_data.py` that returns `{unit, values, last_data_point, notes}`.
3. If `fetch: manual`, run `python3 scripts/init_manual_stubs.py` to create
   the placeholder, then hand-key values from the named publisher document and
   flip `status` to `"ok"`.
4. If `fetch: unavailable`, leave the stub as-is — the dashboard will render
   the placeholder.
5. Reference the envelope from one of the dashboard pages by adding its id to
   the page's `SERIES` array and passing `fromEnvelope={data.<id>}` to
   `<MetricCard>` or `<ChartCard>`.

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

scripts/
  fetch_data.py                Pipeline entry point (cron-safe, stdlib + requests + yaml)
  init_manual_stubs.py         Creates missing data/manual/*.json stubs

.github/workflows/
  refresh-data.yml             Weekly Monday 02:00 AEST cron

ui_kits/
  shared/                      Header, Footer, MetricCard, ChartCard,
                               InsightFeed, data-loader, styles — used by
                               every dashboard
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
  and a source + retrieval date below it.
- No fonts, colours or tokens outside `colors_and_type.css`.
- No dark mode. No emojis. No gradients.
- No made-up data. Ever. If a number cannot be sourced from a named public
  document, the card renders "Source unavailable" — never an estimate.

## Roadmap

- **v1.0** — Fuel dashboard. *Current.*
- **v1.1** — Fertilizer dashboard. *Current.*
- **v1.2** — Oil / production / government spending. *Current.*
- **v1.3** — Tax vs consumer price vs profit. *Current.*
- **later** — Broader supply-chain indicators (shipping lanes, port throughput, etc.)

## Deployment (suggested, not configured)

Either option works — both are free for public static sites and trigger on
push to `main`:

- **GitHub Pages** — simplest. Settings → Pages → Build from branch `main`,
  folder `/`. Note that GitHub Pages serves the entire repo, so the JSON
  envelopes under `data/` are fetched the same way the dev server resolves
  them.
- **Cloudflare Pages** — more control. Connect the repo, set build command
  to none and output directory to `/`.

## License

Data: CC BY 4.0. Code: MIT.
