# State Fuel & Resource Contribution Methodology

Last reviewed: 2026-04-23

The state contribution page is a transparency companion to the fuel-security
and resource-value dashboards. It describes each Australian state or territory's
loaded petroleum/gas role and keeps public revenue channels separate.

It is not a complete fiscal model, infrastructure inventory or project map.

## What the page can show

- State/territory petroleum and gas production rows from Australian Energy
  Statistics where those rows are loaded into `resource_state_production_aes`.
- Basin and national production context already loaded from Geoscience
  Australia's Australian Energy Commodity Resources gas and oil pages.
- State-collected or state-recognised petroleum receipt context where the repo
  has a named public envelope, currently WA/North West Shelf context and
  Queensland petroleum royalties.
- Qualitative state role notes compiled from the loaded source envelopes.

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
publishes a petroleum-specific or clearly petroleum-linked receipt line.

The currently loaded state receipt envelopes are:

- `resource_wa_petroleum_royalty_receipts`: WA petroleum state component
  royalties plus North West Shelf grants, excluding adjacent non-petroleum
  iron ore lease rentals.
- `resource_qld_petroleum_royalty_receipts`: Queensland petroleum royalty
  receipts; the source notes petroleum includes gas converted into LNG.

Commonwealth sources such as `resource_resource_rent_tax_receipts_budget`,
`resource_prrt_policy` and `resource_company_tax_rate` are shown as national
or policy context only. They are not state-attributed fields.

## Infrastructure treatment

The first-pass page prefers named infrastructure roles over counts. It avoids a
raw "site count" because counts become misleading unless the source defines the
unit being counted, such as active titles, producing fields, terminals, plants,
pipeline assets or storage facilities.

The current page therefore uses cautious role statements such as refinery
context, LNG export context, basin context and import/storage context. It does
not publish:

- terminal capacity
- pipeline capacity
- field-level production
- company-level state tax paid
- state-by-state fuel excise or GST
- raw facility/site counts without an official definition

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
- `royalties_label`
- `federal_tax_attribution_status`
- `federal_tax_note`
- `source_coverage_label`
- `notes`

The numeric production and royalty values shown on the page are read from the
underlying source envelopes instead of being duplicated into the profile text.

## Current gaps

- Petroleum-specific royalty receipt envelopes are not yet loaded for every
  state or territory.
- Federal revenue remains national-only and unavailable by state.
- Terminal, storage and pipeline capacity remain unavailable.
- Project/company production flows remain unavailable.
- The page is not a minerals-wide all-resource dashboard; it is scoped to the
  petroleum, gas, LNG, refining/import and storage systems relevant to the rest
  of this repo.
