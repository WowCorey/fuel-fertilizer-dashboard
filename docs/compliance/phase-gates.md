# Phase gates (A-E)

Five sequential compliance gates carry the project from feasibility to
IRAP-ready. Each gate has explicit entry criteria, exit criteria and objective
evidence. Nothing in a later phase may ship without the prior gate being
passed, except where noted as "parallelisable".

Gate authority: project owner signs; reviewer with security/assurance
responsibility co-signs from Gate B onward.

## Gate A - Feasibility with compliance hooks

Phase: now to approximately 6 weeks from first application of this plan.

### Entry criteria
- Drift register ([drift-register.md](drift-register.md)) produced and
  reviewed.
- Public-only data posture confirmed.

### Exit criteria
- [ ] Every source in [../../data/sources.yml](../../data/sources.yml) has
      `rights`, `rights_url`, `citation`, `reuse_notes`, `fetch` mode and
      `used_by` fields populated. Evidence: validator run with zero errors.
- [ ] Every generated and manual envelope passes
      [../../scripts/validate_data.py](../../scripts/validate_data.py).
      Evidence: CI log artefact.
- [ ] Every dashboard surface renders an "unavailable" placeholder when
      `status != "ok"` and a timestamp-visible "Updated" label when `ok`.
      Evidence: manual walk-through checklist, screenshot capture kept in
      repo at publication time.
- [ ] Data classification position recorded in
      [ssp-lite.md](ssp-lite.md) (current: public only).
- [ ] Reliability policy drafted in [reliability-spec.md](reliability-spec.md).
- [ ] README statements about data freshness match validator behaviour
      (README drift rule satisfied).

### Evidence artefacts
- `docs/compliance/drift-register.md`
- CI run output for `python scripts/validate_data.py`
- README accuracy note dated at commit

## Gate B - Control design approved

Phase: approximately two quarters from Gate A.

### Entry criteria
- Gate A passed.
- At least one external review of the drift register has produced actionable
  feedback.

### Exit criteria
- [ ] [ssp-lite.md](ssp-lite.md) is complete: scope, trust boundary, data
      flows, controls list, owners.
- [ ] [risk-register.md](risk-register.md) has named owner per risk, current
      residual rating, treatment and review date.
- [ ] [incident-response.md](incident-response.md) lists named responders,
      contact paths, severity thresholds and communications protocol.
- [ ] [disaster-recovery.md](disaster-recovery.md) defines RPO and RTO for
      data refresh, dashboard availability and source registry.
- [ ] [data-stewardship.md](data-stewardship.md) describes correction and
      dispute path end-to-end, with a public-facing contact channel.
- [ ] Change management policy recorded: Conventional Commits, reviewer
      required on compliance-affecting files, stop-ship conditions.
- [ ] Operational standards set: SLOs/SLIs in
      [reliability-spec.md](reliability-spec.md), log event taxonomy in
      [audit-log-taxonomy.md](audit-log-taxonomy.md).
- [ ] Migration architecture approved via
      [../adr/0001-au-hosted-migration-architecture.md](../adr/0001-au-hosted-migration-architecture.md).

### Evidence artefacts
- Signed SSP-lite, risk register, IR plan, DR plan, stewardship plan.
- Approved ADR-0001.
- Reviewer sign-off note in PR that closes Gate B.

## Gate C - AU-hosted controls live

Phase: approximately quarters 3-4.

### Entry criteria
- Gate B passed.
- ADR-0001 migration trigger met (traffic, stakeholder demand, sensitivity
  expansion, or explicit procurement engagement).

### Exit criteria
- [ ] AU-region production environment live, with separate dev/test/prod.
- [ ] Identity controls enforced: MFA on administrative accounts, reviewer
      required on merges to `main`, least-privilege on CI secrets.
- [ ] Secrets in a managed secret store with documented rotation policy.
- [ ] Centralised logging ingests events per
      [audit-log-taxonomy.md](audit-log-taxonomy.md).
- [ ] Synthetic monitoring in place for freshness, envelope validator and
      dashboard availability.
- [ ] Documented degraded/read-only mode behaviour with a tested trigger
      drill.
- [ ] Vulnerability management cadence defined and started (at least one
      scan cycle closed out).
- [ ] Backup and restore tested once end-to-end.

### Evidence artefacts
- Environment architecture diagram.
- IAM/secret policy extract.
- First vulnerability scan report with triage outcomes.
- Restore test log.
- Synthetic monitor dashboard export.

## Gate D - Evidence complete

Phase: year 2 first half.

### Entry criteria
- Gate C passed.
- At least one quarter of steady-state operations with no silent failures.

### Exit criteria
- [ ] Implemented controls mapped to ISM and Essential Eight maturity targets;
      map stored in [control-traceability-matrix.md](control-traceability-matrix.md).
- [ ] Control test outcomes recorded (effectiveness evidence per control).
- [ ] Incident response and disaster recovery tabletop exercises completed,
      lessons logged, corrective actions closed or scheduled.
- [ ] Privacy Impact Assessment completed or formally deferred with
      justification (only required if user accounts or restricted data are
      added).
- [ ] Data sovereignty evidence pack on file (hosting region, data residency,
      supply chain declarations).

### Evidence artefacts
- Filled traceability matrix.
- Tabletop exercise report.
- Privacy assessment outcome.
- Hosting region evidence.

## Gate E - IRAP-ready package

Phase: year 2 second half.

### Entry criteria
- Gate D passed.
- Independent security assessment scheduled.

### Exit criteria
- [ ] Independent assessment complete; findings triaged; high and critical
      findings remediated; medium findings scheduled.
- [ ] Penetration test report on file with evidence of remediation.
- [ ] Security questionnaire bank prepared for procurement engagements.
- [ ] Operational runbooks finalised: incident, disaster recovery, data
      correction, source-failure, publish cadence.
- [ ] Release criteria for "government-ready public dashboard" baseline
      frozen and published.

### Evidence artefacts
- Independent assessment report.
- Penetration test report and remediation log.
- Questionnaire bank document.
- Runbook set.
- Signed release criteria document.

## Gate progression policy

- Gates are sequential; skipping is not permitted.
- A failed gate triggers a documented stop-ship: no new features affecting the
  failing control class may be added until the gate's corrective actions
  close.
- Quarterly gate review is the standing review cadence. Monthly drift scan
  feeds the review.
- Expanding scope beyond public-only data requires re-entry to Gate B
  regardless of current phase, to redesign controls for restricted data.

## Change log

- 2026-04-21 - Initial gate set defined (A-E).
