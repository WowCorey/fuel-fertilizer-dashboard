# Refresh marker v2

`data/last_successful_refresh.json` records automated refresh publication evidence. It does not prove that manual sources are current, that every upstream value is correct, or that the recorded output commit is the latest deployed commit.

## Why publication uses two commits

A commit cannot contain its own SHA. The weekly workflow therefore uses a fail-closed two-commit sequence:

1. `scripts/write_refresh_status.py` writes a prepared v2 marker with the workflow input SHA, source-data refresh timestamp, run identity, ref and branch. `output_commit_sha` is `null`, `output_commit_pushed` is `false`, and status is `pending_publication`.
2. The workflow commits the generated data, prepared marker and Trust Status artifact, then pushes that output commit.
3. Only after the push succeeds, the workflow finalizes the marker with the pushed output commit SHA, rebuilds Trust Status, commits those two evidence files, and pushes the marker commit.

The recorded `output_commit_sha` identifies the earlier commit containing the generated refresh output. It is deliberately not the later commit containing the finalized marker. If either push fails, the workflow fails; the remote repository either retains the previous marker or exposes a prepared marker that does not claim publication success.

## Fields

- `workflow_input_sha`: commit that triggered the workflow; retained as legacy `git_sha` for old consumers.
- `source_data_refreshed_at`: UTC timestamp for the source-data refresh; retained as `refreshed_at` for old consumers.
- `workflow_run_id` and `workflow_run_attempt`: Actions run identity; retained as `run_id` and `run_attempt`.
- `ref` and `branch`: workflow ref context.
- `output_commit_sha`: pushed commit containing generated refresh output, or `null` while prepared.
- `output_commit_pushed`: `true` only after the output push completed.
- `publication_state`: `prepared` or `published`.
- `status`: `pending_publication` while prepared and `success` only after finalization.

## Migration

Trust Status accepts the committed v1 marker during migration and labels its publication state `legacy_unverified`. It does not infer an output SHA for historical runs. The first successful weekly refresh using the v2 workflow replaces the v1 marker with independently distinguishable input and output commit evidence.
