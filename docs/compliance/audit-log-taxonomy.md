# Audit log taxonomy

Defines the event model, retention and export policy for audit and activity
logs produced by the Fuel Resilience AU system. In the feasibility phase the
system's "log" is the Git history plus CI output; this file sets the schema
that a centralised log platform will implement at Gate C.

## 1. Event classes

Five event classes are recognised. Every event belongs to exactly one class.

| Class | Purpose | Typical sources |
|-------|---------|-----------------|
| access | Read or browse of a restricted surface | Future only; not applicable in current public scope |
| data_change | Any change to registry, envelopes or derived outputs | Git commits touching `data/` |
| model_run | Execution of a fetcher, derivation or validator | `scripts/fetch_data.py`, `scripts/validate_data.py` |
| source_failure | Upstream publisher returned error, missing data or schema mismatch | Fetcher error logs |
| alert_trigger | Operational alert raised (stale data, validator failure, synthetic monitor failure) | CI outcomes, future synthetic monitors |

Security-critical events (secret rotation, permission change) are a subclass
of `data_change` when they affect the repository, and a subclass of
`access` when applied to a restricted surface in the future.

## 2. Event schema

All audit events must serialise to the following JSON shape.

```json
{
  "event_id": "<uuid>",
  "timestamp": "<ISO 8601 UTC>",
  "class": "<access|data_change|model_run|source_failure|alert_trigger>",
  "actor": {
    "type": "<human|automation|upstream>",
    "id": "<user name, bot name or upstream source id>"
  },
  "action": "<short verb phrase>",
  "target": {
    "type": "<source|envelope|workflow|dashboard|repository>",
    "id": "<identifier>"
  },
  "outcome": "<success|failure|warning>",
  "context": {
    "workflow_run_id": "<optional>",
    "commit_sha": "<optional>",
    "source_id": "<optional>",
    "status_before": "<optional>",
    "status_after": "<optional>"
  },
  "notes": "<free-text, optional>"
}
```

Schema rules:

- `timestamp` is ISO 8601 with timezone, UTC preferred.
- `outcome` is one of `success`, `failure` or `warning`. Missing is not
  allowed.
- `context` is open-ended but every key listed above has a fixed meaning.
- No PII. No secret values. No upstream body content.
- Events are append-only; corrections are new events referencing the prior
  `event_id` via `notes`.

## 3. Minimum logged actions

These actions must be logged from Gate C onward; before then, equivalent
evidence comes from Git and CI.

Data change events:
- `source_added`, `source_updated`, `source_removed`.
- `envelope_published` (generated or manual), with `status_before` and
  `status_after`.
- `envelope_marked_unavailable`.

Model run events:
- `fetcher_run` with per-source outcome.
- `validator_run` with summary counts (errors, warnings).
- `manifest_rebuild`.

Source failure events:
- `fetch_http_error` (status, url domain only).
- `fetch_schema_mismatch`.
- `rights_change_detected` (e.g. `rights_url` returns non-2xx).

Alert trigger events:
- `stale_data_warning` past configured grace.
- `synthetic_check_failed`.
- `ci_blocked_merge` (validator failure on PR).

Access events (future only):
- `restricted_surface_viewed` (subject, resource, outcome).
- `export_requested`.

## 4. Retention and export

- Feasibility phase: Git history plus GitHub Actions run logs are the
  record. GitHub Actions logs are retained per platform default; the
  project treats those as transient and relies on Git for durable record.
- From Gate C: centralised log platform retains audit events for 7 years
  minimum (aligned with common Australian government records retention
  practice and the expectation in this project's target posture).
- Exportability: the platform must support on-request export of a filtered
  event set in JSON or CSV, within 10 business days.
- Immutability: logs must be append-only with cryptographic or
  platform-level integrity protection. Deletions are not permitted within
  the retention window; corrections use the superseding-event pattern.

## 5. Access to logs

- Feasibility phase: Git history and CI logs are public; no separate access
  control needed.
- From Gate C: access to the centralised log platform is least-privilege,
  MFA-enforced, and access events are themselves logged as `access` class
  events.

## 6. Privacy

- The dashboard collects no user data today, so no log entry contains PII.
- If analytics or telemetry is ever added, a DPIA must complete first
  (Gate D trigger in [phase-gates.md](phase-gates.md)) and this taxonomy
  must be extended with explicit privacy-safe handling rules before any
  logging of user-originated data begins.

## 7. Implementation notes

- Python helpers should emit log events to stdout in the JSON shape above
  when called in a logging-enabled environment; CI captures those for the
  centralised platform.
- Where a log sink is not yet available, helpers must still construct the
  event shape and print it so that later ingestion does not require rework.

## Change log

- 2026-04-21 - Initial taxonomy.
