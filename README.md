# Fuel Resilience AU

A neutral, public-interest dashboard tracking Australia's liquid-fuel imports, prices and security buffer. Written in plain English for everyday Australians — a reader with no policy background should be able to get the point in under a minute.

**Status:** v1 — Fuel dashboard. Fertilizer surface planned for v1.1.

## What this is

Australia imports around 90% of its refined fuel. When overseas supply wobbles, it shows up at our pumps within days. Most of the raw numbers are public but scattered across government reports and trade databases. This dashboard pulls the three indicators that matter most into one place, updates them monthly, and explains what moved and why.

The dashboard has no publisher brand, no sponsors and no affiliation with any government department or industry body. Data is released under CC BY 4.0.

## Run locally

No build step. Open the dashboard in any modern browser:

```
open ui_kits/fuel-dashboard/index.html
```

Or serve the project root with any static server:

```
python3 -m http.server 8000
# then visit http://localhost:8000/ui_kits/fuel-dashboard/index.html
```

## Data sources

Every series on the page is from a public Australian or international source. Each card and chart shows its source and retrieval date directly beneath the data.

| Dataset | Publisher | Used for |
|---|---|---|
| Australian Petroleum Statistics (APS) | Dept of Climate Change, Energy, the Environment and Water (DCCEEW) | Days of Net Import Cover; monthly imports |
| International Merchandise Trade | Australian Bureau of Statistics (ABS) | Monthly Imports year-on-year |
| Terminal Gate Prices | Australian Institute of Petroleum (AIP) | National Fuel Price; price chart |
| 90-day stockholding obligation | International Energy Agency (IEA) | Benchmark line on the cover chart |

**Current status:** every card is marked `Sample data` until live API pulls are wired up. The chart and metric components already accept real series shapes — see `ui_kits/fuel-dashboard/data.js` for the expected shape (`{ t, v }[]` per series).

## Repo layout

```
README.md                      This file
SKILL.md                       Agent Skill front-matter (Claude Code compatible)
colors_and_type.css            Design tokens (color, type, spacing, radii, motion)
assets/                        Logo mark, Australia outline
preview/                       Small HTML reference cards for each token group
ui_kits/fuel-dashboard/        The Fuel Dashboard homepage
  index.html                   Live interactive homepage
  Header.jsx                   Masthead + section nav
  MetricCard.jsx               Headline metric card
  ChartCard.jsx                Time-series chart with takeaway + source
  InsightFeed.jsx              "What changed" feed + Footer
  data.js                      Sample series (replace with live pulls)
  styles.css                   Layout + component styles
```

## Accessibility

- WCAG AA contrast on all text and data colors
- Skip link to main content
- Keyboard-navigable charts (arrow keys scrub; Escape clears)
- ARIA labels on all non-text affordances
- `prefers-reduced-motion` honoured

## Roadmap

- **v1.0** — Fuel dashboard with three headline metrics, charts and sources page. *Current.*
- **v1.1** — Fertilizer dashboard (imports, prices, key chokepoints)
- **later** — Broader supply-chain indicators

## Deployment (suggested, not configured)

Either option works — both are free for public static sites and trigger on push to `main`:

- **GitHub Pages** — simplest. Settings → Pages → Build from branch `main`, folder `/`. Site URL: `https://<org>.github.io/fuel-fertilizer-dashboard/ui_kits/fuel-dashboard/`.
- **Cloudflare Pages** — more control (custom domain, build hooks, analytics). Connect the repo, set build command to none and output directory to `/`.

No decision yet — pick once you've seen it working.

## License

Data: CC BY 4.0. Code: MIT.
