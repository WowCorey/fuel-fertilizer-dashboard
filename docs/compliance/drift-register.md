# Baseline drift register

Snapshot of the current repository's alignment against Australian
government-grade expectations for a critical-infrastructure-adjacent public
observability surface. Each row names the expectation, the current state, the
gap and the phase (per [phase-gates.md](phase-gates.md)) where the gap is
scheduled to close.

Frameworks referenced:

- ISM - Information Security Manual (ASD/ACSC).
- PSPF - Protective Security Policy Framework (AGD).
- Essential Eight - ACSC cyber mitigation strategies and maturity model.
- IRAP - Infosec Registered Assessors Program readiness expectations.
- Related: Australian Privacy Principles (APP), Archives Act records
  retention, data.gov.au publisher licensing conventions.

Status legend: `aligned`, `partial`, `gap`, `deferred`.

## 1. Security control baseline (ISM, Essential Eight)

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 1.1 | Identity and access control with RBAC for privileged actions | ISM identity controls; E8 restrict admin privileges | No authenticated surfaces yet; only public read | partial (N/A for public read, required for future admin) | Phase 2 |
| 1.2 | MFA for privileged accounts (repo, hosting, pipeline) | E8 MFA | Relies on personal GitHub account settings, not enforced at org policy level | gap | Phase 1 |
| 1.3 | Application control / allow-listing on build and publish hosts | E8 application control | Runs on GitHub-hosted runners; not formally controlled | partial (inherits runner baseline) | Phase 2 |
| 1.4 | Patch applications and operating systems on defined SLA | E8 patching | Dependencies are minimal (`requests`, `pyyaml`, `openpyxl`), no SLA doc | gap | Phase 1 |
| 1.5 | Macro controls | E8 macros | Not applicable (no Office macros in pipeline) | aligned | - |
| 1.6 | User application hardening | E8 user app hardening | Not applicable at current posture | aligned | - |
| 1.7 | Daily backups with tested restore | E8 backups | Git history is the de facto backup; no tested restore runbook | partial | Phase 2 |
| 1.8 | Network segmentation, trust zones | ISM network security | Single public surface; no segmentation required yet; no design document for future restricted surface | gap (for future) | Phase 2 |
| 1.9 | Secrets management | ISM cryptography and keys | `NSW_FUELCHECK_API_KEY` stored in GitHub Actions secrets; no rotation policy or central secret store design | partial | Phase 1 design, Phase 2 implement |
| 1.10 | Vulnerability management cadence and SLAs | ISM vulnerability management | No scheduled scan, no triage SLA | gap | Phase 2 |
| 1.11 | Logging and monitoring for security events | ISM event logging | CI/pipeline logs transient; no central security log | gap | Phase 2 |

## 2. Assurance and governance (PSPF, IRAP)

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 2.1 | System Security Plan (SSP) | IRAP core artefact | Not present; [ssp-lite.md](ssp-lite.md) stub created | partial | Phase 1 |
| 2.2 | Risk register with owners and treatments | PSPF risk management; IRAP | Not present; [risk-register.md](risk-register.md) stub created | partial | Phase 1 |
| 2.3 | Incident response plan | PSPF security incident mgmt | Not present; [incident-response.md](incident-response.md) stub created | partial | Phase 1 |
| 2.4 | Disaster recovery strategy with RPO/RTO | ISM resilience; IRAP | Not present; [disaster-recovery.md](disaster-recovery.md) stub created | partial | Phase 1 design, Phase 2 test |
| 2.5 | Data classification decision and handling rules | PSPF information management | Position taken: public-only in current scope; no formal classification document yet | partial | Phase 1 |
| 2.6 | Privacy Impact Assessment (DPIA/PIA) | APP + PSPF | Not required at current public-only scope; needed before any user-account or restricted-data feature | deferred | Phase 3 trigger |
| 2.7 | Change management workflow | PSPF governance | Conventional Commits + validator enforced in CI; no formal CAB/reviewer policy | partial | Phase 1 |
| 2.8 | Data stewardship, correction and dispute workflow | PSPF information mgmt; public-interest norms | Not present; [data-stewardship.md](data-stewardship.md) stub created | partial | Phase 1 |

