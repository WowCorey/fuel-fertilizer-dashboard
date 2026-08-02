# Phase 2B Source Governance and Link-Health Repair

**Project:** Fuel Resilience AU  
**Repository:** `WowCorey/fuel-fertilizer-dashboard`  
**Review date:** 2026-08-02 AEST  
**Branch:** `phase-2b-source-governance`

## Executive result

Phase 2B converts source-link maintenance from a flat HTTP-error list into a governed and classified evidence process.

This phase does four things:

1. establishes current canonical URLs while preserving legacy and supporting URLs;
2. splits the WA fuel evidence into a quantified Fuel Plan metric and a qualitative WA Government situation statement;
3. adds a machine-readable link-health classifier that distinguishes broken links from access blocks, timeouts, malformed URLs and missing internal documents;
4. wires the governance layer into CI, weekly refresh and GitHub Pages deployment without weakening the dashboard's fail-closed data rules.

No source value was invented. The only numeric change in this phase is the WA metric split, which uses the WA row already verified in the official Fuel Plan table during Phase 2A.

---

## 1. Why a governance layer is required

`data/sources.yml` is the long-standing canonical source registry. Over time, several official publishers moved or redirected landing pages while the machine fetch endpoints continued to work. The previous broad link check treated all failures alike, even though these conditions mean different things:

- an official page has moved and returns `404`;
- an official page rejects the GitHub Actions runner with `403`;
- a publisher temporarily times out;
- the canonical page is inaccessible but its machine dataset endpoint is healthy;
- a project-authored methodology page is missing;
- a registry URL is blank or malformed.

A flat error total cannot distinguish repair work from access limitations and cannot safely be used as a public source-health claim.

Phase 2B therefore introduces a narrow migration layer rather than performing a high-risk full rewrite of the 218-entry source registry before Codex review.

---

## 2. Canonical URL governance

### New governed file

`data/source_url_governance.json`

Schema:

`fuel_resilience_source_url_governance.v1`

Each override can record:

- current canonical URL;
- historical or compatibility URLs;
- supporting official URLs;
- review date;
- reason for the decision.

The file is deliberately limited to sources with a confirmed migration, redirect, broken landing page or missing project source-gate document. It does not alter values, dates, status, cadence, rights, fetch mode or citation content.

### Current decisions

#### Australian Government Fuel Plan cluster

The current canonical source is:

`https://fuelplan.gov.au/fuel-statistics`

The former PM&C public-fuel-supply path is preserved as a legacy URL because it redirects to the current Fuel Plan page.

Governed IDs:

- `pmc_fuel_security_level`
- `pmc_mso_days_cover`
- `pmc_mso_fuel_reserves`
- `pmc_forward_import_orders`
- `pmc_tankers_on_water`
- `pmc_retail_stockouts`
- `fuel_security_petrol_days_remaining`
- `fuel_security_diesel_days_remaining`
- `fuel_security_jet_days_remaining`

The DCCEEW minimum-stockholding statistics page is retained as supporting evidence for the MSO and product-day sources.

#### ACCC petroleum-report collection

The obsolete `petroleum-monitoring-reports` collection URL is replaced by the current ACCC Australian petroleum industry quarterly reports collection for the affected source-gate rows.

This corrects the canonical path without converting unavailable component rows into verified numeric values.

#### ABS dwelling stock

`abs_residential_dwelling_stock` is mapped from the obsolete finance path to the current ABS Total Value of Dwellings landing page under price indexes and inflation.

#### Additional confirmed 404 repairs from hostile review

The classified checker found three further confirmed 404 responses. Their current official replacements are governed without changing any envelope values or evidence status:

- `ato_corporate_tax` now uses the current ATO Report of entity tax information page and retains the official data.gov.au workbook dataset as supporting evidence;
- `resource_prrt_policy` now uses the current ATO PRRT topic under GST, excise and indirect taxes;
- `iea_90day` now uses the IEA Oil Stocks of IEA Countries data tool, which documents the 90-day obligation and methodology.

#### Missing internal source documents

Phase 2B adds:

- `docs/employment-automation-methodology.md`
- `docs/data-centre-capacity-source-gate.md`

These pages repair the internal documentation gap without filling unavailable metrics with unsupported estimates.

---

## 3. WA metric split

### Previous state

`wa_fuel_security_stockouts` contained a single April 2026 statewide aggregate from an older WA Government update. The latest WA weekly publication changed to qualitative language and no longer provided the same numeric total.

Using that qualitative statement to generate a current number would violate the project's evidence rules.

### New governed state

The repository now uses two registered source IDs and two envelopes so the products cannot be conflated:

#### Quantified state row

Source: Australian Government Fuel Plan retail stock-outs table  
Data date: 2026-07-31
Envelope: `wa_fuel_security_stockouts`

- WA sites covered: 1,002
- petrol stock-out sites: 3
- diesel stock-out sites: 3
- displayed series: diesel stock-out sites

#### Qualitative weekly situation

Source: WA Government Weekly Fuel Update
Evidence date recorded in Phase 2A: 2026-07-24
Envelope: `wa_fuel_security_weekly_update`

The WA statement is retained as qualitative evidence that supplies are stable for July and August and stock-outs remain low. Its envelope contains no display values and explicitly records that the statement must not be converted into a numeric value.

