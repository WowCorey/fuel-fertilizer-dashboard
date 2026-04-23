# State Petroleum Ledger Methodology

Last reviewed: 2026-04-23

The state petroleum ledger is a transparency companion to the fuel-security and
resource-value dashboards. It describes each Australian state or territory's
loaded petroleum/gas role, loaded state revenue context, source coverage, and
the gates that stop the repo from publishing unsupported attribution.

It is not a complete fiscal model, infrastructure inventory, permit register,
terminal-capacity dataset or company/project production map.

## What the page can show

- State/territory petroleum and gas production rows from Australian Energy
  Statistics where those rows are loaded into `resource_state_production_aes`.
- Basin and national production context already loaded from Geoscience
  Australia's Australian Energy Commodity Resources gas and oil pages.
- State-collected or state-recognised receipt context where the repo has a
  named public envelope:
  - WA/North West Shelf petroleum context.
  - Queensland petroleum royalties.
  - NSW combined minerals and petroleum royalty context.
  - NT combined mining and petroleum royalty context.
- Official NOPTA public spatial-data counts for current non-GHG offshore
  title/permit records and Petroleum Wells feature-layer records, stored in
  `state_petroleum_nopta_counts`.
- Official operating refinery facility counts from DCCEEW ministerial material,
  stored in `state_operating_refinery_counts`.
- Qualitative state role notes compiled from the loaded source envelopes.
- Explicit source gates for project/site/permit counts, production mapping,
  outage coverage, terminal/shipping visibility and dashboard status modelling.

## What the page does not attribute

Commonwealth revenue remains national-only unless a source publishes a
defensible state-level receipt row. The page does not allocate:

- Petroleum Resource Rent Tax receipts
- company income tax
- fuel excise
- GST on petroleum products
- Commonwealth resource-rent receipts

Allocating those receipts by production volume, company headquarters, port of
export, project geography or consumer spending would be a model. This page does
not publish that model.

## Revenue treatment

State-collected revenue is shown only when a named state or budget source
publishes a receipt line with a clear scope, period and unit.

The currently loaded petroleum-specific receipt envelopes are:

- `resource_wa_petroleum_royalty_receipts`: WA petroleum state component
  royalties plus North West Shelf grants, excluding adjacent non-petroleum
  iron ore lease rentals.
- `resource_qld_petroleum_royalty_receipts`: Queensland petroleum royalty
  receipts; the source notes petroleum includes gas converted into LNG.

The currently loaded context-only receipt envelopes are:

- `state_nsw_minerals_petroleum_royalty_context`: NSW Resources reports
  combined minerals and petroleum royalties. This is useful state context, but
  it is not a petroleum-only receipt.
- `state_nt_mining_petroleum_royalty_context`: NT Budget Paper 2 reports
  combined mining and petroleum royalties. This is useful state context, but it
  is not a petroleum-only receipt.

Commonwealth sources such as `resource_resource_rent_tax_receipts_budget`,
`resource_prrt_policy` and `resource_company_tax_rate` are shown as national
or policy context only. They are not state-attributed fields.

## Infrastructure treatment

The first-pass page prefers named infrastructure roles over counts. It avoids a
raw "site count" because counts become misleading unless the source defines the
unit being counted, such as active titles, producing fields, terminals, plants,
pipeline assets or storage facilities.

The current page can now show these separately defined object classes:

- NOPTA current offshore title/permit records, excluding Greenhouse Gas
  Assessment Permits.
- NOPTA active title records, separately from pending applications.
- NOPTA title-type records, such as production licences, retention leases,
  exploration permits and infrastructure licences.
- NOPTA Petroleum Wells feature-layer records by OffshoreArea. These are not
  active or producing well counts.
- Operating refinery facility counts for Queensland and Victoria, from an
  official DCCEEW source naming Ampol Brisbane/Lytton and Viva Energy Geelong.

The page still does not publish:

- terminal capacity
- pipeline capacity
- field-level production
- company-level state tax paid
- state-by-state fuel excise or GST
- producing-field counts
- LNG plant or train counts by state
- gas-processing plant counts by state
- import/storage terminal counts by state
- raw facility/site counts without an official definition

`docs/petroleum-ledger-source-gates.md` records the current source decisions
behind those blocked fields. NOPTA ArcGIS FeatureServers are now used for the
limited offshore title and well-layer counts they directly define. Geoscience
Australia's 2016 Petroleum Titles dataset is not used for current counts because
it is historical and the catalogue page does not provide usable current-rights
coverage for this dashboard.

## Data contract

The companion profile envelope is `state_resource_contribution_profiles`.

Each state profile can carry:

- `state_code`
- `state_name`
- `primary_role`
- `production_role`
- `crude_relevance`
- `gas_relevance`
- `lng_relevance`
- `refining_role`
- `import_role`
- `infrastructure_summary`
- `royalty_source_id`
- `royalty_context_source_id`
- `royalties_label`
- `federal_tax_attribution_status`
- `federal_tax_note`
- `project_count_status`
- `permit_count_status`
- `production_mapping_status`
- `source_coverage_label`
- `notes`

The numeric production and royalty values shown on the page are read from the
underlying source envelopes instead of being duplicated into the profile text.

The source-gate envelope is `state_petroleum_ledger_source_gates`. It records
which workstreams are implemented, partial or blocked and keeps the dashboard
from presenting future placeholders as completed operational coverage.

The petroleum coverage-count envelope is `state_petroleum_nopta_counts`. It
contains structured `extra.fields.state_rows`; the top-level `values` array is
intentionally empty so the page cannot collapse different object classes into a
single mixed count.

The refinery-count envelope is `state_operating_refinery_counts`. It contains
state rows for the two named operating refineries only; it does not contain
throughput, capacity, utilisation or outage data.

## Current gaps

- Petroleum-specific royalty receipt envelopes are not yet loaded for every
  state or territory. NSW and NT are loaded only as combined royalty context.
- Federal revenue remains national-only and unavailable by state.
- Terminal, storage and pipeline capacity remain unavailable.
- Onshore/state petroleum title systems remain unavailable; the current NOPTA
  count covers offshore/Commonwealth spatial-data records only.
- Project/company production flows remain unavailable except for partial
  state/basin production context from AES and AECR.
- Producing fields, LNG trains, gas-processing plants and import/storage
  terminal counts remain unavailable until an official source defines those
  objects clearly by state.
- The page is not a minerals-wide all-resource dashboard; it is scoped to the
  petroleum, gas, LNG, refining/import and storage systems relevant to the rest
  of this repo.
