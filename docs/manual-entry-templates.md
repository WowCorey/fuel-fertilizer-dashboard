# Manual Entry Templates

Use these as starting points after checking the named public source. Replace
example dates and values with the exact source table values. Do not estimate.

Run `python scripts/enter_manual.py --examples` for the short command version.

## Company Tax And Profit

Use this only after checking both the ATO row and the company's annual report
or ASIC-lodged financial statements.

```sh
python scripts/enter_manual.py ^
  --source company_ampol ^
  --field net_profit=122.5 ^
  --field net_profit_unit=A$m ^
  --field net_profit_period_end=2024-12-31 ^
  --field "net_profit_basis=statutory profit after tax attributable to equity holders of the parent entity" ^
  --last-data-point 2024-12-31 ^
  --notes "ATO 2023-24 Corporate Report for tax fields. Net profit copied from the company annual report; ATO tax year and annual-report period do not match exactly." ^
  --force
```

Private Australian subsidiaries should stay unavailable unless a public annual
financial statement or ASIC-lodged report can be cited.

## PM&C National Fuel Status Snapshot

Review all PM&C sources together so the national page stays internally
consistent.

```sh
python scripts/enter_manual.py ^
  --source pmc_tankers_on_water ^
  --point 2026-04-17=61 ^
  --field as_at=2026-04-17 ^
  --field crude_oil_tankers=10 ^
  --field crude_oil_equivalent_days=23 ^
  --field clean_refined_product_tankers=51 ^
  --field clean_refined_product_equivalent_days=16 ^
  --unit tankers ^
  --notes "PM&C public information on fuel supply page, ships on water table."
```

Do not add vessel names or AIS movements unless PM&C or another public,
licence-compatible source publishes them directly.

## FSSP And Offshore Ticket Disclosures

```sh
python scripts/enter_manual.py ^
  --source fuel_security_payment ^
  --point 2025-09-30=0 ^
  --unit A$m ^
  --notes "DCCEEW FSSP amounts paid table, GST-exclusive dollars converted to A$m."
```

```sh
python scripts/enter_manual.py ^
  --source offshore_ticket_volumes ^
  --point 2025-10-23=0 ^
  --unit kL ^
  --notes "DCCEEW Measures of liquid fuel stocks page. Public disclosure states no stock is currently held overseas under agreement."
```

If DCCEEW has not advanced the table, leave the existing value and let the
stale warning remain visible.

## Resource Value Royalty Receipts

```sh
python scripts/enter_manual.py ^
  --source resource_qld_petroleum_royalty_receipts ^
  --point 2023-24=1705 ^
  --field latest_actual_period=2023-24 ^
  --field includes_gas_converted_to_lng=true ^
  --field estimated_actual_2024_25=1689 ^
  --field budget_2025_26=1196 ^
  --unit A$m ^
  --notes "Queensland Budget Strategy and Outlook 2025-26 BP2 Revenue, Table 3.4 petroleum royalties."
```

Keep estimates and projections in `extra.fields`; the display value should be
the latest actual row unless the UI explicitly labels it as an estimate.

## Fertiliser Nutrient Subseries

Do not populate urea, potash, phosphate or compound fertiliser subseries unless
the source exposes the exact nutrient/product split, period, unit and import
scope. ABS SITC 562 total fertiliser imports and country concentration are live;
nutrient-level cards remain unavailable until a clean source exists.

## Review Commands

```sh
python scripts/review_due.py
python scripts/review_due.py --used-by national_status
python scripts/validate_data.py --json
python scripts/build_source_manifest.py --check
```
