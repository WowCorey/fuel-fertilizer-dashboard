## Data-only change

- [ ] This PR changes only `data/**` (and optionally README/docs notes about data freshness)
- [ ] No dashboard runtime or pipeline logic changes are included

## What changed

- 

## Source and envelope integrity

- [ ] No fabricated/interpolated/backfilled values introduced
- [ ] `source_id` matches envelope filename and source registry entry
- [ ] `status`, `retrieved_at`, `last_data_point`, `manual_entry` semantics are valid
- [ ] Rights/citation/reuse metadata remains accurate in `data/sources.yml`

## Validation

- [ ] `python scripts/validate_data.py` passes
- [ ] If programmatic data changed: `python scripts/fetch_data.py --check` was run

## Documentation drift

- [ ] README claims reviewed for drift (cadence/status/availability wording)
- [ ] Updated docs if behavior or interpretation changed

## Risk and rollback

- Risk level: [ ] low [ ] medium [ ] high
- Rollback plan:
  - Revert this PR
  - Re-run validator
