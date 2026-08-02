# Phase 5C State and Territory Fuel Coverage Audit

- **Audit date:** 2026-08-03
- **Branch:** `phase-5c-state-coverage`
- **Base:** `origin/main` at `d4802573d881dbb49b0f4d0d71a5dbb8d18851e7`
- **Repository:** `WowCorey/fuel-fertilizer-dashboard`

## 1. Scope

This audit rechecked official public fuel-visibility sources for NSW, Victoria,
Queensland, Western Australia, South Australia, Tasmania, the ACT and the
Northern Territory. It covered:

- retail prices;
- station/product availability and stock-outs;
- emergency and disruption notices;
- minimum-stock and reserve disclosures;
- terminal and port context;
- API/file/dashboard access, authentication, fields, units and cadence;
- rights and reuse boundaries; and
- the repository's present integration and explicit blockers.

Issues [#33](https://github.com/WowCorey/fuel-fertilizer-dashboard/issues/33)
through [#37](https://github.com/WowCorey/fuel-fertilizer-dashboard/issues/37)
were inspected directly, including the owner update on issue #34.

## 2. Evidence rules used

Only government or government-operated primary sources were used for source
decisions. A source was not upgraded merely because its landing page loaded.
The review kept these states separate:

- open data that can be reproduced now;
- an approval-, credential- or contract-gated official API;
- an official public UI without a documented reuse path;
- exact dated manual evidence;
- qualitative context; and
- unavailable data.

An HTTP `403`, `429`, timeout or anti-bot response was recorded as an access
condition, not proof that the underlying dataset was unavailable. No app
traffic, AIS feed or challenge page was reverse-engineered.

## 3. Starting repository evidence

At the branch point:

- the generated multi-state retail envelopes contained Queensland and Western
  Australia, with NSW described as optional when one secret was configured;
- Queensland's `Price = 9999` monthly change rows were loaded as partial
  unavailable-fuel reports, not as a current outage total;
- the dated Fuel Plan state/territory stock-out table, exact WA Fuel Plan row
  and qualitative WA Government update were separate manual evidence;
- `fuel_security_live_station_outage_feed`,
  `fuel_security_terminal_capacity`,
  `fuel_security_live_vessel_tracking` and
  `fuel_security_status_model` remained unavailable; and
- several methodology notes still contained April-era source findings that no
  longer described the current Fuel Plan page or current state APIs accurately.

No new fuel price, stock-out, reserve, terminal, vessel or status value was
added by Phase 5C.

## 4. P1 defect: NSW FuelCheck authentication contract

The existing NSW function was not a valid implementation of the official API
contract. It read one `NSW_FUELCHECK_API_KEY` value and sent it simultaneously
as:

- `Authorization: Bearer <value>`; and
- `apikey: <value>`.

It did not exchange an API key and secret for a short-lived OAuth token. It
also omitted `Content-Type`, `transactionid`, `requesttimestamp` and an
explicit NSW state query. The weekly workflow supplied only one secret.

The official [Fuel API product page](https://api.nsw.gov.au/Product/Index/22),
[Swagger specification](https://apinsw.onegov.nsw.gov.au/api/swagger/spec/22)
and [support process](https://api.nsw.gov.au/Support) show that the current v2
read flow requires:

1. approved consumer key and consumer secret;
2. Basic-auth client-credentials token exchange;
3. bearer access token plus consumer key in the data request;
4. required content type, transaction ID and UTC request timestamp; and
5. optional state selection, set explicitly to `NSW` by this repository.

Phase 5C corrects the client and adds `NSW_FUELCHECK_API_SECRET` to the refresh
workflow. Credentials and tokens are never written to fetch output. Missing or
partial credentials make no network request. Authentication errors, unapproved
tokens, non-200 price responses, schema drift, non-NSW rows, malformed price
records, invalid dates and empty product results all exclude NSW.

If every state contributor fails, the multistate fetch now raises an error
before writing; an existing generated envelope is not replaced by an empty
failure artifact.

The parser now consumes only the documented v2 `stations` and `prices` fields.
It converts the documented Australian date/time forms to ISO dates instead of
copying `DD/MM/YYYY` text or substituting the current date.

## 5. NSW claim boundary

FuelCheck operators must report unavailability and the consumer interface can
display it, but the public v2 read response does not expose an availability
field. The repository therefore uses NSW only for price observations and makes
no NSW stock-availability claim.

The old retailer-submission API's `isavailable` field is a write-interface
field. It is not evidence that the current public read API exposes availability.

The open [monthly FuelCheck history](https://www.data.nsw.gov.au/data/dataset/fuel-check)
is useful price history, but is not a current-feed or availability substitute.
It was documented but not added as a new source in this phase.

## 6. Jurisdiction results

The full field, access, cadence, rights and blocker matrix is in
[`docs/state-territory-fuel-coverage-matrix.md`](../state-territory-fuel-coverage-matrix.md).

The operative conclusions are:

- **NSW:** current price API is usable only after approved key/secret OAuth;
  no availability field in the public read response.
- **Victoria:** the 24-hour-delayed Servo Saver API exposes `isAvailable` under
  CC BY 4.0 but requires application approval and credentials.
- **Queensland:** monthly CC BY 4.0 `9999` change rows are already integrated;
  the direct feed requires publisher approval and restrictive terms.
- **Western Australia:** RSS price reuse is documented; RSS has no availability
  field. Weekly qualitative language remains separate from numeric evidence.
- **South Australia:** the publisher API exposes `9999` unavailability but is
  subscriber-token and contract gated.
- **Tasmania:** API NSW v2 supports prices but not availability. Weekly official
  reports can provide exact dated manual evidence; no new value was loaded.
- **ACT:** the public FuelCheck interface is not backed by a documented ACT
  developer API; historical coverage is voluntary/opt-in.
- **Northern Territory:** MyFuel NT provides a mandatory public UI but no
  documented public API or broad reuse licence was verified.

No jurisdiction source closes the national live station-outage gap.

## 7. National snapshot recheck

The former PM&C URL can still return a small Incapsula incident response. The
canonical [Australian Government Fuel Plan statistics page](https://fuelplan.gov.au/fuel-statistics)
was directly accessible on 2026-08-03 and exposed the expected static HTML
tables, including both Australian petrol and diesel stock-out totals.

No stable official CSV, XLSX, JSON, JSON:API or other machine-readable snapshot
endpoint was verified. The canonical page's accessibility invalidates the old
claim that the publication itself is unavailable, but does not create a
production-safe API contract. The manual source remains the conservative
choice unless issue #33 deliberately authorises and tests a strict HTML table
contract.

[DCCEEW MSO statistics](https://www.dcceew.gov.au/energy/security/australias-fuel-security/minimum-stockholding-obligation/statistics)
remain national weekly/quarterly evidence. They do not provide state, station,
terminal or live outage coverage.

## 8. Source-governance decisions

The NSW OAuth endpoint is a machine authentication endpoint, not a canonical
public evidence landing page. It is therefore represented as an operational
source field in `data/sources.yml`, not as a new canonical-URL governance
override. The existing narrow governance overlay continues to point the former
PM&C source IDs to Fuel Plan.

The four multi-state retail entries now state both credential requirements,
the OAuth dependency and the absence of a public read-API availability field.
Their evidence mode, cadence, rights, values and current contributing states
were not upgraded.

Existing generated retail envelopes received metadata-only note corrections.
Their values, dates, retrieval timestamps and state breakdowns did not change.

The unavailable live-station and status-model envelopes were refreshed only to
remove superseded blocker wording and to recognise the current national petrol
total. Their status remains `unavailable` and their values remain empty.

## 9. Issue recommendations

- **#33:** do not close before merge. On merge, either close with explicit
  blocker evidence—official static HTML but no machine-readable endpoint—or
  keep open only if a strict, validator-tested HTML contract is deliberately
  brought into scope. Do not retain the obsolete Incapsula-only explanation.
- **#34:** do not close before merge. The QLD partial layer already meets the
  literal implementation condition; Phase 5C supplies all-jurisdiction blocker
  evidence. After merge, close as partial coverage or split credentialed VIC/SA
  follow-ups rather than implying national coverage.
- **#35:** dedicated draft PR
  [#113](https://github.com/WowCorey/fuel-fertilizer-dashboard/pull/113)
  owns the terminal-capacity source gate. State reserve, port and TGP context
  must not be duplicated as capacity. That draft is not landed evidence.
- **#36:** dedicated draft PR
  [#114](https://github.com/WowCorey/fuel-fertilizer-dashboard/pull/114)
  owns the shipping-data gate. Phase 5C makes no AIS, vessel, ETA or cargo
  claim. That draft is not landed evidence.
- **#37:** keep open. The repository still lacks one internally consistent
  four-band method with source-specific freshness, product/geographic coverage,
  missing-data behaviour and tests for every transition. The status model must
  remain unavailable.

No issue should be closed until the relevant audit/implementation PR is merged.

## 10. Validation and residual limitations

Phase 5C validation covers the exact OAuth exchange, required request headers,
NSW-only query, both documented timestamp shapes, missing credentials,
authentication failure, schema drift and all-contributor failure preservation.

Local results:

| Command / check | Result |
|---|---|
| `npm ci` | Passed; 56 packages installed, 57 audited, 0 vulnerabilities. |
| `npm audit` | Passed; 0 vulnerabilities. |
| `npm run check:ui` | Passed. |
| `npm run test:ui-unit` | Passed; 6/6 tests. |
| `python -m py_compile` for every `scripts/*.py` file | Passed; 12/12 maintained scripts. |
| `python scripts/build_source_manifest.py` and `--check` | Passed. |
| `python scripts/apply_source_url_governance.py` and `--check` | Passed. |
| `python scripts/validate_project.py` | Passed with 17 declared freshness warnings: 13 manual and 4 generated; no rights, URL/source-name or other warning. |
| `python scripts/build_trust_status.py`, `--check` and `python scripts/validate_trust_status_v2.py` | Passed. The time-only `generated_at` rebuild was not retained as meaningless churn. |
| `python -m unittest discover -s tests` | Passed; 72/72 tests. |
| `npx playwright install chromium` | Passed. |
| `npm run smoke:ui` | Passed; 62/62 Chromium tests, including all public routes and console-error checks. |
| Two consecutive `npm run build:ui` runs plus `npm run check:ui` | Passed; Git-filtered output hashes were identical and no UI content diff remained. Windows emitted line-ending/stat warnings only. |
| `python scripts/check_source_links.py --no-write` | Advisory run completed for 219/219 sources: 102 healthy, 52 healthy internal, 5 healthy redirects, 20 access-blocked, 13 blocked canonical landing pages with healthy fetch endpoints, 27 transient errors and 0 definite repair categories. |

CI run IDs are recorded in the draft PR after the branch is pushed.

Residual limitations:

- no approved NSW credentials were available in this audit environment, so a
  live authenticated response could not be independently exercised;
- API NSW application approval remains an external operational dependency;
- the API product does not grant public stock-availability data;
- Victoria and South Australia remain credential/approval/terms gated;
- ACT and NT remain public-UI-only for production ingestion;
- Tasmania LIST reuse and review-date boundaries remain insufficient for an
  availability feed;
- no national live outage feed, terminal-capacity feed, live vessel feed or
  defensible national status model was unlocked; and
- official sites and contracts may change after the 2026-08-03 review date.
