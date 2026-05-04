# Strategic Resources Source Audit

Last reviewed: 2026-04-28

This audit records the source choices for the Strategic Resources dashboard.
The page is fail-closed: a resource can appear with partial or unavailable
fields when a public source does not support the exact metric needed.

## Source Decisions

| Source | Publisher | Format | Rights/reuse | Supports | Decision |
|---|---|---|---|---|---|
| Resources and Energy Quarterly: December 2025 | Department of Industry, Science and Resources | Publication page, PDF, XLSX forecast workbook | Commonwealth copyright; DISR terms apply | Export value, export volume, production/outlook context for major resource commodities | Usable for export rows; do not use aggregate "other critical minerals" as a rare-earth value |
| AIMR 2025 preliminary tables | Geoscience Australia | HTML tables | CC BY 4.0 where stated by publisher | Mine production, Ore Reserves, Measured and Indicated Mineral Resources, Inferred Mineral Resources, operating-mine counts | Usable for selected production and reserve/resource rows; units must remain attached per commodity |
| Australian Operating Mines Map 2024 hosted feature layer | Geoscience Australia / Digital Atlas of Australia | ArcGIS FeatureServer, data.gov.au metadata | CC BY 4.0 where stated in item metadata | State footprint by commodity group and status | Usable for qualitative/structured state footprint; not usable as production by state |
| Australia's Critical Minerals List and Strategic Materials List | Department of Industry, Science and Resources | HTML table | Commonwealth copyright; DISR terms apply | Strategic role for critical minerals and strategic materials | Usable for strategic-role framing only |
| DISR Critical minerals page and Critical Minerals Strategic Reserve page | Department of Industry, Science and Resources | HTML | Commonwealth copyright; DISR terms apply | Strategic rationale for supply chains, defence, clean energy, processing, strategic reserve subset | Usable for qualitative relevance; not a metric source |
| State resource department pages | State governments | Mixed | Varies by state | More granular state production/project context | Deferred; first pass uses GA national feature layer instead |
| Company reports, investor decks and brokerage notes | Companies/private sources | Mixed | Varies | Project-level claims | Blocked as primary sources for this page |
| Media summaries and advocacy pages | Media/NGO/advocacy | Mixed | Varies | Contextual claims | Blocked as primary sources unless they point to a named official underlying dataset |

## Resource Coverage

| Resource | Production | Export value/volume | Reserve/resource | State footprint | Result |
|---|---|---|---|---|---|
| Iron ore | AIMR 2025 | REQ December 2025 | AIMR 2025 | GA operating mines layer | Strong |
| Coal | AIMR 2025 black coal | REQ December 2025 metallurgical and thermal rows | AIMR 2025 | GA operating mines layer | Strong |
| Uranium | AIMR 2025 | REQ December 2025 | AIMR 2025 | GA operating mines layer | Strong |
| Bauxite/alumina | AIMR 2025 bauxite | REQ December 2025 bauxite, alumina and aluminium rows | AIMR 2025 bauxite | GA bauxite mine rows only | Partial |
| Copper | AIMR 2025 | REQ December 2025 | AIMR 2025 | GA operating mines layer | Strong |
| Nickel | AIMR 2025 | REQ December 2025 | AIMR 2025 | GA operating mines layer | Strong, with weak market context |
| Lithium | AIMR 2025 | REQ December 2025 | AIMR 2025 | GA operating mines layer | Strong |
| Rare earths | AIMR 2025 | Individual export row unavailable | AIMR 2025 | GA operating mines layer | Partial |
| Gold | AIMR 2025 | REQ December 2025 | AIMR 2025 | GA operating mines layer | Strong |
| Zinc | AIMR 2025 | REQ December 2025 | AIMR 2025 | GA operating mines layer | Strong |
| Sulphur | Unavailable | Unavailable | Unavailable | Unavailable | Unavailable |

## Blocked Or Partial Fields

Rare earths: REQ provides an "other critical minerals" aggregate narrative, but
the dashboard does not attribute that aggregate to rare earths. Individual rare
earth export value remains unavailable.

Bauxite/alumina: bauxite mine production and bauxite/alumina export rows are
loaded. Alumina refinery footprint is not loaded from the operating-mines layer,
so the state footprint is bauxite-mine-only.

Sulphur: no official national production/export/reserve row has been loaded.
The page includes sulphur only as an unavailable source-gate row.

State splits: the GA operating-mines layer is a feature count source. It cannot
support production by state, export value by state or capacity by state.

Reserve valuation: AIMR reserves/resources are physical inventory rows. They
are not valued in dollars and are not multiplied by market prices.
