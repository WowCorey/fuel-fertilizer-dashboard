# System Security Plan (lite)

A lightweight System Security Plan for the Fuel Resilience AU public
dashboard. It captures scope, trust boundary, data flows, controls and owners
at a level appropriate for Gate A/B under [phase-gates.md](phase-gates.md).
Expand to a full SSP before any Gate D evidence review.

## 1. System identification

- System name: Fuel Resilience AU public dashboard.
- System owner: project maintainer (named in repo metadata).
- Purpose: present public, source-attributed fuel and fertiliser resilience
  indicators for Australian audiences.
- Users: general public, no authentication, read-only.
- Classification of processed data: OFFICIAL (public-domain / CC BY source
  data only). No OFFICIAL:Sensitive or PROTECTED data.

## 2. Scope and trust boundary

In scope:
- Source registry in [../../data/sources.yml](../../data/sources.yml).
- Data pipeline in [../../scripts/fetch_data.py](../../scripts/fetch_data.py)
  and supporting scripts.
- Generated envelopes in `data/generated/` and manual envelopes in
  `data/manual/`.
- Dashboard surfaces under `ui_kits/*/`.
- CI workflows in [../../.github/workflows/ci.yml](../../.github/workflows/ci.yml)
  and [../../.github/workflows/refresh-data.yml](../../.github/workflows/refresh-data.yml).

Out of scope (current phase):
- Any authenticated or restricted surface.
- Any AI-generated commentary or forecast.
- Any user-provided data or telemetry capture.

Trust boundary:
- Upstream publishers (ABS, DCCEEW, APS data.gov.au, RBA, ACCC, AIP, EIA via
  FRED, state fuel feeds) are treated as authoritative; their rights and
  citations are carried in envelopes.
- Repository is the system of record for transformation logic and publishing
  metadata.
- Static hosting platform (GitHub Pages or equivalent) distributes artefacts
  only; it does not process user data.

## 3. Data flow

1. Scheduled workflow triggers `scripts/fetch_data.py`.
2. Fetcher contacts upstream publishers over HTTPS.
3. Responses are parsed to a normalised JSON envelope in `data/generated/`.
4. Manual envelopes in `data/manual/` are hand-keyed from named public
   documents, per [data-stewardship.md](data-stewardship.md).
5. `scripts/validate_data.py` enforces envelope schema and contract rules.
6. Commit is pushed to `main` by the workflow only after validation.
7. Static host serves HTML + JSON; browser fetches envelopes via relative
   paths.
8. No server-side processing of user input is performed.

## 4. Controls summary

Controls are tracked in full in
[control-traceability-matrix.md](control-traceability-matrix.md). Top-level
controls in force now:

- Envelope schema enforced via validator (integrity).
- Non-fabrication rule enforced via envelope semantics (no interpolated or
  estimated values).
- Rights/licence metadata required per source (IP and reuse safety).
- Validator runs in CI before any merge and before any data commit.
- Secrets held in GitHub Actions secrets; only `NSW_FUELCHECK_API_KEY` is
  currently used.
- Branch protection: `main` should require PR and passing CI (confirmed in
  Gate B).

Planned for later phases: MFA enforcement, patch SLAs, centralised logging,
AU-region hosting, IRAP-aligned evidence pack.

## 5. Roles and responsibilities

- System owner: accountable for overall posture and gate sign-off.
- Data steward: accountable for source registry correctness and correction
  workflow execution ([data-stewardship.md](data-stewardship.md)).
- Reliability owner: accountable for SLO tracking and incident triage
  ([reliability-spec.md](reliability-spec.md),
  [incident-response.md](incident-response.md)).
- Security reviewer: required approver on changes that affect controls.

During feasibility phase, one person may hold multiple roles; separate
accountability lines are named by Gate B.

## 6. Dependencies and supply chain

- Python runtime: 3.11 on GitHub-hosted runners.
- Direct dependencies: `requests`, `pyyaml`, `openpyxl` (minimum versions in
  [../../requirements.txt](../../requirements.txt)).
- External feeds: listed in [../../data/sources.yml](../../data/sources.yml);
  each entry carries `rights`, `rights_url`, `citation`.

## 7. Residual risk and known gaps

See [risk-register.md](risk-register.md) and
[drift-register.md](drift-register.md). Most critical residual risks:

- Reliance on personal GitHub account-level controls until Gate B completes
  organisational policy work.
- No centralised security event log until Gate C.
- Single-region static hosting; acceptable for current public scope but
  requires migration design before Gate C.

## Change log

- 2026-04-21 - Initial SSP-lite captured.
