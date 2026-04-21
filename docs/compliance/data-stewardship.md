# Data stewardship, correction and dispute workflow

Describes how sources are curated, how values are corrected, and how
external parties raise disputes. Aligned with the project's non-fabrication
policy and neutral, public-interest stance.

## 1. Stewardship principles

- Every datapoint must be traceable to a named public source with rights
  and citation metadata in
  [../../data/sources.yml](../../data/sources.yml).
- No value is fabricated, interpolated, estimated or backfilled.
- When a value cannot be verified, the envelope carries
  `status: "unavailable"` and the UI renders an explicit "Source
  unavailable" placeholder; no silent fallback.
- Manual entries must match the source of truth exactly and preserve
  `manual_entry: true` with a non-fabricated `retrieved_at`.
- Changes to source definitions, values or methodology are versioned in Git
  and validated in CI.

## 2. Roles

- Data steward: owns the correctness of the source registry and envelope
  set. Approves new sources and material corrections.
- Reviewer: co-signs additions or corrections that affect dashboards.
- System owner: arbitrates disputes and escalations.

## 3. Add or change a source

Follow the procedure in [../../README.md](../../README.md) ("Add or update a
source") plus these checks:

1. Confirm a named public document exists; record its URL in
   `canonical_url` and its rights in `rights` / `rights_url`.
2. Choose the least-ambiguous `fetch` mode: `programmatic` if a stable
   machine endpoint exists; `derived` if the series is a pure function of
   another in-registry source; `manual` if human judgement or a human-only
   format is required; `unavailable` if no licence-compatible public
   source exists.
3. Ensure `used_by` names only dashboards that actually consume the source.
4. Run `python scripts/validate_data.py` and
   `python scripts/build_source_manifest.py --check` before committing.
5. Reviewer signs off; CI must be green on merge.

## 4. Correction workflow

Triggered by any of: validator failure after an upstream change, stakeholder
report, internal review, publisher complaint, incident response.

1. Open an issue or draft PR titled `data: correction - <source_id>`.
2. Capture the observed value, the expected value (if known), and the
   named public source that evidences the correction.
3. Update the envelope via the normal path:
   - programmatic: re-run fetcher or adjust transform in
     [../../scripts/fetch_data.py](../../scripts/fetch_data.py) with a test
     under `tests/`;
   - manual: use `python scripts/enter_manual.py --source <id> ...` and
     verify against the named document.
4. If correction cannot be made immediately, mark the envelope
   `status: "unavailable"` with an honest `notes` field explaining the gap
   (never hide the error).
5. Validator must pass before the correction merges.
6. Add a dated note to the incident log
   ([incident-response.md](incident-response.md)) when the correction
   resolves a SEV-1 or SEV-2 event.

## 5. Dispute channel

External parties (including data publishers, subject-matter experts, and
members of the public) can raise disputes via:

- GitHub Issues on the repository (preferred, public record).
- A named project contact address, to be published on the dashboard footer
  at Gate B.

Dispute handling steps:

1. Acknowledge within 5 business days.
2. Validate the claim against the named public source.
3. If the dispute is supported, execute the correction workflow and
   reference the dispute in the commit.
4. If the dispute is not supported, record the reasoning in the issue and
   close. Keep the public record.
5. Sensitive disputes (e.g. legal or rights concerns) are escalated to the
   system owner; do not paste private correspondence to the repository.

## 6. Manual override protocol

A manual override is any action that bypasses the normal fetch or validator
behaviour. Overrides are permitted only under these constraints:

- Must be documented in the pull request description with justification.
- Must not produce a `status: "ok"` envelope for a value that cannot be
  traced to a named public source.
- Must not disable the validator or manipulate its output.
- Must be reviewed and signed off by the data steward and the system owner.
- Must add a test or policy update that prevents the same override being
  needed again.

Any override that violates the non-fabrication rule is prohibited and is
treated as a SEV-1 incident if it occurs.

## 7. Review cadence

- Monthly: scan for stale envelopes, confirm `last_verified` on each
  source is current, action any publisher changes.
- Quarterly: review the dispute and correction log, update the risk
  register accordingly.
- Annually: rights and licence review across all sources.

## Change log

- 2026-04-21 - Initial stewardship workflow captured.
