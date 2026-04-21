# Incident response plan

Describes how security, data-integrity and availability incidents are
classified, triaged, communicated and closed. Sized for the current
feasibility phase; expands as Gate B and Gate C complete.

## 1. Scope

In scope for this plan:
- Security incidents affecting the repository, CI or hosted dashboard.
- Data integrity incidents affecting published envelopes (fabrication,
  misattribution, stale data presented as fresh, incorrect value).
- Availability incidents affecting dashboard access or refresh workflow.
- Rights or licensing incidents (publisher complaint, takedown request).

Privacy incidents are out of scope while the dashboard is public-only and
processes no user data. If user accounts or restricted data are introduced,
privacy incident handling must be added before that feature ships.

## 2. Roles

- Incident commander: leads the response; by default the system owner.
- Data steward: investigates data-integrity incidents and coordinates
  correction per [data-stewardship.md](data-stewardship.md).
- Reliability owner: investigates availability and pipeline incidents.
- Security reviewer: investigates security-classification incidents;
  co-ordinates with upstream publishers where relevant.
- Communications lead: handles public-facing updates if required.

During feasibility, the system owner may hold multiple roles simultaneously.
Gate B requires named holders.

## 3. Severity classification

| Severity | Definition | Examples | Initial response target |
|----------|------------|----------|-------------------------|
| SEV-1 | Widespread or authoritative wrong data; public trust impact; exposure of secrets or credentials | Fabricated value shipped to dashboard; repo token leaked; dashboard defacement | Acknowledge within 2 hours; investigate immediately |
| SEV-2 | Localised wrong data; dashboard unavailable for all users; failed refresh without placeholder behaviour | Incorrect citation on one source; static host outage; workflow silently fails over multiple cycles | Acknowledge within 1 business day |
| SEV-3 | Degradation without user-visible incorrect data | Validator warning not actioned; one source stale beyond grace; dependency vulnerability with no known exploit | Acknowledge within 5 business days |
| SEV-4 | Informational or near-miss | Potential publisher schema change, flagged but not broken | Log only; review at next monthly drift scan |

## 4. Response phases

Apply all phases; compress timing for lower severities.

1. Detect.
   - Sources of detection: CI/validator failure, dashboard check,
     stakeholder report, publisher notice, synthetic monitor (when active).
2. Classify.
   - Incident commander assigns a severity using section 3.
3. Contain.
   - Security: rotate affected secrets; revoke compromised tokens; disable
     workflow if tampering suspected.
   - Data integrity: if value is wrong on live dashboard, set the envelope
     to `status: "unavailable"` with an honest `notes` field and publish
     before further investigation.
   - Availability: switch user-facing messaging to stale or unavailable
     state if applicable.
4. Investigate.
   - Record timeline, affected envelopes, commits, workflow runs.
   - Link to the corresponding row in
     [risk-register.md](risk-register.md).
5. Remediate.
   - Fix the underlying cause: code change, source registry change,
     process change.
   - Add or update a regression test under `tests/` for data-integrity and
     pipeline incidents.
6. Communicate.
   - SEV-1 and SEV-2 require a dated note in the repository (commit message
     and, if appropriate, a short status update on the relevant dashboard
     page).
   - Notify any affected publisher where a rights or licensing issue is
     involved.
7. Close.
   - Record incident in the incident log (section 6).
   - Capture lessons learnt; link any corrective action to
     [risk-register.md](risk-register.md) or
     [phase-gates.md](phase-gates.md) gate criteria.

## 5. Communication protocol

- Internal: pull requests, commits and the incident log entry are the record.
- External, public-interest impact: short, neutral update attached to the
  affected dashboard page in the next deploy, plus a commit explaining the
  correction. Australian English, no blame language, named source reference
  where relevant.
- External, publisher: direct message to the publisher contact; record the
  exchange summary in the incident log (never paste private correspondence
  to the repository).
- Do not discuss an ongoing security incident in public channels until a
  remediation is in place.

## 6. Incident log

All incidents (including SEV-4) are logged chronologically. Template:

```
## YYYY-MM-DD - <short title>
- Severity: SEV-<n>
- Detected by: <source>
- Affected artefacts: <list of envelopes, surfaces, workflows>
- Timeline:
  - detect -> classify -> contain -> remediate -> close (times in UTC)
- Root cause: <one sentence>
- Remediation: <one sentence, linked commit>
- Risk register row: <Rxx>
- Lessons learnt: <one or two bullets>
```

Store entries under `docs/compliance/incident-log/` once the first incident
occurs (folder created on first use).

## 7. Exercises

- Tabletop exercise at Gate D: walk through one SEV-1 scenario each for
  data integrity and availability; capture gaps.
- Review exercise outcomes in the risk register and update this plan.

## Change log

- 2026-04-21 - Initial IR plan.
