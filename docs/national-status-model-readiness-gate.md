# National status-model readiness gate

Reviewed: 2026-08-03  
Repository evidence baseline: `d4802573d881dbb49b0f4d0d71a5dbb8d18851e7`

## Decision

**Blocked.** Fuel Resilience AU is not ready to publish a project-authored
national fuel-availability status, fuel-security status, supply-chain status,
resilience status, national risk level or composite national score.

The current repository is **ready for public non-composite indicators only**:
individual source-labelled values may remain public with their dates, scopes,
units, evidence modes and caveats. That narrower outcome is not a national
status decision and does not make the unavailable model partially operative.

This phase adds no score, band, risk level, national status card or inferred
value. The machine decision in `data/national_status_model_gate.json` keeps all
publication flags false and both possible public outputs `null`.

## Why the existing proposal cannot launch

Issue #37 requests a Stable/Tight/Disrupted/Critical model. The older
`fuel-stress-index-spec.md` instead proposed five bands on a 0-100 scale,
tentative weights, quality multipliers and a 60% coverage cutoff. No repository
evidence documents calibration, sensitivity analysis, transition testing or
approval for those numbers. They are now explicitly archived as an unapproved
candidate, not silently promoted into policy.

The repository also lacks complete current outage visibility, terminal
capacity, rights-safe live vessel/cargo evidence, model-specific freshness
windows, an aligned historical baseline, approved conflict rules and a tested
way to explain every movement. Missing inputs cannot be replaced by zero,
estimated, interpolated, dropped or reweighted.

## Current evidence snapshot

The validator reads explicit fields rather than recursively guessing JSON:

| Evidence | 2026-08-03 result | Boundary |
|---|---:|---|
| Registered sources | 219 | 52 programmatic, 101 manual, 4 derived, 62 unavailable. |
| Envelope presence | 219 reconciled | 49 generated-only, 163 manual-only, 7 both, 0 missing. Presence is not fetch mode. |
| Validation warnings | 17 | 13 manual stale and 4 generated stale; zero rights, name, URL or other warnings. Warnings are not success. |
| Public routes | 23 | A route count is not evidence that model inputs are complete. |
| Status model | unavailable | No public score or project-authored label exists. |
| Live national outage feed | unavailable | Dated partial state/national snapshot evidence is not live national coverage. |
| Terminal capacity | unavailable | Stock context and terminal locations are not terminal capacity or inventory. |
| Live vessel tracking | unavailable | Aggregate published tanker context is not vessel, cargo, route or ETA evidence. |

The PM&C public fuel-supply page is the named source for several manual
snapshots. The source registry records that the repository has not found a
stable machine-readable endpoint. A local challenge response is an access
condition, not proof that the public information or dataset is unavailable.

## Six independent readiness dimensions

| Dimension | Current state | What must become defensible |
|---|---|---|
| Coverage | Blocked | Defined core products, geography, station universe, required indicators and transparent exclusions. |
| Freshness | Partially ready | One evidence-backed maximum age per approved critical source, including publication delay and revision behaviour. |
| Methodology | Blocked | One approved output definition, input graph, transformations, weights, uncertainty, missing-data and conflict rules. |
| Rights | Partially ready | Complete field-level rights for every final contributing input and public transformation. |
| Operations | Blocked | Reproducible calculation, historical replay, boundary/transition tests, fail-closed generation and run evidence. |
| Communication | Partially ready | Explanations for movement, uncertainty, omission, conflict and source concentration without implying certification or prediction. |

`Partially ready` describes controls already present; it is not permission to
publish a label. The overall gate remains blocked while any required dimension
has an open blocker.

## Claim-level assessment

| Proposed claim | Decision | Principal reason |
|---|---|---|
| Fuel availability status | Blocked | Partial, delayed and unavailable outage layers have no approved national denominator. |
| Fuel-security status | Blocked | Source snapshots may be shown individually, but national coverage and status rules are incomplete. |
| Supply-chain status | Blocked | Aggregate shipping context cannot support live vessel, cargo, route or arrival claims. |
| Resilience status | Blocked | Coverage, terminal, shipping, independence and historical evidence are incomplete. |
| National risk level | Blocked | No approved risk construct, baseline or transition logic exists. |
| Composite national score | Blocked | Components, normalisation, weights, thresholds, sensitivity and approval are unresolved. |