#### Historical provenance

The earlier April snapshot of 10 stock-outs among 771 stations remains in typed metadata as historical provenance. It is not the current display value and is not represented as directly comparable with the current product-specific Fuel Plan row.

---

## 4. Classified link-health model

### New checker

`scripts/check_source_links.py`

Output:

`data/source_link_health.json`

Schema:

`fuel_resilience_source_link_health.v2`

### Categories

| Category | Meaning |
|---|---|
| `healthy` | Canonical URL responded successfully |
| `healthy_redirect` | Canonical URL succeeded after a redirect |
| `healthy_internal` | Project-authored source document exists in the repository |
| `confirmed_broken` | Canonical URL returned a definite `404` or `410` |
| `access_blocked` | Publisher returned `401`, `403` or `429` |
| `transient_error` | Timeout, connection failure or retryable server response |
| `malformed_url` | Blank or invalid public URL |
| `internal_missing` | Project-authored GitHub Pages document does not exist locally |
| `http_error` | Other classified request error |
| `checker_failure` | The checker itself failed unexpectedly; classification coverage is incomplete |
| `canonical_blocked_fetch_healthy` | Public landing page is blocked or transiently inaccessible while the machine fetch endpoint is healthy |
| `canonical_broken_fetch_healthy` | Public landing page is definitely broken while the machine fetch endpoint remains healthy |

### Claim boundary

A failed automated request to a landing page is not, by itself, proof that the underlying dataset is unavailable.

Only definite repair categories are counted as registry work:

- confirmed broken URL;
- broken canonical URL with healthy fetch endpoint;
- malformed URL;
- missing internal documentation.

The weekly report remains advisory so an anti-bot response cannot prevent a valid, validated data refresh.

---

## 5. Validation and deployment design

### Source URL application

`scripts/apply_source_url_governance.py`

The script:

- applies the current canonical URL to governed envelopes;
- attaches provenance metadata describing the migration;
- fails when a governed source has no matching envelope;
- supports check and single-source modes;
- does not modify values or evidence status.

### Validation wrapper

`scripts/validate_project.py`

The wrapper runs the existing data validator, preserves its errors and warnings, and adds governance checks for:

- schema and review date;
- known source IDs;
- valid canonical, legacy and supporting URLs;
- non-empty decision reasons;
- matching governed envelope URL and provenance metadata.

It suppresses only the expected legacy warning that a governed envelope differs from the old registry canonical URL. All other base warnings remain visible.

### CI

CI now:

1. compiles the new scripts;
2. checks the source manifest;
3. applies the governed URLs;
4. validates the base data and governance layer;
5. runs unit and browser tests.

The link classifier has dedicated unit tests covering status classification, malformed URLs, internal-document checks, response cleanup and the distinction between a blocked landing page and a healthy fetch endpoint.

### Weekly refresh

The weekly workflow now:

1. checks blocking machine fetch URLs;
2. fetches programmatic sources;
3. creates required manual stubs;
4. rebuilds the source manifest;
5. applies governed canonical URLs;
6. writes the classified advisory link-health report;
7. validates data and governance;
8. writes the refresh marker;
9. commits changed data.

### GitHub Pages

The Pages workflow applies the governed canonical URLs before uploading the static artifact. This ensures public source links use the current governed destination even during the transitional period before stable migrations are folded back into `data/sources.yml`.

---

## 6. Transitional architecture decision

Phase 2B does not perform a wholesale rewrite of `data/sources.yml`.

This is intentional:

- the registry contained 218 entries at the branch point and now contains 219 after the qualitative WA evidence was assigned its own source ID;
- source metadata changes can affect generated manifests, validation and many envelopes;
- the current task is to establish a safe evidence mechanism before Codex performs the broader cleanup;
- the migration layer is explicit, validated and reversible.

Once the branch passes CI and the classifications have been reviewed, stable canonical migrations can be folded into `data/sources.yml` in a controlled Codex change. At that point the corresponding overrides can be removed.

The governance file should remain narrow. `validate_project.py` warns if it grows beyond 50 source IDs.

---

## 7. Deliberate non-claims

Phase 2B does not claim that:

- every one of the former 73 link failures has been repaired;
- a `403` proves a source is unavailable;
- a timeout proves an official page is obsolete;
- a healthy landing page proves the data value is current;
- the WA qualitative statement contains a numeric stock-out total;
- the current WA Fuel Plan row is directly comparable with the historical WA aggregate;
- CI or browser tests passed before the pull-request run completed;
- the governance overlay should permanently replace `data/sources.yml`.

---

## 8. Review checklist

Before merge:

- confirm all governed IDs have a matching envelope;
- confirm CI compilation and governance validation pass;
- confirm existing unit tests pass;
- confirm browser smoke tests pass;
- inspect the generated link-health category counts;
- review the WA card wording and unit in the deployed preview or local build;
- ensure no data status was upgraded merely because a URL changed;
- keep the pull request unmerged until review is complete.

---

## Phase 2B conclusion

The project now has a defensible distinction between stale links, blocked publishers, transient network conditions, missing internal documents and healthy machine feeds. The WA evidence no longer forces a qualitative state statement into an unsupported number, and the current numeric WA row is preserved separately with explicit scope.

This is the source-governance foundation required before Trust Status v2 and the wider Codex-led repository cleanup.
