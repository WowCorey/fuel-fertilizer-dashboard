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
- Official NOPTA active petroleum production-licence rows that map offshore
  area/state, basin, field name, title, title operator and title holders where
  those fields are published, stored in
  `state_petroleum_production_licence_map`.
- Department of Industry Resources and Energy Major Projects 2024 oil and gas
  rows that map project, company/proponent text, state, resource, status and
  annual estimated new capacity where published, stored in
  `state_oil_gas_major_projects_remp`.
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

## Production mapping treatment

The page now has two partial production-mapping layers:

- `state_petroleum_production_licence_map` reads active NOPTA offshore
  petroleum production licences. This supports state to basin to field/title to
  title-operator and title-holder mapping where the NOPTA layer publishes those
  fields. It does not publish production volumes, field output, tax paid,
  ownership shares or onshore/state title systems.
- `state_oil_gas_major_projects_remp` reads the Department of Industry Resources
  and Energy Major Projects 2024 workbook, Oil & gas sheet. This supports
  project to company/proponent to state/resource/status mapping and estimated
  new capacity where numeric. It is a major-project/development list, not a
  current production table, and it does not publish basin names or legal
  operator roles.

The page uses "project/company mapping" cautiously. A NOPTA title operator is
shown as an operator because the source field is explicitly `TitleOprat`.
A REMP company is shown as company/proponent text only because the workbook
does not identify whether the company is an operator, owner, joint-venture
participant or sponsor.

No row from either source is used as a current production value. If a source
does not publish a production volume by field/project/company, the production
value remains unavailable.

The page still does not publish:

- terminal capacity
- pipeline capacity
- field-level production volumes
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

The NOPTA production-licence map envelope is
`state_petroleum_production_licence_map`. It contains structured
`extra.fields.production_licence_rows` and `extra.fields.state_rows`. The
top-level value is only the count of loaded active production-licence records.
It must not be read as production volume.

The REMP oil-and-gas major-project map envelope is
`state_oil_gas_major_projects_remp`. It contains structured
`extra.fields.project_rows` and `extra.fields.state_rows`. Its capacity fields
are annual estimated new capacity where published, not current production.

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
- Current project/company production volumes remain unavailable. The page now
  shows partial NOPTA production-licence mapping and REMP oil/gas major-project
  mapping, but neither source is a field/project production-volume table.
- Producing fields, LNG trains, gas-processing plants and import/storage
  terminal counts remain unavailable until an official source defines those
  objects clearly by state.
- The page is not a minerals-wide all-resource dashboard; it is scoped to the
  petroleum, gas, LNG, refining/import and storage systems relevant to the rest
  of this repo.