## Threshold policy

Every threshold record must contain a rationale, measurement method,
sensitivity justification, failure behaviour, owner and review date.

Five numeric zeroes are schema or publication invariants, not empirical model
cutoffs:

- zero unknown source modes;
- zero registered sources without an evidence envelope;
- zero unresolved rights among contributing inputs;
- zero stale inputs designated critical by an approved methodology; and
- zero unvalidated derived inputs.

Five empirical questions remain explicit unresolved approval gates with
`value: null`:

- national current-outage geographic coverage;
- maximum unavailable contributing weight;
- minimum comparable historical periods;
- maximum single-publisher contribution; and
- source-specific freshness windows.

`null` means no defensible value has been approved. It must not be interpreted
as zero, no limit, a passing result or permission to choose a convenient value.
The old 60% coverage cutoff is not carried forward.

## Missing, stale and conflicting evidence

- Unavailable evidence suppresses affected national claims; it contributes
  neither zero nor a redistributed weight.
- A stale critical input suppresses the current label and is named to users.
- Manual and programmatic evidence remain distinct. Automation does not upgrade
  a manual source's evidentiary meaning.
- Conflicting sources are displayed separately until a documented resolution
  rule identifies comparable scope, period, unit, revision status and publisher
  independence. No average or preferred source is selected silently.
- Derived inputs require named parents, aligned periods/units, a published
  formula and calculation tests.
- Publisher concentration is traced to ultimate publishers, including through
  derived inputs; multiple files from one publisher are not independent sources.

## Conditions required to clear the gate

All open blocker records in the machine gate must be resolved with dated
evidence. At minimum, a future PR must:

1. approve one output and claim boundary, reconciling the four-state issue and
   archived five-band candidate;
2. approve the exact source IDs, core product/geographic scope and exclusions;
3. establish rights-safe coverage or explicitly narrow the claim for outage,
   terminal and shipping gaps;
4. justify every empirical threshold with measurement and sensitivity results;
5. build a provenance-preserving historical replay that covers revisions,
   missingness and alternative windows;
6. specify uncertainty, source conflict, source independence and non-adaptive
   missing-data rules;
7. implement all calculations in a separate reviewed change with tests for
   every boundary and transition; and
8. record named methodology approval before setting any publication flag.

A validator pass alone cannot approve the methodology. Schema changes that
resolve a threshold or blocker require review of the JSON, this document and
the validator together.

## What passing would not prove

Even a future passing gate would not mean:

- an Australian government endorses the model;
- every upstream source or value is correct;
- all private fuel stocks are known;
- every terminal is covered;
- all disruptions are visible;
- the result predicts a shortage; or
- the result is an official security assessment.

It would also not be a certification, a security audit or proof that every
source remains reachable.

## Evidence and access record

Repository evidence was inspected on 2026-08-03:

- `data/source_manifest.json`
- `data/trust_status_manifest.json`
- `data/site_routes.json`
- `data/manual/fuel_security_status_model.json`
- `data/manual/fuel_security_live_station_outage_feed.json`
- `data/manual/fuel_security_terminal_capacity.json`
- `data/manual/fuel_security_live_vessel_tracking.json`
- `docs/fuel-security-methodology.md`
- `docs/fuel-stress-index-spec.md`
- GitHub issue #37

The registered PM&C source is
<https://www.pmc.gov.au/domestic-policy/fuel-supply-taskforce/public-information-fuel-supply>
and its copyright/disclaimer record is
<https://www.pmc.gov.au/copyright-and-disclaimer>. Both were assessed through
the repository's governed source record on 2026-08-03; this gate does not claim
that a successful or blocked HTTP request proves source freshness or
availability.
