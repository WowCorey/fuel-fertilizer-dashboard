# Phase 4.1 post-merge live verification

**Audit date:** 2026-08-03 (Australia/Brisbane)  
**Repository:** `WowCorey/fuel-fertilizer-dashboard`  
**Audit branch:** `phase-4-1-live-verification`  
**Live site:** <https://wowcorey.github.io/fuel-fertilizer-dashboard/>  
**Scope:** merged Phase 4 state, Actions and Pages evidence, the deployed 23-route site, and one controlled weekly-refresh dispatch

## Decision

Phase 4 is deployed, and the first real refresh-marker v2 publication completed successfully. The committed and deployed marker is a truthful `published` marker for an earlier pushed output commit; it does not claim to prove the latest deployed commit.

The hostile verification found two material classes of defect:

1. commits pushed by the weekly workflow's default `GITHUB_TOKEN` did not trigger the existing `push`-only CI or Pages workflows, so the refreshed commits had neither automatic downstream validation nor deployment; and
2. the live narrow-layout audit found non-focusable skip-link targets on 22 of 23 routes and document-level horizontal overflow on 12 routes.

This branch adds success-and-main-gated `workflow_run` triggers, a manual CI dispatch path, deployment-targeted smoke testing, focusable main targets, and shared narrow-layout containment. These repairs are locally tested but are not deployed until this PR is approved and merged.

## Evidence-state legend

- **Deployed and observed:** read from the live Pages origin or GitHub's deployment record.
- **CI verified:** executed by the identified GitHub Actions run.
- **Locally tested:** executed from this branch against a local static server.
- **Configured, not exercised:** code exists on this unmerged branch but no production workflow has run it.
- **Unavailable to verify:** the required credential, private evidence, or execution record was absent.

## Merge and current-main evidence

PR #111 merged at `2026-08-02T16:14:58Z` as commit `2ed8b90b743b877b19ef99135ce1b4187327ce2a`. The controlled refresh later superseded that merge on `main` with:

- output commit `6ed2b71e7e7c06340fe518f637e392e043520790` (`chore(data): weekly refresh 2026-08-02`); and
- marker-finalisation commit `163b314dd7e9d0168d6fd07742b0f0472f2de317` (`chore(data): record published refresh 2026-08-02`).

At the end of this audit, `163b314dd7e9d0168d6fd07742b0f0472f2de317` is the verified `origin/main` and deployed Pages commit. New Phase 4.1 work is based on that commit and is not on `main`.

## GitHub Actions and deployment evidence

