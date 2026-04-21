# Control traceability matrix

Maps implemented and planned controls to framework expectations, owners,
evidence location and test cadence. Filled in over phases; initial rows
reflect the feasibility phase.

Framework codes used:
- ISM - Information Security Manual control domain (generic reference;
  specific control IDs added at Gate D).
- E8 - Essential Eight mitigation strategy.
- PSPF - Protective Security Policy Framework policy area.
- PROJ - project-specific rule (non-fabrication, neutrality, accessibility).

Status legend: `in_force`, `partial`, `planned`, `deferred`.

| Control ID | Description | Framework anchor | Owner | Evidence | Test cadence | Status |
|------------|-------------|------------------|-------|----------|--------------|--------|
| CTRL-01 | Envelope schema enforced before publish | PROJ + ISM data integrity | Data steward | [../../scripts/validate_data.py](../../scripts/validate_data.py); CI job in [../../.github/workflows/ci.yml](../../.github/workflows/ci.yml) | On every PR and refresh | in_force |
| CTRL-02 | Non-fabrication rule on all envelopes | PROJ | Data steward | [../../data/sources.yml](../../data/sources.yml) fetch modes; validator checks for `unavailable` semantics | On every PR and refresh | in_force |
| CTRL-03 | Rights and citation required per source | PSPF info mgmt | Data steward | Required fields in [../../data/sources.yml](../../data/sources.yml); validator rejects missing | On every PR | in_force |
| CTRL-04 | Stale data grace windows per cadence | PROJ + ISM availability | Reliability owner | `STALE_GRACE_DAYS` in [../../scripts/validate_data.py](../../scripts/validate_data.py) | On every validation | in_force |
| CTRL-05 | Dashboard shows explicit unavailable placeholder | PROJ | System owner | UI copy convention and [reliability-spec.md](reliability-spec.md) section 3 | Per publish | in_force |
| CTRL-06 | Updated label computed only from `status: "ok"` | PROJ | System owner | Convention documented in [../../README.md](../../README.md); [reliability-spec.md](reliability-spec.md) | Per publish | in_force |
| CTRL-07 | Scheduled refresh validates before committing | ISM change control | Reliability owner | [../../.github/workflows/refresh-data.yml](../../.github/workflows/refresh-data.yml) steps 1-7 | Weekly | in_force |
| CTRL-08 | Secrets stored in GitHub Actions secrets | ISM secrets | Security reviewer | Workflow env binding; no plaintext in repo | Quarterly review | partial |
| CTRL-09 | Branch protection on `main` with required CI | PSPF change control | System owner | Repo settings (to be enforced) | Per change | planned (Gate B) |
| CTRL-10 | MFA for administrative accounts | E8 MFA | Security reviewer | Organisation / account settings evidence | Quarterly review | planned (Gate B) |
| CTRL-11 | Patch SLAs for dependencies | E8 patching | Security reviewer | SLA doc (Gate B); Dependabot/equivalent alerts | Monthly review | planned (Gate B) |
| CTRL-12 | Data classification position recorded | PSPF info mgmt | System owner | [ssp-lite.md](ssp-lite.md) section 1 | Per scope change | in_force |
| CTRL-13 | Incident response plan with severities | PSPF security incident mgmt | System owner | [incident-response.md](incident-response.md) | Per incident; annual drill | partial |
| CTRL-14 | Disaster recovery with RPO/RTO | ISM resilience | System owner | [disaster-recovery.md](disaster-recovery.md) | Quarterly dry run; Gate C live test | partial |
| CTRL-15 | Data stewardship and correction workflow | PSPF info mgmt | Data steward | [data-stewardship.md](data-stewardship.md) | Per correction; monthly review | in_force |
| CTRL-16 | Dispute channel documented | PSPF governance | System owner | [data-stewardship.md](data-stewardship.md) section 5 | Per dispute | partial |
| CTRL-17 | Audit log taxonomy defined | ISM event logging | Security reviewer | [audit-log-taxonomy.md](audit-log-taxonomy.md) | Per platform change | in_force (spec); planned (platform) |
| CTRL-18 | Centralised log platform with 7-year retention | ISM event logging | Security reviewer | Gate C evidence | Quarterly integrity review | planned (Gate C) |
| CTRL-19 | AU-region hosting | ISM data sovereignty | System owner | [../adr/0001-au-hosted-migration-architecture.md](../adr/0001-au-hosted-migration-architecture.md) | Gate C evidence | planned (Gate C) |
| CTRL-20 | Synthetic monitoring and alerting | ISM monitoring | Reliability owner | Monitor dashboard (Gate C) | Weekly health check | planned (Gate C) |
| CTRL-21 | Vulnerability scan cadence | ISM vulnerability mgmt | Security reviewer | Scan reports (Gate C) | Monthly | planned (Gate C) |
| CTRL-22 | Backup and restore test | E8 backups | Reliability owner | Test log (Gate C) | Annual live test | planned (Gate C) |
| CTRL-23 | Penetration test report and remediation | ISM assurance | Security reviewer | Assessment report (Gate E) | Annual | planned (Gate E) |
| CTRL-24 | Control-to-ISM mapping at control-ID level | IRAP | Security reviewer | Filled extension of this matrix at Gate D | Per assessment | planned (Gate D) |
| CTRL-25 | Accessibility baseline (WCAG AA, keyboard nav, reduced motion) | PROJ | System owner | Rules in [../../README.md](../../README.md) and [author-alignment rule](../../.cursor/rules/author-alignment.mdc) | Per UI change | in_force |
| CTRL-26 | Neutral editorial stance (no sponsor voice, no advocacy) | PROJ | System owner | Editorial rules in [../../README.md](../../README.md) | Per copy change | in_force |
| CTRL-27 | AI guardrails (deterministic, bounded, schema-enforced) | PROJ + ISM integrity | System owner | Pre-adoption gate in [phase-gates.md](phase-gates.md); no AI used today | Per proposal | deferred (pre-adoption) |

## Review cadence

- Monthly: scan for new controls promoted from `planned` or `partial` to
  `in_force`; update evidence links.
- Quarterly: verify test cadences were honoured; record outcomes.
- Per gate: cross-check this matrix against [phase-gates.md](phase-gates.md)
  exit criteria.

## Change log

- 2026-04-21 - Initial 27-row matrix.
