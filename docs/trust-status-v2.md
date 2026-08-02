# Trust Status v2

Trust Status v2 is the public operational-transparency surface for Fuel Resilience AU.

## Generate

```bash
python scripts/apply_source_url_governance.py
python scripts/validate_project.py
python scripts/build_trust_status.py
python scripts/validate_trust_status_v2.py
```

The builder writes `data/trust_status_manifest.json` from current repository evidence. The committed file is a real generated artifact, not a zero-count bootstrap. Do not hand-edit generated counts. CI runs `python scripts/build_trust_status.py --check`; Pages and the weekly refresh build the deployment/publication copy before validating it.

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

Refresh marker v2 semantics and the v1 migration path are documented in [`docs/refresh-marker-v2.md`](refresh-marker-v2.md).

## Claim boundary

Trust Status is not a certification, not an official government assessment, not a security audit and not a risk score. It is not proof that every upstream value is correct or that every source is reachable. It reports repository evidence and known limitations. A successful automated refresh does not make manual sources current, and an inaccessible landing page does not by itself prove that the underlying dataset is unavailable.
