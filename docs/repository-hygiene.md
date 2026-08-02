# Repository hygiene classification

Reviewed: 2026-08-03

This classification is deliberately conservative. It does not authorize deleting remote branches or historical evidence documents merely because they are old.

| Path or object | Classification | Decision |
|---|---|---|
| `data/sources.yml`, `data/generated/`, `data/manual/` | required runtime/build input | Keep tracked. These are evidence inputs and envelopes. |
| `data/source_manifest.json`, `data/trust_status_manifest.json`, `data/source_link_health.json` when present, and generated UI JS | required runtime/build input | Keep tracked and regenerate through repository scripts. CI checks deterministic content, allowing only declared time fields. |
| `docs/audits/` | useful maintained documentation | Keep as dated audit evidence. Later corrections should be additive and must not rewrite historical claims into false contemporaneous certainty. |
| Methodology and source-gate documents under `docs/` | useful maintained documentation | Keep. Their dates and superseded status must be explicit where applicable. |
| `docs/remaining-data-gaps.md` | useful maintained documentation | Keep as a non-authoritative editorial backlog. The source registry and envelopes win on disagreement; the public scoreboard does not parse this file. |
| `.cursor/hooks/state/` | development-tool state that should be ignored | Removed the tracked state file and ignored the directory. It contained local generation counters, not project evidence. |
| `.kg/` | obsolete artifact safe to remove | Removed and ignored. Inspection found a 2026-05-30 partial graph with 25 nodes and 23 edges, only 7 of 12 current Python scripts, no dependency edges, a truncated repository purpose and no CI/build consumer. Its structural validator passed but did not establish completeness or currency. Git history retains recovery. |
| `node_modules/`, Python caches, Playwright reports and test results | development-tool state that should be ignored | Already ignored; keep untracked. |
| `docs/v1.4-plan.md` and `docs/fuel-security-backlog.md` | useful historical documentation | Keep, but label as superseded or legacy so they cannot be mistaken for current implementation/source status. |
| Merged remote implementation branches | obsolete administration artifacts, potentially safe to remove | No deletion in Phase 4. Inspection found 31 non-main remote refs already merged into `origin/main`, including the Phase 2B and Phase 3 branches. Owners should prune them in a separate branch-administration action after checking protections and open work. |
| Unmerged remote branches | unclassified active or historical work | No deletion. Inspection found 65 non-main refs not merged into `origin/main`; age alone is not proof that they are obsolete. |

Generated publication artifacts are not temporary files. A generated file may be removed only when its consumer and generation path are also retired or migrated.
