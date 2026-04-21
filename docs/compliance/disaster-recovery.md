# Disaster recovery strategy

Defines how the Fuel Resilience AU dashboard and its data pipeline recover
from events that exceed the normal incident response envelope. Sized for
feasibility phase; expanded before Gate C.

## 1. Objectives

| Objective | Target (current scope) | Notes |
|-----------|------------------------|-------|
| Recovery Point Objective (data) | Last committed envelope set (0 data loss beyond upstream cadence) | Envelopes live in Git; history is the record |
| Recovery Time Objective (dashboard availability) | 4 hours to re-publish via static host | Static artefacts can be re-deployed from repo |
| Recovery Time Objective (refresh workflow) | Next scheduled run after remediation | Weekly cadence; manual trigger available |
| Recovery Time Objective (source registry correctness) | 1 business day to revert and re-validate | Validator gates commits |

Targets tighten at Gate C when AU-hosted platform is selected.

## 2. Threat scenarios considered

1. Static host regional outage.
2. Git hosting provider (GitHub) outage or account suspension.
3. Accidental force-push or repository deletion.
4. Upstream publisher outage or schema break.
5. Compromise of maintainer account.
6. Loss of secrets (e.g. `NSW_FUELCHECK_API_KEY`).
7. Workflow runner platform failure.

## 3. Preventive controls

- Conventional Commits and validator-in-CI reduce chance of a bad commit
  reaching `main`.
- Branch protection (to be enforced at Gate B) prevents direct
  non-reviewed writes to `main`.
- Minimal dependency surface reduces supply-chain exposure.
- Secrets scoped to the refresh workflow only.
- Non-fabrication rule prevents a corrupt value from being backfilled.

## 4. Recovery procedures

### 4.1 Static host outage
1. Confirm upstream status with host provider status page.
2. If outage is prolonged (> 4 hours), enable alternate static host deploy
   (Cloudflare Pages or equivalent) from the same repo.
3. Update DNS/redirect as appropriate (Gate C adds this capability).
4. Communicate only after restoration plan is confirmed.

### 4.2 Git hosting outage or account suspension
1. If GitHub is down, delay refresh; static host continues serving.
2. If account is suspended, restore via provider support; maintain an
   off-platform mirror of `main` (quarterly task from Gate B).
3. Re-establish CI secrets in the restored environment.

### 4.3 Accidental force-push or repository deletion
1. Restore from the most recent off-platform mirror.
2. Validate restored envelopes with `scripts/validate_data.py`.
3. Re-run the scheduled refresh manually via `workflow_dispatch`.
4. Add a post-mortem entry to the incident log.

### 4.4 Upstream publisher outage or schema break
1. Classify as a SEV-2 or SEV-3 per
   [incident-response.md](incident-response.md).
2. Preserve prior envelope; do not backfill.
3. Mark envelope `status: "unavailable"` with honest notes if the outage
   persists past the cadence grace window.
4. Track publisher recovery; update fetcher if schema has changed.

### 4.5 Maintainer account compromise
1. Revoke tokens, rotate secrets, require MFA reset.
2. Audit `main` history for unexpected commits; revert as needed.
3. Engage security reviewer before re-enabling writes to `main`.
4. If fabricated or altered data reached the dashboard, treat as SEV-1.

### 4.6 Secret loss or exposure
1. Rotate at the issuing service.
2. Update GitHub Actions secret.
3. Trigger a manual refresh to confirm workflow health.
4. Log exposure window in the incident log.

### 4.7 Workflow runner platform failure
1. If GitHub Actions is unavailable, delay refresh; dashboard continues
   serving last valid envelopes.
2. Optionally run the pipeline locally with the same Python version and
   push changes manually after validation.

## 5. Off-platform mirror policy

- Maintain at least one mirror of `main` outside the primary platform.
- Mirror must include `data/`, `scripts/`, `ui_kits/`, workflow files and
  this docs folder.
- Verify mirror currency quarterly from Gate B.

## 6. Testing

- Feasibility phase: dry-run this document quarterly; log outcome in the
  incident log (no live action required).
- Gate C: run one live restore test end-to-end.
- Gate D: tabletop exercise incorporating both IR and DR plans.

## 7. Out of scope (current phase)

- Multi-region active-active serving (added as part of Gate C platform
  migration under [../adr/0001-au-hosted-migration-architecture.md](../adr/0001-au-hosted-migration-architecture.md)).
- User account recovery (no users in current scope).
- Restricted-data enclave recovery (not yet in scope).

## Change log

- 2026-04-21 - Initial DR strategy captured.
