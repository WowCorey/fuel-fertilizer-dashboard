# Employment and Automation Methodology

## Purpose

The Employment & Automation dashboard combines conventional Australian labour-market indicators with a small chronology of published AI rollout milestones. It does **not** claim that a product launch caused a movement in employment, vacancies, hours worked, wages, participation or underemployment.

## Quantitative labour indicators

Quantitative cards must come from named public statistical series registered in `data/sources.yml`, including Australian Bureau of Statistics labour-force, vacancies and wage-price data where loaded.

Each value retains its source cadence, reference period, retrieval timestamp and status. A recently retrieved envelope can still contain an older reference period because publication schedules differ.

## AI rollout timeline

`ai_rollout_timeline_context` is chronology-only context.

The timeline may record a milestone when:

- the named organisation published the event;
- a date and source URL are available;
- the event description can be stated without interpretation;
- the dashboard makes clear that timing is not causation.

The timeline must not be used to infer job losses, job creation, productivity effects or occupational exposure without a separate source and methodology.

## Automation-exposure source gate

`automation_exposure_context` remains unavailable because this project has not identified a canonical Australian public dataset that provides a current, reproducible and nationally representative numerical measure of occupational exposure to AI or automation suitable for this dashboard.

This unavailable state means:

- no approved source-safe series has been loaded;
- private consultancy scores, vendor claims and media summaries are not substituted;
- absence of a dashboard value is not evidence that exposure is zero;
- future inclusion requires a named publisher, method, unit, reference period, reuse basis and reproducible extraction path.

## Interpretation boundary

The dashboard can show that labour indicators and AI rollout milestones occurred during overlapping periods. It cannot, from chronology alone, determine whether AI caused a labour-market change.

Any future causal or scenario model must be presented separately from observed statistics and must disclose assumptions, uncertainty and validation limits.
