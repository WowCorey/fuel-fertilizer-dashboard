# Trust Status v2

Trust Status v2 is the public operational-transparency surface for Fuel Resilience AU.

## Generate

```bash
python scripts/apply_source_url_governance.py
python scripts/validate_project.py
python scripts/build_trust_status.py
python scripts/validate_trust_status_v2.py
```

The builder writes `data/trust_status_manifest.json` from current repository evidence. Do not hand-edit generated counts after the builder has run.

## Public page

- `trust-status.html` — top-level entry point
- `ui_kits/trust-status-dashboard/index.html` — full public page

## Evidence inputs

- `data/source_manifest.json`
- `data/generated/*.json`
- `data/manual/*.json`
- `data/last_successful_refresh.json`
- `data/source_link_health.json`, when generated
- `scripts/validate_project.py --json`
- configured workflow files under `.github/workflows/`

## Claim boundary

Trust Status is not a certification, not an official government assessment and not a security audit. It reports repository evidence and known limitations. A successful automated refresh does not make manual sources current, and an inaccessible landing page does not by itself prove that the underlying dataset is unavailable.
