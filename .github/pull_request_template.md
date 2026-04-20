## What changed

- 

## Why

- 

## Scope

- [ ] Change is small and targeted (or intentionally split plan documented)
- [ ] No unrelated refactors/reformatting included
- [ ] Commit messages follow Conventional Commits

## Validation

- [ ] `python scripts/validate_data.py` passes
- [ ] Python compile check passes:
  - `python -m py_compile scripts/fetch_data.py scripts/init_manual_stubs.py scripts/validate_data.py scripts/check_commit_scope.py scripts/release_semver.py scripts/install_hooks.py`
- [ ] Manual smoke-check completed for touched dashboard pages

## Data and documentation integrity

- [ ] No fabricated/interpolated/backfilled values introduced
- [ ] `status`, `retrieved_at`, `manual_entry` semantics preserved
- [ ] `data/sources.yml` contract fields kept consistent (including rights/citation metadata)
- [ ] README claims reviewed for drift; updated if behavior changed

## Release impact

- [ ] Expected semver impact acknowledged:
  - [ ] patch (`fix|perf|refactor|data|docs|test|chore|ci|build|style`)
  - [ ] minor (`feat`)
  - [ ] major (`!` or `BREAKING CHANGE`)
- [ ] If `main` receives this PR, auto semver bump/tag on push is expected

## Risk and rollback

- Risk level: [ ] low [ ] medium [ ] high
- Rollback plan:
  - 
