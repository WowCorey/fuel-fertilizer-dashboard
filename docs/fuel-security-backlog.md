# Fuel Security Source Backlog

Last reviewed: 2026-04-23

This file is issue-ready backlog text for the hard source gaps that still block
a complete operational fuel-security dashboard. Each item should stay fail
closed until the success condition is met.

## PM&C/DCCEEW programmatic snapshot access

Why it matters:

- The PM&C public fuel-supply page is the authoritative public snapshot for the
  national level, MSO days, reserves, forward orders, tankers and stock-outs.
- Manual entry is auditable but slower and easier to miss.

Current blocker:

- Direct local pipeline requests return Incapsula challenge HTML, and no stable
  linked CSV, JSON, XLSX or data.gov.au package was verified.

Source requirements:

- Official PM&C, DCCEEW, energy.gov.au or data.gov.au source.
- Stable machine-readable file or endpoint.
- Clear reuse terms and field dates/units.

Success condition:

- `fetch: programmatic` source can refresh the PM&C/DCCEEW snapshot, pass the
  validator, and preserve manual fallback for human review.

Out of scope:

- Scraping protected HTML.
- Using search-engine snippets as a data source.
- Inferring missing table fields.

## State-by-state fuel outage source coverage

Why it matters:

- A national stock-out count is less useful if users cannot see geographic
  limits or state-level coverage.

Current blocker:

- WA now has a dated manual partial layer, and QLD now has a monthly
  programmatic unavailable-fuel report layer from Open Data rows where
  `Price = 9999`.
- Other jurisdictions still expose either price apps, narrative pages,
  key-gated APIs, or app-only availability rather than a reusable public
  outage feed.

Source requirements:

- Official or clearly reusable public source.
- Station-level or aggregate stock-out fields with dates, product scope and
  geographic coverage.
- Rights that permit dashboard redistribution.

Success condition:

- Each added jurisdiction has its own envelope and visible `Partial coverage`
  label; no partial state feed is presented as a national live feed.

Out of scope:

- Treating price feeds as outage feeds.
- Scraping app traffic without published terms.
- Publishing exact station availability unless redistribution rights are clear.

## Terminal capacity public-source investigation

Why it matters:

- Stock levels have different meaning when users can see storage capacity and
  terminal constraints.

Current blocker:

- Public APS and PM&C sources support national/product stock context, but not
  terminal-by-terminal capacity or live inventory.

Source requirements:

- Official or clearly reusable terminal-capacity dataset.
- Terminal name/location, capacity, product scope, units and date.

Success condition:

- `fuel_security_terminal_capacity` can move from unavailable to observed or
  partial coverage without inferring private capacity.

Out of scope:

- Inferring capacity from news reports, satellite imagery, or private operator
  descriptions.
- Publishing live inventory without an explicit source.

## Vessel/shipping live-data gate

Why it matters:

- Vessel-level visibility would make inbound supply easier to interpret, but it
  carries high rights and inference risk.

Current blocker:

- PM&C publishes aggregate tanker counts and equivalent days only. No
  source-safe public live vessel feed is loaded.

Source requirements:

- Provider permits public display and redistribution.
- API credentials/rate limits documented.
- Vessel identity, ETA, route and cargo fields are source-provided or visibly
  labelled with a defensible method.

Success condition:

- A vessel envelope schema is defined, validated and displayed with confidence
  labels and source-rights metadata.

Out of scope:

- AIS scraping.
- Cargo inference shown as fact.
- Live route maps that imply source coverage the repo does not have.

## Status-model gate after coverage thresholds

Why it matters:

- A Stable/Tight/Disrupted/Critical label is useful only if users can see the
  evidence, missing inputs and freshness behind it.

Current blocker:

- Live national outage, live shipment, terminal-capacity and programmatic
  PM&C/DCCEEW inputs are still incomplete or unavailable.

Source requirements:

- Documented input set, freshness windows, missing-data behaviour and threshold
  rules.
- Visible coverage/confidence beside the output.
- Tests for every status transition.

Success condition:

- `fuel_security_status_model` can publish a status without hiding missing
  inputs or overstating certainty.

Out of scope:

- Launching a 0-100 or banded score before the trust/coverage layer can explain
  it.
- Treating manual placeholders as live signal.
