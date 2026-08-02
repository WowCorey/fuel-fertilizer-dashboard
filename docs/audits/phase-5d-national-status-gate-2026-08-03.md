# Phase 5D national status-model readiness audit

Date: 2026-08-03  
Baseline: `d4802573d881dbb49b0f4d0d71a5dbb8d18851e7`  
Scope: issue #37, existing fuel-status methodology, current manifests,
evidence envelopes, workflows and public claim boundaries

## Result

The national status model is **blocked**. The repository may continue to show
public non-composite source-labelled indicators, but it cannot defend a
project-authored national status, risk level or composite score.

No score, band, inferred value, threshold pass or national status card was
created. The machine artifact contains `null` for unresolved empirical
thresholds and for both possible publication outputs.

## Defects found and corrected

1. The five-band 0-100 draft conflicted with issue #37's four-state proposal.
   It also contained an uncalibrated 60% coverage cutoff, quality multipliers
   and tentative weights. The document is now explicitly an archived,
   unapproved candidate and is no longer described as the locked gate.
2. The previous prose gate did not distinguish coverage, freshness,
   methodology, rights, operational and communication readiness. The new gate
   evaluates each independently while failing closed overall.
3. Required thresholds had no machine representation of rationale,
   measurement, sensitivity, failure behaviour, ownership or review date. The
   new schema requires all six fields and preserves unresolved empirical values
   as `null`.
4. Nothing reconciled a readiness snapshot to explicit source modes, envelope
   presence, warning categories, route count or required indicator states. The
   validator derives each from named fields and rejects unknown modes and count
   drift.
5. Nothing mechanically prevented a public-ready state with blockers or a
   published score/status without methodology approval. The validator now
   rejects both.

Validation was not weakened. Current freshness warnings remain visible and do
not become zero in the gate.

## Current evaluation

- Sources: 219 total — 52 programmatic, 101 manual, 4 derived, 62 unavailable.
- Envelope presence: 49 generated-only, 163 manual-only, 7 both, 0 missing.
- Warnings: 17 total — 13 manual stale, 4 generated stale, 0 rights, 0 source
  name, 0 source URL and 0 other.
- Public routes: 23.
- Required operational gaps: status model, live national outage feed, live
  vessel tracking and terminal capacity all remain `unavailable`.
- Eleven blocking conditions remain open.

## Threshold review

The only numeric thresholds are zero-valued schema/publication invariants.
They prevent unknown modes, missing envelopes, unresolved contributing rights,
stale critical inputs and unvalidated derived inputs. They do not determine a
status band.

Current-outage geography, unavailable contributing weight, historical baseline
length, single-publisher weight and source-specific freshness windows remain
unresolved with `null` values. No arbitrary numeric substitutes were added.

## Tests added

`tests/test_national_status_gate.py` covers:

- the committed gate and live manifest snapshot;
- unknown readiness categories and source modes;
- source-mode, envelope-presence, warning and route count mismatches;
- silent unresolved-null-to-zero conversion;
- missing threshold rationale;
- public-ready flags while blockers remain;
- score/status publication without approved methodology;
- required indicator-state drift;
- missing claim-boundary language; and
- CI, Pages and refresh workflow integration.

## Residual blockers

The exact open blockers and clearing conditions are machine-readable in
`data/national_status_model_gate.json`. Material unresolved work includes
national outage coverage, terminal-capacity evidence, rights-safe live
vessel/cargo data, an approved programmatic or fail-closed manual national
snapshot contract, model-specific freshness windows, historical replay,
transition rules, coverage denominators, publisher concentration measurement
and independent methodology approval.

This audit does not claim that terminal capacity, vessel cargo, private stocks,
live national outages or future shortages can be observed from current public
evidence.
