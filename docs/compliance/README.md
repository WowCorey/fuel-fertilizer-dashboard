# Compliance documentation

This folder holds the governance, assurance and reliability artefacts that track
this project against Australian government-grade expectations (ISM, PSPF,
Essential Eight, IRAP readiness). The project remains a public, static-hosted
dashboard during the feasibility phase; these documents exist so controls are
designed and evidenced early rather than retrofitted.

## Index

- [drift-register.md](drift-register.md) - current-state gap map against
  ISM/PSPF/Essential Eight/IRAP.
- [phase-gates.md](phase-gates.md) - Gate A-E entry/exit criteria and evidence
  requirements.
- [ssp-lite.md](ssp-lite.md) - lightweight System Security Plan for the
  public dashboard.
- [risk-register.md](risk-register.md) - top risks and treatments, owners and
  review cadence.
- [incident-response.md](incident-response.md) - incident response plan.
- [disaster-recovery.md](disaster-recovery.md) - disaster recovery strategy
  and recovery objectives.
- [data-stewardship.md](data-stewardship.md) - data stewardship,
  correction and dispute workflow.
- [reliability-spec.md](reliability-spec.md) - SLO/SLI, stale and degraded
  behaviour, no-silent-failure rules.
- [audit-log-taxonomy.md](audit-log-taxonomy.md) - audit and activity log
  event model, retention and export requirements.
- [control-traceability-matrix.md](control-traceability-matrix.md) - control
  to evidence traceability matrix.

Related architecture records:

- [../adr/0001-au-hosted-migration-architecture.md](../adr/0001-au-hosted-migration-architecture.md)
  - AU-hosted security migration architecture and trigger-based cutover plan.

## Scope and posture

- Target assurance: IRAP assessment goal on a 24-month horizon.
- Current deployment: public-only dashboard, no OFFICIAL:Sensitive data.
- Priority order for all decisions: accuracy, completeness, speed, user
  experience - in that order.
- No fabrication rule: missing or unverified values remain explicitly
  unavailable in both data envelopes and UI surfaces. See
  [../../data/sources.yml](../../data/sources.yml) and
  [../../scripts/validate_data.py](../../scripts/validate_data.py).

## Change control

- Treat every file in this folder as an operational document. Update the
  affected file in the same change as the behaviour it describes.
- Material changes (new risk, new control, new gate criterion, reliability
  target change) require reviewer approval and a dated entry in the file's
  Change log section.
- README drift rule: when any of these documents change, check if
  [../../README.md](../../README.md) needs to follow.
