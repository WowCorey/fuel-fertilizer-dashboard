# Phase 3 Trust Status v2

**Project:** Fuel Resilience AU  
**Repository:** `WowCorey/fuel-fertilizer-dashboard`  
**Review date:** 2026-08-02 AEST  
**Branch:** `phase-3-trust-status-v2`  
**Base:** Phase 2B head `aa7ea38b96b869871754d2eb58bc845feb91a85c`

## Executive result

Phase 3 replaces the obsolete May-era trust-page concept with a generated public operational-transparency layer.

Trust Status v2 is not a hand-maintained score and does not recursively guess the meaning of arbitrary JSON objects. It is generated from explicit repository evidence:

- the current source manifest;
- committed generated and manual envelopes;
- project-validator output;
- the latest committed refresh marker;
- the optional classified source-link health report;
- named workflow configuration files.

The public page shows source modes, envelope states, validation warnings, manual versus generated review debt, latest refresh evidence, classified link health, unavailable-source coverage and workflow configuration. It includes explicit boundaries against presenting the result as certification, official government status, a security audit or proof of upstream accuracy.

---

## 1. Why the previous trust branch is superseded

PR #108 was created from the May 2026 repository state and used a hand-authored trust manifest. Its public page used a generic recursive summariser that could over-count or misclassify nested objects, and the branch did not include the later source governance, fuel-data refreshes or classified link-health work.

Phase 3 preserves the useful idea — a public credibility surface — but replaces the implementation with explicit generated fields and current repository evidence.

The new work is stacked on Phase 2B rather than copied onto `main`, so source-governance review remains separate and traceable.

---

## 2. Generated trust manifest

### Builder

`scripts/build_trust_status.py`

Output:

`data/trust_status_manifest.json`

Schema:

`fuel_resilience_trust_status.v2`

### Source inventory

The builder reads `data/source_manifest.json` and reports exact counts for:

- programmatic sources;
- manual sources;
- derived sources;
- unavailable sources;
- total registered sources;
- generated-only, manual-only, duplicate and missing envelope presence.

It separately inspects JSON envelopes to report:

- total envelope files;
- generated and manual file counts;
- `ok`, `unavailable` and unexpected status counts;
- manual-entry and generated-entry counts;
- unreadable files.

This avoids presenting “source mode” and “current envelope status” as the same concept.

### Validation evidence

The builder runs `scripts/validate_project.py --json` and records:

- blocking error count;
- warning count;
- manual stale warnings;
- generated stale warnings;
- rights-metadata warnings;
- source-name and source-URL mismatches;
- limited examples for public diagnosis.

A successful refresh therefore cannot hide overdue manual evidence.

### Refresh evidence

The builder reads `data/last_successful_refresh.json` and reports:

- recorded status;
- refresh timestamp;
- workflow name;
- run ID and attempt;
- reported SHA;
- the evidence path.

The manifest explicitly discloses the current v1 SHA ambiguity: the marker records the workflow input commit and may not identify the later commit that contains the published refresh.

### Link health

When `data/source_link_health.json` exists, Trust Status publishes its classified category counts and definite-repair count.

When it does not exist, the trust manifest says `not_yet_generated`. It does not substitute zero or infer that all links are healthy.

### Unavailable-source coverage

The builder counts unavailable registry entries by their `used_by` dashboards and publishes the top affected dashboard surfaces.

These counts are public-data visibility gaps only. They are not official risk scores, severity rankings or evidence of wrongdoing.

---

## 3. Overall status logic

Trust Status v2 uses a small deterministic status set:

| Status | Condition |
|---|---|
| `validation_failed` | Project validator reports one or more blocking errors |
| `refresh_status_unknown` | No successful committed refresh marker is available |
| `operational_with_warnings` | Validation succeeds but warnings or definite link repairs remain |
| `operational` | Validation succeeds, refresh status is successful and no disclosed warning/repair condition remains |

The status is descriptive. It is not a reliability percentage, certification grade or upstream-data guarantee.

---

## 4. Public page

### Primary page

`ui_kits/trust-status-dashboard/index.html`

### Top-level entry point

`trust-status.html`

The page is deliberately independent of the repository's externally hosted React runtime. It uses:

- local project styles;
- native browser JavaScript;
- DOM nodes populated through `textContent`;
- the single generated Trust Status manifest.

It does not:

