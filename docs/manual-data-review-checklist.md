# Manual Data Review Checklist

Use this checklist before changing any `data/manual/*.json` envelope. Manual
data is allowed only when the value is copied from a named public source and the
source cannot safely be fetched programmatically.

## Before Entry

- Confirm the source is registered in `data/sources.yml`.
- Confirm `canonical_url`, `rights`, `rights_url`, `citation` and `reuse_notes`
  still match the publisher page or document.
- Confirm the value, unit, reporting period and table/figure label in the
  publisher document.
- Do not copy a number from media coverage, summaries or screenshots if the
  named source document is available.
- If the value requires a calculation, write the exact formula in the envelope
  `notes` or leave the value unavailable.

## Entry Rules

- Use `python scripts/enter_manual.py` where the helper supports the source.
- Use `docs/manual-entry-templates.md` or `python scripts/enter_manual.py --examples`
  for source-specific command templates before editing any public snapshot.
- Set `status` to `ok` only when every displayed value is verified.
- Set `retrieved_at` to the data-entry timestamp.
- Set `last_data_point` to the publisher reporting date or reporting-period end,
  not the day you typed the value.
- Keep `manual_entry: true`.
- Keep missing fields as `null` or unavailable. Do not estimate blanks.

## PM&C National Fuel Status Snapshot

- Review every PM&C envelope together so the page remains internally consistent:
  `pmc_fuel_security_level`, `pmc_mso_days_cover`,
  `pmc_mso_fuel_reserves`, `pmc_forward_import_orders`,
  `pmc_tankers_on_water` and `pmc_retail_stockouts`.
- Preserve the source table date for each envelope. The PM&C page can publish
  different dates for stock coverage and stock-out tables.
- Do not add vessel names, AIS data or inferred tanker movements. The dashboard
  publishes aggregate public counts only.

## FSSP And Offshore Stockholding

- For `fuel_security_payment`, use the public DCCEEW FSSP amounts-paid table.
  Values are GST-exclusive and displayed as A$m.
- For `offshore_ticket_volumes`, use only a public DCCEEW disclosure that states
  stock held overseas or the current absence of such holdings.
- If the public page has not advanced, leave the existing value and let the
  validator stale warning tell the truth.

## Company Tax And Profit Rows

- ATO fields (`total_income`, `taxable_income`, `income_tax_paid`) must come
  from the ATO Corporate Tax Transparency workbook for the named tax year.
- Net profit must come from the company's own annual report or ASIC-lodged
  financial statements, not from broker summaries or media coverage.
- Do not mix unmatched periods silently. If the ATO row is for 2023-24 but the
  annual report is a 31 December year, record the report period in a separate
  field such as `net_profit_period_end` and explain the mismatch in `notes`.
- Do not convert USD-reported profit into A$m unless the envelope notes the
  exact FX source and formula. Leave the field unavailable when the dashboard
  cannot show the unit honestly.
- Do not use group-level annual-report profit for an Australian tax entity
  unless the source scope is clear. Add `net_profit_basis` when the report
  distinguishes statutory NPAT, NPAT attributable to shareholders, and
  replacement-cost or underlying NPAT.

## Review Checks

Run these before committing:

```sh
python scripts/validate_data.py --json
python scripts/build_source_manifest.py --check
python scripts/review_due.py
python -m unittest discover -s tests
```

If a dashboard page changed, also run:

```sh
npm run build:ui
npm run smoke:ui
```