## 3. Hosting and data sovereignty

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 3.1 | AU-region hosting for any non-public or restricted data | ISM data sovereignty | Static GitHub Pages / Cloudflare Pages; no AU sovereign posture documented | gap (acceptable for public) | Phase 2 |
| 3.2 | Hosting platform with supported IRAP assessment or PROTECTED community cloud path | IRAP | Not chosen; see [../adr/0001-au-hosted-migration-architecture.md](../adr/0001-au-hosted-migration-architecture.md) | gap | Phase 2 |
| 3.3 | Clear public vs restricted surface separation | PSPF access control | Single public surface only; design rule in ADR-0001 forbids mixing | aligned (by scope) | - |

## 4. Availability and reliability

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 4.1 | Defined SLOs / SLIs for freshness and availability | ISM availability; public expectation | Not defined; [reliability-spec.md](reliability-spec.md) sets targets | partial | Phase 1 |
| 4.2 | No silent failure; stale data is visible | Public-interest expectation | Enforced in envelope schema and validator; dashboard shows "Source unavailable" placeholder | aligned | - |
| 4.3 | Degraded / read-only mode behaviour | ISM availability | Implicit (static site is read-only by nature); not formally described | partial | Phase 1 |
| 4.4 | Multi-region failover | ISM availability | Not implemented; inherited from static CDN | partial | Phase 2 |
| 4.5 | Synthetic monitoring / alerting on freshness regressions | Operational resilience | Not implemented; CI validator catches schema drift on commit only | gap | Phase 2 |

## 5. Data provenance and non-fabrication

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 5.1 | Every datapoint source-tagged and timestamped | Public-interest; PSPF info mgmt | Enforced via envelope schema and validator; see [../../scripts/validate_data.py](../../scripts/validate_data.py) | aligned | - |
| 5.2 | Reproducible pipeline from source to envelope | IRAP integrity | `scripts/fetch_data.py` is deterministic; no interpolation | aligned | - |
| 5.3 | Versioned data history | Archives Act norms | Git history retains changes; no formal retention schedule | partial | Phase 1 |
| 5.4 | Rights, licence and citation metadata on every source | Publisher terms; CC BY practice | Enforced in `data/sources.yml` required fields | aligned | - |
| 5.5 | Explainable scoring / methodology when risk labels or composites are used | Public-interest neutrality | No scoring model yet; rule established before any score ships | aligned (by policy) | Phase 3 trigger |

## 6. Audit and logging

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 6.1 | Immutable activity log for data changes and publish events | ISM event logging | Git commits cover data changes; not centralised / not exported | partial | Phase 2 |
| 6.2 | Access log where restricted surfaces are added | ISM event logging | Not applicable yet | deferred | Phase 4 trigger |
| 6.3 | Defined retention period (6-7 years typical) | Archives Act | Not documented; [audit-log-taxonomy.md](audit-log-taxonomy.md) sets policy | partial | Phase 1 |
| 6.4 | Exportable logs on request | IRAP | Not implemented | gap | Phase 2 |

## 7. AI guardrails (optional future capability)

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 7.1 | Deterministic, bounded outputs | Public-interest neutrality | No AI in current pipeline | aligned (by absence) | gate before adoption |
| 7.2 | Schema-enforced AI output | IRAP integrity | Not applicable yet | deferred | pre-adoption gate |
| 7.3 | No fabricated sources or numbers | Project policy | Enforced structurally by envelope schema | aligned | - |
| 7.4 | Human-readable explanation and confidence | Public-interest | Policy drafted here; implementation gated on model choice | deferred | pre-adoption gate |

## 8. Procurement readiness (to sell into government)

| # | Expectation | Framework anchor | Current state | Status | Phase to close |
|---|-------------|------------------|---------------|--------|----------------|
| 8.1 | ABN / supplier registration | Commonwealth procurement | Out of scope for repo; tracked externally | deferred | Phase 3 |
| 8.2 | Security questionnaire bank | Commonwealth procurement | Not present | gap | Phase 4 |
| 8.3 | Penetration test report | IRAP + procurement | Not commissioned | gap | Phase 4 |
| 8.4 | DPIA on file where applicable | APP + procurement | Not required yet (public-only scope) | deferred | Phase 3 |
| 8.5 | Evidence pack mapped to ISM / E8 | IRAP | In progress via this register and traceability matrix | partial | Phase 3 |

## Change log

- 2026-04-21 - Initial drift register created under phase gate A feasibility.