| Evidence | Event | Run / attempt | Head SHA | Started (UTC) | Completed (UTC) | Conclusion | State |
|---|---|---:|---|---|---|---|---|
| Post-merge `CI` | `push` | [30756200007](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/runs/30756200007) / 1 | `2ed8b90b743b877b19ef99135ce1b4187327ce2a` | 2026-08-02 16:15:01 | 2026-08-02 16:16:13 | success | CI verified |
| Post-merge `Deploy GitHub Pages` | `push` | [30756200012](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/runs/30756200012) / 1 | `2ed8b90b743b877b19ef99135ce1b4187327ce2a` | 2026-08-02 16:15:01 | 2026-08-02 16:15:21 | success | deployed and observed before refresh |
| Controlled `Weekly data refresh` | `workflow_dispatch` | [30756882879](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/runs/30756882879) / 1 | `2ed8b90b743b877b19ef99135ce1b4187327ce2a` | 2026-08-02 16:33:00 | 2026-08-02 16:40:10 | success | CI-like refresh controls verified; not a substitute for CI |
| Refreshed `Deploy GitHub Pages` | `workflow_dispatch` | [30757302959](https://github.com/WowCorey/fuel-fertilizer-dashboard/actions/runs/30757302959) / 1 | `163b314dd7e9d0168d6fd07742b0f0472f2de317` | 2026-08-02 16:44:23 | 2026-08-02 16:44:46 | success | deployed and observed |

The refreshed Pages job is `91521582402`. Deployment `5715665621` entered `success` at `2026-08-02T16:44:46Z`, names `github-pages`, records SHA `163b314dd7e9d0168d6fd07742b0f0472f2de317`, and links the production URL above.

The refreshed Pages artifact is artifact `8836327442`, named `github-pages`, with GitHub-recorded digest `sha256:cc2941cef7186a29709feb4b55d00f99b7aba763e7c3579d1785eed7fb216ffc` and size 948,037 bytes. Its extracted payload has 388 files (421 total file/directory entries). The seven required public files below are byte-for-byte SHA-256 matches between that artifact and the live origin.

No automatic CI or Pages run exists for either refresh-created commit. This is not evidence of a failed check; it is evidence that the check never ran. GitHub intentionally suppresses new workflow runs for most events caused by the repository `GITHUB_TOKEN`, so the existing `push` triggers were insufficient. I manually dispatched Pages only after inspecting the refreshed commits and their completed in-workflow validation. CI had no manual-dispatch trigger at that point.

## Weekly-refresh safety review and operational marker proof

Before dispatch, the workflow was verified to:

- expose `workflow_dispatch`;
- check out and write only the selected `main` ref;
- use `contents: write` only in the refresh job;
- serialize per ref with cancellation disabled;
- validate source envelopes and governance before either publication commit;
- preserve good evidence when optional sources cannot be fetched;
- classify network-dependent landing-page health as advisory;
- commit a prepared marker with the output, push that output, and only then finalise a second marker commit against the pushed output SHA; and
- stop safely if the remote branch changes before its guarded push.

No Actions secrets or repository variables were listed. In particular, `NSW_FUELCHECK_API_KEY` was absent, so NSW was skipped and was not represented as zero. The resulting multi-state envelope explicitly says NSW contributes only when the credential is configured. The correctness of the NSW API authentication implementation is outside this live-dispatch proof and remains a Phase 5C source-contract question.

Run `30756882879` completed every fetch, governance, advisory link-health, validation, marker-preparation, Trust Status, output-push, and marker-finalisation step successfully. It created:

- generated-data output commit `6ed2b71e7e7c06340fe518f637e392e043520790`; then
- published-marker commit `163b314dd7e9d0168d6fd07742b0f0472f2de317`.

The committed and deployed marker records:

| Field | Deployed value |
|---|---|
| `schema` | `fuel_resilience_refresh_status.v2` |
| `status` | `success` |
| `publication_state` | `published` |
| `source_data_refreshed_at` | `2026-08-02T16:40:03+00:00` |
| `workflow_input_sha` | `2ed8b90b743b877b19ef99135ce1b4187327ce2a` |
| `run_id` / `run_attempt` | `30756882879` / `1` |
| `ref` / `branch` | `refs/heads/main` / `main` |
| `output_commit_sha` | `6ed2b71e7e7c06340fe518f637e392e043520790` |
| `output_commit_pushed` | `true` |

The marker's own `sha_semantics` states that the output SHA is the earlier pushed output commit, not the later marker commit and not proof of the latest deployed commit. Trust Status renders that boundary in its SHA evidence row. Dashboard headers and footers render the v2 timestamp only because the marker is finalised, published and pushed. Prepared, incomplete and unknown markers remain fail-closed under the retained unit and browser tests.

The Pages job regenerated Trust Status at `2026-08-02T16:44:36+00:00`, after marker finalisation, before uploading its artifact.

## Deployed route audit

All 23 public entries in `data/site_routes.json` were visited on the real Pages origin with Chromium at desktop and 390 x 844 mobile dimensions. Route readiness waited for the expected `h1` and, for React dashboards, removal of the asynchronous `Loading data` state; no arbitrary sleep was used.

The first deployment-targeted Playwright run completed 61 of 63 assertions. Its two failures were the deployed skip-target defect and a test that looked for the deployment-boundary wording in the summary rather than the explicit SHA evidence row. The latter was a test-locator defect, not a missing public claim boundary, and is corrected on this branch. The corrected live rerun completed 62 of 63 tests; its sole failure is the expected deployed skip-target defect. A separate collecting audit completed all 23 routes even after individual defects.

Observed on all 23 routes:

- initial document HTTP 200;
- expected `h1` and a route title containing the registry title;
- asynchronous loading completion where applicable;
- a footer and either visible navigation or its narrow-screen menu control;
- zero same-origin failed requests;
- zero same-origin responses at HTTP 400 or above;
- zero browser-console errors and zero uncaught page exceptions;
- keyboard-openable mobile navigation, modal semantics, Escape close and trigger refocus on the 22 shared-header routes; and
- working same-origin link and fragment audit after asynchronous rendering.

The deployed defects were:

- skip-link activation did not transfer focus to `#main` on 22 routes (Trust Status already had a focusable target); and
- document-level horizontal overflow existed on 12 routes: `fuel_security` (399 px), `power_grid` (704 px), `fertilizer` (408 px), `who_pays_what` (413 px), `au_economics` (432 px), `housing_pressure` (432 px), `state_contribution` (421 px), `resource_value` (406 px), `defence_procurement` (428 px), `strategic_resources` (479 px), `infrastructure` (435 px), and `employment_automation` (465 px), against a 390 px viewport.

The branch makes every shared React `main` programmatically focusable, fixes the static homepage target, and contains long source text, methodology URLs, chart grid items, metric rows and large mobile numerals. The branch's all-route mobile/keyboard regression passes locally. These repairs are **locally tested, not yet deployed**.

## Deployed files, bundles and licences

Every required path returned HTTP 200 and matched the refreshed Pages artifact:

| Public path | Live SHA-256 |
|---|---|
| `data/source_manifest.json` | `1e8718f336bfae18918c8fab010f6d2ad20b295dc430e4bb34b11b0a9831f16a` |
| `data/trust_status_manifest.json` | `d4f499b223727968385832fa5fe361d3f279771d30b29c2ffc98b7b55694461e` |
| `data/last_successful_refresh.json` | `247888b7e8192daa80592bb01f248f533faed5fa9b8d543f870a29f2b2d75b85` |
| `data/site_routes.json` | `295126c22fa17ae3d5293e79c93830d7f85ebe652d2338ff899701dd12197236` |
| `ui_kits/shared/react-vendor.js` | `1b3dc89b72556fb80273f6663a12f82dc3e0c92651a9be01222b6109fa578457` |
| `ui_kits/shared/routes.generated.js` | `62a702de43ac1036b6f87a673a6cdf650e474b90dc1d074ffaccac786b87131a` |
| `ui_kits/shared/THIRD_PARTY_LICENSES.txt` | `12590a1ad025980ed5f91e33a3575e87cc5344d7d0986338b743f931f672e366` |

The deployed vendor bundle contains the production React and ReactDOM identifiers and preserved MIT legal comments. The deployed licence file names React 18.3.1, ReactDOM 18.3.1 and Scheduler 0.23.2 and contains their MIT text. Neither the bundle nor the tested routes referenced unpkg or React development builds; routes loaded local `app.compiled.js` assets. Registry-derived homepage and shared footer route counts reconciled to 23 public routes. Google-hosted fonts remain an external presentation dependency; the application code and React runtime are local.

## Deployed evidence totals after refresh

| Evidence | Count |
|---|---:|
| Registered sources | 219 |
| Programmatic | 52 |
| Manual | 101 |
| Derived | 4 |
| Unavailable / source-gated | 62 |
| Public routes | 23 |
| Validation blocking errors | 0 |
| Manual stale warnings | 13 |
| Generated stale warnings | 4 |
| Rights metadata warnings | 0 |
| Source-name governance warnings | 0 |
| Source-URL governance warnings | 0 |
| Other warnings | 0 |

The classified link-health report covered 219 of 219 registered sources with zero checker failures and remained advisory: 98 `healthy`, 52 `healthy_internal`, 5 `healthy_redirect`, 24 `access_blocked`, 13 `canonical_blocked_fetch_healthy`, and 27 `transient_error`. It reported zero definite repair-required URLs. Those categories are request outcomes, not claims that blocked or transient sources are unavailable or current.

## Corrections on this branch

1. Add `workflow_run` handling to CI and Pages after a successful `Weekly data refresh` run whose head branch is `main`; add manual CI dispatch. Failed and non-main refresh runs cannot enter the jobs. This is **configured and unit tested, not exercised in production** until merge.
2. Add a deployment-targeted Playwright base URL and public-artifact checks covering all required files, registry/source totals, production bundle boundaries and licence notices.
3. Expand every-route checks to include HTTP status, title, ready state, navigation/footer presence, same-origin failures and browser errors.
4. Exercise all 23 routes at a narrow viewport with skip-link focus, mobile-menu keyboard behavior and root overflow checks.
5. Make homepage and shared React main targets focusable and constrain long card, chart, methodology and metric content without suppressing intended table-level horizontal scrolling.
6. Make v1/v2 committed-evidence smoke tests work against both the local checkout and the deployed, refreshed v2 site without accepting prepared or unknown markers.

## Verification status

The complete local branch validation at code commit `3febb7c` was:

| Command | Result |
|---|---|
| `npm ci` | passed; 56 packages installed/audited, 0 vulnerabilities |
| `npm audit` | passed; 0 vulnerabilities |
| `npm run check:ui` | passed |
| `npm run test:ui-unit` | 6/6 passed |
| `python -m py_compile` for all `scripts/*.py` | 12/12 compiled |
| `python scripts/build_source_manifest.py --check` | `source manifest ok` |
| `python scripts/apply_source_url_governance.py --check` | `Source URL governance already applied` |
| `python scripts/validate_project.py` | passed with 17 non-blocking freshness warnings |
| `python scripts/build_trust_status.py --check` | `trust status manifest ok` |
| `python scripts/validate_trust_status_v2.py` | `trust status v2 ok` |
| `python -m unittest discover -s tests` | 66/66 passed |
| `npx playwright install chromium` | passed; installed browser already current |
| `npm run smoke:ui` | final rerun 63/63 passed |
| `PLAYWRIGHT_SITE_BASE_URL=https://wowcorey.github.io/fuel-fertilizer-dashboard/ npm run smoke:live` | 62/63 passed; sole failure is the still-deployed skip-target defect fixed on this branch |

The first local browser run reported 61 passes and two failures: the obsolete Trust Status locator corrected in `3febb7c`, and a Windows `net::ERR_NO_BUFFER_SPACE` request failure. The final full rerun passed 63/63 and the socket failure did not recur; both attempts are disclosed rather than discarding the first result.

`npm run build:ui` was run twice over 24 generated artifacts. Both builds produced aggregate SHA-256 `dd081f1ebbd381f92ab5fd8f6b6979c4b996996ae1c8198e3c763db6955671c7`; `git diff --quiet` returned success. The Windows index briefly reported line-ending/stat-only modifications, but Git content diffs were empty and the clean state was restored without changing content.

A final local Pages reproduction from commit `2928564279a280c38954c1d543987e2c5dc12c25` applied governance, passed project and Trust Status validation, then packaged the upload-visible tree with the workflow's dotfile exclusions. The tar contained 390 files and 33 directories (423 entries), all 23 route files, and 8/8 required public manifest, bundle, licence and homepage artifacts. It was 5,249,536 bytes with local SHA-256 `15cc35d7025fe06b777caf139ff007eaa6cb1afb39cf7ce0c85781984aa81229`. Local tar byte identity is not claimed against GitHub's artifact because tar metadata and Pages-generated Trust Status `generated_at` are time-dependent.

At document creation time:

- the 23-route deployed transport/runtime/link audit is **deployed and observed**;
- the published v2 marker and refreshed Pages artifact are **deployed and observed**;
- post-merge CI at `2ed8b90...` and refresh in-workflow controls are **CI verified**;
- an automatic post-refresh CI run is **unavailable because no run was triggered**;
- the new post-refresh CI/Pages triggers are **configured and locally unit tested, not exercised**; and
- the accessibility and overflow repairs are **locally tested, not deployed**.

## Residual risks and unavailable claims

- No automatic downstream CI result exists for refreshed `main` before this branch; the successful refresh workflow's internal validation and the subsequent local validation are separate evidence.
- The new `workflow_run` path cannot be operationally proven until this PR lands and a later successful refresh runs.
- The deployed site will retain the documented focus and overflow defects until this PR lands and Pages succeeds.
- NSW did not participate in the refresh because its repository credential was absent. Absence is not zero coverage.
- This audit did not prove that every upstream public value is correct or current. It proved repository controls, committed evidence, artifact identity, render behavior and explicit unavailable states.
- Link-health outcomes are network-dependent and advisory. A 403, 429, timeout, anti-bot response or transient server error is not proof that a dataset is unavailable.
- Successful refresh and deployment do not make the 13 stale manual sources or 4 stale generated sources current.
- The marker proves a pushed output commit; GitHub deployment records separately prove which later commit Pages deployed.
- Google-hosted fonts remain the only identified external presentation dependency.

## Merge status

This Phase 4.1 PR is intentionally left unmerged for explicit review and approval.
