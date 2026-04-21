# Risk register

Top risks for the Fuel Resilience AU public dashboard and their current
treatments. Ratings use Likelihood x Consequence on a 1-5 scale. "Residual"
is the post-treatment rating. Review cadence: monthly drift scan, quarterly
full review.

Owner column names the role, not the individual. During feasibility, roles
may be held by the same person; Gate B requires role holders to be
documented.

## 1. Register

| ID | Risk | Cause | Consequence | Inherent (LxC) | Treatment | Residual (LxC) | Owner | Review |
|----|------|-------|-------------|----------------|-----------|----------------|-------|--------|
| R01 | Fabricated, estimated or interpolated values appear in a published envelope | Process drift, helper script mistake, manual entry error | Loss of public trust; policy breach | 3x5 | Envelope schema + validator; manual entry requires verified source; no interpolation helpers in pipeline | 1x5 | Data steward | Quarterly |
| R02 | Stale data presented without visible warning | Failed fetch not surfaced; cached envelope lingers; dashboard timestamp logic drifts | Public misinformation during policy-relevant period | 4x4 | Validator flags stale per cadence; dashboard timestamp computed only from `status: "ok"` envelopes; placeholder copy for unavailable | 2x3 | Reliability owner | Monthly |
| R03 | Upstream publisher changes schema or rights | Silent API change, publisher relicensing | Pipeline break or rights non-compliance | 3x3 | Validator + fetcher contract tests; `last_verified` date per source; quarterly rights check | 2x2 | Data steward | Quarterly |
| R04 | Secret (NSW FuelCheck key) leaks or is misused | Accidental commit, over-broad scope | Vendor penalty; service disruption | 2x4 | Stored in GitHub Actions secrets; never read outside workflow; rotate on incident | 1x3 | Security reviewer | Annual, and on incident |
| R05 | Repository compromise via maintainer account | Credential theft, phishing | Supply-chain tampering; false data publish | 3x5 | MFA enforcement (Gate B); branch protection; reviewer required on data-affecting files | 2x4 | System owner | Quarterly |
| R06 | CI pipeline tampering | Untrusted action or malicious PR | Silent fabrication of data | 2x5 | Pin actions by major version; validate on PR before merge; no secrets on PR workflows from forks | 1x4 | System owner | Quarterly |
| R07 | Single-region hosting outage during high-interest period | Static host regional incident | Dashboard unavailable; trust impact | 3x3 | Static CDN is highly available; migration plan ADR-0001 introduces failover for Gate C | 2x2 | Reliability owner | Quarterly |
| R08 | Rights breach by republishing upstream dataset beyond licence | Missing or wrong `rights` metadata | Legal exposure; publisher complaint | 2x4 | Required rights/citation fields; manual review on add-source PR | 1x3 | Data steward | Quarterly |
| R09 | Dashboard presents a scoring or forecast that is read as authoritative | Composite or AI output added without guardrails | Political or market impact; neutrality breach | 2x5 | Ban on scoring or AI output without explainability policy and gate review | 1x4 | System owner | Per proposal |
| R10 | Scope creep into OFFICIAL:Sensitive data without control redesign | Stakeholder request; opportunism | Control baseline inadequate; compliance breach | 3x5 | ADR-0001 forbids mixing surfaces; scope-change triggers Gate B re-entry | 1x5 | System owner | Per request |
| R11 | Loss of data history | Accidental force-push; repo deletion | Cannot reproduce historical envelopes | 2x4 | Git history + upstream remote; backup verification task scheduled for Gate C | 1x3 | System owner | Quarterly |
| R12 | Dependency vulnerability in `requests`, `pyyaml`, `openpyxl` | Upstream CVE | Pipeline compromise | 2x3 | Minimal dependency surface; patch SLA defined in Gate B; Dependabot recommended | 1x2 | Security reviewer | Monthly |
| R13 | Accessibility regression on a dashboard surface | New UI work skips AA checks | Exclusion of users; reputational impact | 2x3 | WCAG AA rules are repo policy; per-page manual check at publish | 1x2 | System owner | Per change |
| R14 | Misattribution of source in a publication | Wrong `citation` or `source_name` | Publisher complaint | 2x3 | Validator warns on source_name mismatch; source_url must match canonical_url | 1x2 | Data steward | Per change |
| R15 | No exportable audit trail when requested | Logs transient on runner | Cannot demonstrate provenance on demand | 3x3 | Git history serves as current trail; centralised log platform scheduled for Gate C | 2x2 | Security reviewer | Quarterly |

## 2. Treatment review rhythm

- Monthly: check new entries from [drift-register.md](drift-register.md)
  against this register and add rows for any unregistered risks.
- Quarterly: rate residual risk, confirm owners, schedule treatment work.
- Per incident: add or update the row, and link the incident ID from
  [incident-response.md](incident-response.md).

## Change log

- 2026-04-21 - Initial 15-row register.
