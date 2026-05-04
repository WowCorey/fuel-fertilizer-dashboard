# Strategic Resources Methodology

Last reviewed: 2026-04-28

The Strategic Resources dashboard is a companion to the fuel, petroleum,
resource-value, infrastructure, power, manufacturing and economics pages. It
shows a first-pass public-interest view of selected resources Australia extracts
from the ground and why they matter strategically.

The page does not publish an "underground wealth" total. It does not combine
production, export value, export volume, Ore Reserves or Mineral Resources into
one national balance-sheet number.

## Data Contract

Each resource row can carry these fields:

| Field | Meaning | Source rule |
|---|---|---|
| `resource_id` | Stable dashboard key | Project-authored metadata |
| `resource_name` | Public label | Project-authored metadata |
| `production` | Mine or commodity production in a period | Official source must publish value, unit and period |
| `exports` | Export value and/or export volume | Official source must publish value, unit and period |
| `reserve_or_resource` | Ore Reserve or Mineral Resource row | Geoscience Australia or equivalent official source only |
| `state_footprint` | State/territory association | Official map/table/layer with clear object definition |
| `strategic_role_line` | Plain-English strategic role | Official/public strategy or commodity context |
| `source_coverage_label` | Strong, partial or unavailable | Project-authored coverage label derived from loaded source fields |

Unavailable fields stay unavailable. The page does not substitute export value
for production, production for reserves, or a policy role for a measured metric.

## Metric Separation Rules

Production is the amount produced in a period. The first pass uses Geoscience
Australia's AIMR 2025 preliminary tables for selected 2024 mine production rows.
Units differ by commodity, for example Mt, kt Li, Mt Cu, Mt oxide and t Au.

Export value is money earned from exports in a period. The first pass uses the
Department of Industry, Science and Resources December 2025 Resources and Energy
Quarterly (REQ) publication and forecast workbook. Coal is kept as separate
metallurgical and thermal export rows. Bauxite, alumina and primary aluminium
are kept as separate product rows.

Export volume is a traded physical quantity. It is not the same as production,
because stock changes, imports, processing, re-exports and product definitions
can differ.

Ore Reserves and Mineral Resources are in-ground inventory concepts as at a
date. The dashboard shows them only as named source rows with units and dates.
It does not multiply reserve tonnes by prices or treat reserve/resource life as
a forecast.

Strategic role is qualitative. It is sourced from official policy and commodity
context, especially Australia's Critical Minerals List and Strategic Materials
List, the DISR critical minerals pages, the Critical Minerals Strategic Reserve
page and GA AIMR context.

## State Footprint

The first-pass state footprint uses the Australian Operating Mines Map 2024
hosted feature layer from Geoscience Australia / Digital Atlas of Australia.
Rows are counted by commodity group, state and status.

These counts are useful for public geography, but they are not:

- production by state,
- export value by state,
- company market share,
- mine capacity,
- refinery footprint, or
- a count of all deposits in the ground.

Where a commodity group is broad, the dashboard labels the boundary. For
example copper uses copper-led base-metal groups and a mixed Cu/Au/U/Ag row;
rare earths use the Rare earth elements group for the headline footprint and do
not add mineral-sands rows into the rare-earth count.

## Coverage Labels

Strong coverage means the first pass has defensible production, export and
state-footprint context, plus reserve/resource context where relevant.

Partial coverage means at least one major field is source-safe but another
important field remains unavailable or has a scope caveat. Rare earths are
partial because production, reserves/resources and footprint are loaded, while
individual export value is not.

Unavailable means no dashboard-safe value is loaded. Sulphur is intentionally
unavailable until an official/public national source publishes a production,
export, reserve/resource or state-footprint metric with a clear unit and date.

## What Is Not Published

The page does not publish:

- a total dollar value of everything still underground,
- a company ranking,
- a stock-tipping signal,
- a reserve value created by multiplying tonnes by spot prices,
- a combined resource value made from production plus exports plus reserves,
- state-by-state export value unless a source publishes that split, or
- strategic claims not traceable to a named public source.

## Current First-Pass Resources

The first pass includes iron ore, coal, uranium, bauxite/alumina, copper,
nickel, lithium, rare earths, gold, zinc and sulphur as a source-gate row.

Sulphur remains unavailable. It is present only to make the gap explicit.