- load React or ReactDOM from `unpkg`;
- recursively inspect unrelated JSON;
- use an opaque composite score;
- use HTML-string injection for manifest data;
- claim latest CI or Pages conclusions from workflow configuration alone.

### Public sections

The page includes:

1. overall repository status;
2. source inventory;
3. validation and review debt;
4. latest recorded refresh;
5. classified link health;
6. unavailable-source coverage;
7. workflow evidence;
8. confidence bands;
9. trust rules;
10. claim boundary.

### Failure behaviour

If the generated manifest cannot be loaded, the page displays an explicit unavailable state and says no fallback score or estimate was substituted.

---

## 5. Workflow integration

### Continuous integration

CI now:

1. compiles the Trust Status builder and validator;
2. applies governed canonical URLs;
3. validates the source registry, envelopes and governance;
4. generates Trust Status v2;
5. validates Trust Status v2;
6. runs unit and browser tests.

### Weekly refresh

The weekly data workflow now:

1. refreshes programmatic sources;
2. rebuilds the source manifest;
3. applies governed URLs;
4. generates classified link health;
5. validates project evidence;
6. writes the refresh marker;
7. generates and validates Trust Status v2;
8. commits changed data, including the trust and link-health reports.

### GitHub Pages

The Pages workflow installs the Python requirements, applies governed URLs, generates Trust Status v2 and validates it before uploading the static artifact.

This ensures the deployed public page receives a current generated manifest even when the committed bootstrap file has not yet been replaced by a scheduled refresh.

---

## 6. Validation contract

`scripts/validate_trust_status_v2.py` verifies:

- the v2 schema and allowed status values;
- source-mode counts and totals;
- envelope-presence totals;
- validation error/warning shapes;
- existing evidence paths;
- explicit refresh-SHA semantics;
- advisory link-health treatment;
- unique workflow IDs;
- workflow configuration/run-result separation;
- all four evidence confidence bands;
- minimum trust-rule coverage;
- claim-boundary language;
- the existence and content contract of the public page;
- absence of external React development bundles and HTML-string injection patterns.

---

## 7. Tests

### Python unit tests

`tests/test_trust_status_v2.py`

Coverage includes:

- source-mode and envelope-presence counting;
- unavailable-source dashboard aggregation;
- separation of manual and generated staleness;
- validation failures taking priority over refresh status;
- warnings producing an operational-with-warnings state;
- missing link-health evidence remaining unknown rather than healthy;
- explicit refresh-marker SHA semantics.

### Browser tests

`tests/trust-status-smoke.spec.js`

Coverage includes:

- page and manifest loading;
- required public sections;
- exact source metrics rendering;
- claim-boundary text;
- absence of external `unpkg` scripts;
- no browser or console errors;
- workflow configuration being separated from latest-run conclusions.

---

## 8. Bootstrap manifest

The committed `data/trust_status_manifest.json` starts as an explicit zero-count bootstrap document.

It warns that it is not publication evidence. CI, weekly refresh and Pages all run the builder before validation or deployment, replacing those placeholders with repository-derived counts.

The bootstrap avoids pretending that manually guessed source-mode totals are current.

---

## 9. Deliberate non-claims

Phase 3 does not claim that:

- Trust Status certifies the project;
- the project is an official government dashboard;
- validation proves upstream facts are correct;
- successful CI proves the latest Pages deployment succeeded;
- a configured workflow proves its latest run passed;
- a successful automated refresh makes manual sources current;
- a missing link-health report means all links are healthy;
- an unavailable source means the underlying real-world value is zero;
- unavailable-source counts are risk scores;
- every public publisher page is reachable from GitHub Actions;
- the old PR #108 should be merged.

---

## 10. Merge and dependency rule

Phase 3 is intentionally stacked on Phase 2B.

Recommended order:

1. review and merge Phase 2B PR #109;
2. retarget or update the Phase 3 branch to `main` after Phase 2B lands;
3. confirm Phase 3 CI again;
4. close PR #108 as superseded;
5. merge Phase 3 only after the generated public page and claim boundaries are reviewed.

---

## Phase 3 conclusion

Fuel Resilience AU now has a generated, inspectable and fail-closed trust surface rather than a hand-maintained confidence story.

The trust layer does not ask readers to believe the project. It shows the repository evidence, the warnings, the gaps and the limits of what the evidence can prove.
