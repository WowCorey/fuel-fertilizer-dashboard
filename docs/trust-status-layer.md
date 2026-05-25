# Trust Status Layer

The trust status layer is a public credibility surface for Fuel Resilience AU.

It does not certify the dashboard. It makes the dashboard easier to audit by showing:

- repository health signals;
- source-confidence bands;
- known public-data gaps;
- claim boundaries;
- next build steps.

## Files added

| File | Purpose |
|---|---|
| `data/trust_status_manifest.json` | Canonical trust manifest for public health signals, confidence bands, rules, gaps and next steps. |
| `ui_kits/trust-status-dashboard/index.html` | Static public dashboard that reads the trust manifest, refresh marker and source manifest in the browser. |
| `docs/trust-status-layer.md` | This implementation note. |

## Claim boundary

This layer reports repository and source-governance signals. It does not validate every upstream source, claim official government status, or turn partial public data into complete operational visibility.

## Build direction

The first version is intentionally simple and static. The next stronger version should generate the manifest from live repository evidence:

1. `data/source_manifest.json` for source coverage counts.
2. `data/sources.yml` for source-mode and rights metadata.
3. `data/last_successful_refresh.json` for refresh status.
4. GitHub workflow metadata for latest CI, Pages deploy, refresh and manual review conclusions.

Until that generator exists, the manifest must remain conservative and must not imply live workflow conclusions beyond what is available in committed files.

## Trust rules

- No made-up data.
- No unsupported estimates.
- Manual public-source snapshots stay labelled as manual.
- Source-gated rows stay visible as data gaps.
- Public health signals must point to real repository paths.
- The trust page must not describe the project as certified, official or complete.
