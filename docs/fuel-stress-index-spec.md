# Fuel Stress Index Input Specification

Last reviewed: 2026-04-22

This document locks the rules that must exist before the project publishes any
0-100 Fuel Stress Index. It is a methodology gate only; there is no public score,
public label, or index UI until every rule below is implemented and visible.

## Purpose

The index should summarise pressure in Australia's liquid-fuel system without
fabricating missing values. It must behave as a transparent coverage-weighted
indicator, not as an authoritative official security rating.

## Candidate Bands

These labels are reserved for a future public score:

| Score | Label |
|---:|---|
| 0-20 | Stable |
| 21-40 | Watch |
| 41-60 | Elevated |
| 61-80 | High stress |
| 81-100 | Critical |

Do not display a band unless the page also displays component coverage,
confidence, stale/manual status, and omitted inputs.

## Inputs Allowed For MVP

Only these existing verified envelopes may be considered for a first MVP:

| Component | Candidate envelope(s) | Use |
|---|---|---|
| Retail pump price pressure | `aus_retail_fuel_multistate`, `aus_retail_fuel_multistate_diesel`, `aus_retail_fuel_multistate_premium95`, `aus_retail_fuel_multistate_e10` | Current pump-price pressure by product from public state feeds. |
| Petroleum import pressure | `abs_petroleum_imports_yoy` | Year-on-year import-value pressure. |
| Net-import cover | `aps_monthly`, `iea_90day` | Compare APS net-import cover with the IEA 90-day benchmark. |
| Stocks/imports/exports/production context | APS product-flow envelopes | Use only direct APS fields already parsed into generated envelopes. |
| National status snapshot | `pmc_fuel_security_level`, `pmc_mso_days_cover`, `pmc_mso_fuel_reserves`, `pmc_forward_import_orders`, `pmc_tankers_on_water`, `pmc_retail_stockouts` | Use as dated public snapshot signals with manual-source confidence penalty. |
| Crude benchmark pressure | `eia_brent`, `eia_wti`, `rba_aud_usd` | Optional derived AUD crude-pressure signal if formula is documented. |

## Inputs Excluded Until Sourceable

These must not contribute to a score yet:

- Fertiliser inputs, unless the product is renamed beyond a fuel-only index.
- Tapis, because no licence-safe public time series is registered.
- Refinery utilisation, because there is no sourced utilisation percentage or
  sourced capacity denominator.
- AIP national retail PDF reports, until a deterministic extraction and review
  workflow exists.
- Project-level PRRT receipts, company-specific royalty flows, or "value leaked".
- Vessel-level tanker movements or AIS-derived tracking.
- Any calculated shortage figure beyond the public PM&C/state stock-out snapshot.

## Freshness Rules

Each component must carry one visible state:

- `fresh`: `status: "ok"` and within the source cadence window.
- `stale`: `status: "ok"` but outside the cadence window.
- `manual`: hand-keyed from a named public source.
- `derived`: generated only from registered parent envelopes.
- `unavailable`: no verified source or method exists.

Stale data may reduce confidence, but it must not silently disappear from the
method. Unavailable data must not be replaced by estimates.

## Confidence And Coverage

The future score must show both:

- `coverage = loaded_weight / possible_weight`
- `confidence = loaded_weight_adjusted_for_quality / possible_weight`

Minimum quality multipliers:

| Source state | Multiplier |
|---|---:|
| Fresh programmatic | 1.00 |
| Fresh derived from fresh parents | 0.90 |
| Fresh manual public snapshot | 0.75 |
| Stale programmatic | 0.50 |
| Stale manual | 0.35 |
| Unavailable | 0.00 |

A public score must not render when coverage is below 60%. In that case the page
should render "Index unavailable - insufficient verified inputs" and list the
missing components.

## First Formula Shape

The first formula should use conservative equal-ish weights and be easy to
audit:

| Component | Tentative weight |
|---|---:|
| Retail pump price pressure | 20 |
| Crude/AUD price pressure | 15 |
| Import value pressure | 15 |
| Net-import cover | 20 |
| Stock/import/order snapshot | 20 |
| Retail stock-out/tanker disruption snapshot | 10 |

Weights should be rebalanced only with a documented reason. No component can be
used unless its normalisation formula is documented beside the score.

## Normalisation Guardrails

- Use bounded 0-100 transforms with documented thresholds.
- Prefer historical percentile or policy threshold transforms only when the
  historical window is present in the envelope.
- Do not infer national shortage from price alone.
- Do not infer refinery stress from production without a capacity denominator.
- Do not combine AUD, USD, litres, barrels, and days without a visible
  normalisation method.

## Before Implementation

Before writing score code, complete these checks:

- Run `python scripts/review_due.py --include-generated`.
- List every stale and unavailable candidate input in the PR body.
- Decide whether the page is "Fuel Stress Index" or "Fuel Pressure Index"; use
  "Pressure" if the score mostly reflects prices and imports rather than true
  physical security.
- Add unit tests for every normalisation transform.
- Add a browser smoke assertion that the score is hidden when coverage is below
  the threshold.
