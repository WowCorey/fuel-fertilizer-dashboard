# Reliability specification

Sets the SLO/SLI targets, stale/degraded behaviour rules and no-silent-failure
requirements that the dashboard and data pipeline must obey. These targets
apply during the current public-only feasibility phase and tighten when the
AU-hosted migration lands per
[../adr/0001-au-hosted-migration-architecture.md](../adr/0001-au-hosted-migration-architecture.md).

Priority order (repeats the project rule): accuracy > completeness > speed >
user experience.

## 1. Service Level Objectives

SLO windows are rolling 28 days unless noted.

| ID | Objective | SLI (how it is measured) | Target (Phase A-B) | Target (Phase C+) |
|----|-----------|--------------------------|--------------------|-------------------|
| SLO-1 | Dashboard availability | HTTP 200 on each page's index on synthetic check | >= 99.0 % | >= 99.9 % |
| SLO-2 | Envelope validator pass rate on merges to `main` | Share of merges where `validate_data.py` exits 0 | 100 % (blocking gate) | 100 % (blocking gate) |
| SLO-3 | Programmatic refresh success rate | Share of scheduled runs where every programmatic fetcher exits 0 | >= 95 % | >= 99 % |
| SLO-4 | Source freshness within cadence | Share of `status: "ok"` envelopes whose `last_data_point` is inside the stale-grace window in [../../scripts/validate_data.py](../../scripts/validate_data.py) | >= 90 % | >= 97 % |
| SLO-5 | No silent failure | Zero envelopes with `status: "ok"` and a stale warning past double the grace window | 100 % (hard requirement) | 100 % (hard requirement) |
| SLO-6 | Correction lead time | Time between SEV-1/SEV-2 detection and merged correction | <= 2 business days | <= 1 business day |

Error budget: the complement of the SLO target over the window. Budget
consumption is reviewed monthly. Consumption above 50 % in a window pauses
non-critical feature work.

## 2. SLIs and measurement

Until centralised monitoring lands at Gate C, measurement uses:

- GitHub Actions run outcomes for SLO-2 and SLO-3.
- Manual synthetic checks for SLO-1, logged at publish time.
- Validator output for SLO-4 and SLO-5.
- Incident log for SLO-6.

Gate C replaces the manual measurements with synthetic monitors and a
centralised dashboard.

## 3. Stale and degraded behaviour rules

These rules are non-negotiable.

1. Every "Updated" label on a page is computed only from envelopes with
   `status: "ok"` and a valid `retrieved_at`. If no envelope qualifies for
   the page, the page says so in plain English; no timestamp is shown.
2. A card reading from an envelope with `status != "ok"` must render
   "Source unavailable - awaiting data" (or the equivalent agreed copy),
   not a blank value or a stale last-known value.
3. An envelope whose `last_data_point` is past the cadence stale grace
   window produces a validator warning; the card's UI text must include a
   visible staleness indicator when the warning is present.
4. An envelope whose `last_data_point` is past double the grace window must
   flip to `status: "unavailable"` at the next refresh cycle; the dashboard
   must not continue rendering a stale figure as fresh.
5. If a fetcher raises, its prior envelope is preserved; it is not
   overwritten with a partial or guessed value. The failure is surfaced in
   the refresh workflow summary.
6. The dashboard must never swap in alternative or inferred values to
   "fill" a gap. Structural absence is the correct behaviour.

## 4. Degraded mode

Degraded mode is the static site serving last valid envelopes while refresh
is paused. It is the default failure mode by design.

- Users see either current valid data or an explicit unavailable placeholder
  per section 3.
- No banner is shown during routine cadence waits; a banner is added only
  when a SEV-1 or SEV-2 incident affects visible data, and is removed at
  close.
- Read-only degradation does not require a flag; the site is read-only by
  nature. Gate C introduces a deliberate read-only toggle for origin-side
  failures.

## 5. Change budget

- A release that would predictably reduce any SLO for more than one week
  requires reviewer sign-off and a dated entry in
  [risk-register.md](risk-register.md).
- A change that affects envelope semantics, validator behaviour or page
  rendering of stale/unavailable states requires a test under `tests/` and
  an update to this file in the same change.

## 6. Review cadence

- Weekly: scan latest scheduled refresh output for pipeline failures.
- Monthly: compute SLIs for the trailing 28 days and log results.
- Quarterly: re-baseline targets if sustained over- or under-performance
  is observed.

## Change log

- 2026-04-21 - Initial SLO/SLI and stale/degraded rules.
