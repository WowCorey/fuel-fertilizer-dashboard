# Australian Liquid-Fuel Terminal Capacity Source Gate

Last reviewed: 2026-08-03 AEST

Issue: [#35 - assess public terminal-capacity source options](https://github.com/WowCorey/fuel-fertilizer-dashboard/issues/35)

## Decision

**Gate B - do not integrate terminal-capacity values.**

The review found a current, machine-readable Geoscience Australia terminal-location layer and several official sources that describe stocks, grants, planning approvals or individual facilities. It did not find a production-safe public source for current Australian liquid-fuel terminal capacity.

No reviewed source combines all of the following:

- a stable terminal identity and location;
- an explicit capacity value and unit;
- the capacity concept being measured, such as nameplate, working, available or approved capacity;
- product allocation where a total cannot safely stand for every product;
- a source date or capacity-effective date;
- current operational status;
- a stated national coverage boundary, or an honest declared partial-coverage boundary;
- a lawful public reuse path; and
- a reproducible extraction path that does not require inferred or privately compiled joins.

Accordingly, `fuel_security_terminal_capacity` must remain `status: unavailable` with an empty `values` array. This decision does not mean terminal capacity is zero, that terminals do not exist, or that the information is unavailable to governments or operators. It means no reviewed public source meets this repository's publication standard.

## Gate definitions

### Gate A - eligible for implementation

A source can pass Gate A only if every production-safe requirement above is documented and testable. A partial source may pass only for an explicitly bounded partial-coverage product; it must not be presented as national coverage.

### Gate B - remain unavailable

Gate B applies when one or more required evidence fields are absent, rights are insufficient, coverage cannot be bounded, source concepts are not comparable, or a national result would depend on uncontrolled joins. Gate B requires documentation of the blocker and fail-closed behavior. It does not authorise an estimate, interpolation or substitute value.

## Evidence-class rules

The reviewed material uses the following classifications. These labels are not quality rankings; they state what a source can prove.

| Classification | What the source can support | What it cannot be used to claim |
|---|---|---|
| `location_only` | A dated facility identity or spatial point | Storage capacity, inventory, availability or throughput |
| `inventory_context` | Stocks held for the reported geography, period and products | Installed or available storage capacity |
| `grant_or_announcement` | A funded or announced incremental project scope | Current completion, current operation or total site capacity |
| `planning_or_approval` | A permitted design maximum or proposed configuration | As-built, commissioned, available or current capacity |
| `site_specific_official` | The exact claim for one named facility and date | National completeness or comparable capacity across terminals |
| `operator_claim` | The operator's own current site description | Open redistribution rights, independent verification or national coverage |
| `historical_context` | Historical ownership, throughput or aggregate change | Current terminal capacity |
| `access_blocked` | The attempted retrieval path did not return reusable data | That the underlying dataset does not exist or is unavailable |
| `production_safe` | Every Gate A field, right and coverage condition is satisfied | Any claim beyond the documented coverage boundary |

A 403, 429, timeout, anti-bot response, redirect failure or DNS failure is classified as an access condition. It is never promoted to evidence that the underlying dataset is unavailable.

## Source-decision matrix

All URLs in this matrix were accessed on 2026-08-03 AEST unless a source date is stated separately.

| Source | Publisher and type | Exact fields or claims reviewed | Geography, product and time scope | Machine access and cadence | Rights and redistribution | Completeness and evidence risks | Decision |
|---|---|---|---|---|---|---|---|
| [Liquid Fuel Facilities - `Liquid_Fuel_Terminals` layer](https://services.ga.gov.au/gis/rest/services/Liquid_Fuel_Facilities/MapServer/1) | Geoscience Australia; ArcGIS REST feature layer | `objectid`, `shape`, `featuretype`, `description`, `class`, `name`, `operationalstatus`, `operator`, `owner`, `address`, `suburb`, `state`, `spatialconfidence`, `revised` | 78 records returned: NSW 12, NT 4, QLD 22, SA 6, TAS 6, VIC 12 and WA 16; generic liquid-fuel terminals; record revision dates ranged from 2012-06-11 to 2020-08-21 | JSON, GeoJSON and PBF queries; no publication cadence stated | Layer states Commonwealth of Australia (Geoscience Australia) 2022 and CC BY 4.0 | No capacity, capacity unit, product allocation, throughput or inventory field. The service describes 69 records as operational and 9 as decommissioned, but the currency of those statuses is not established by the layer revision dates. ACT has no returned record. | `location_only`; useful research lead, not a capacity source |
| [Liquid Fuel Facilities product package, DOI 10.26186/147636](https://doi.org/10.26186/147636) | Geoscience Australia; downloadable product package | Facility attributes corresponding to the spatial product; the reviewed download returned 79 terminal records | National facility-location product; underlying revisions are not a current capacity series | Static download plus catalogue record; cadence not stated | Geoscience Australia product; CC BY 4.0 stated by the associated service | The 79 downloaded rows did not reconcile with the 78 live layer rows on the review date. Neither representation contains capacity. The mismatch must be resolved before any future location inventory is published. | `location_only`; do not integrate for capacity |
| [Geoscience Australia - National Liquid Fuel Terminals 2015](https://data.gov.au/data/dataset/au-govt-ga-national-liquid-fuel-terminals-2015-na) | Geoscience Australia via data.gov.au/AURIN; catalogue and WFS access route | Terminal-location snapshot; no capacity, product stock, outage or inventory fields | Australian locations; 2015-labelled historical product | data.gov.au exposes an AURIN download-manager route; the reviewed AURIN route redirected and its recorded gatekeeper hostname did not resolve | CKAN metadata states CC BY 4.0 | The access failure is `access_blocked`, not proof of source unavailability. The newer GA service above supersedes the claim that no machine-readable location layer exists, but still does not supply capacity. | `historical_context` and `location_only`; not capacity |
| [Australian Petroleum Statistics](https://www.energy.gov.au/energy-data/australian-petroleum-statistics) and [data.gov.au package](https://data.gov.au/data/dataset/australian-petroleum-statistics) | Department of Climate Change, Energy, the Environment and Water; monthly XLSX | Workbook sheet `Stock volume by product`, including `Automotive gasoline (ML)` and `Diesel oil (ML)` | National/product aggregate stocks; the reviewed package was May 2026 and data.gov.au metadata was updated 2026-07-15 | Downloadable XLSX; monthly publication | CC BY 3.0 Australia in data.gov.au package metadata | Stocks held are not tank capacity, working capacity or spare capacity. No terminal identity is present in the relevant series. | `inventory_context`; retain only in its existing stock role |
| [Minimum Stockholding Obligation statistics](https://www.dcceew.gov.au/energy/security/australias-fuel-security/minimum-stockholding-obligation/statistics) and [measures explanation](https://www.dcceew.gov.au/energy/security/australias-fuel-security/measures-of-liquid-fuel-stocks) | DCCEEW; weekly viewer and quarterly/annual download | National aggregate gasoline, kerosene and diesel stocks in ML and days-equivalent | Regulated-industry aggregate; weekly and quarterly reporting | Public viewer and downloadable statistics | DCCEEW site content is generally [CC BY 4.0](https://www.dcceew.gov.au/about/copyright), subject to identified third-party material | Public reporting combines entities and products where required for commercial sensitivity. Stock held under the MSO is not installed, working, available or spare terminal capacity. | `inventory_context`; not capacity |
| [Boosting Australia's Diesel Storage Program announcement](https://www.minister.industry.gov.au/ministers/taylor/media-releases/expanding-australias-diesel-storage-boost-long-term-fuel-security) and [current grant recipients](https://business.gov.au/grants-and-programs/boosting-australias-diesel-storage-program/grant-recipients) | Australian Government; ministerial announcement and grant-recipient register | 2021 announcement: 10 location-level projects totalling 779 ML. The current recipient page lists eight grant rows and no storage-capacity column; Stolthaven is absent. Matching the remaining named grants back to the 2021 announcement yields 653 ML, but that is a cross-source reconciliation, not a current-page field | Named diesel storage projects in selected states; program commitments rather than a national terminal register | Human-readable pages; ad hoc program updates | business.gov.au content is generally [CC BY 3.0 Australia](https://business.gov.au/legal-notices/copyright), subject to exclusions | Grant capacity is incremental project scope, not total site capacity. Award, construction and operation are different states. [DCCEEW's fuel-security page](https://www.dcceew.gov.au/energy/security/australias-fuel-security) says the first program tanks were completed in 2023 but does not provide a project-by-project completion register. | `grant_or_announcement`; do not sum into national terminal capacity |
| [2019 Interim Liquid Fuel Security Review](https://www.dcceew.gov.au/sites/default/files/documents/liquid-fuel-security-review-interim-report.pdf) | Australian Government; policy review PDF | Aggregate storage-capacity changes and contextual analysis; underlying terminal work attributed to Hale & Twomey is not published as a terminal-value table | Historical national/market context, principally through 2018 | Static PDF | DCCEEW site content is generally CC BY 4.0, subject to third-party material | Aggregate changes cannot be disaggregated into current terminal records. Third-party underlying data and definitions are not available for reproducible extraction. | `historical_context`; not an ingestion source |
| [ACCC 2008 petrol report](https://www.accc.gov.au/system/files/ACCC%20Petrol%20Report%202008.pdf) and [Viva Energy/OTR public competition assessment](https://www.accc.gov.au/system/files/public-registers/documents/Viva%20Energy%20-%20OTR%20Group%20-%20Public%20Competition%20Assessment_1.pdf) | Australian Competition and Consumer Commission; market reports | Historical ownership, access, throughput and selected infrastructure context; later assessment identifies relevant current market assets | Selected terminals and market participants; not a current national capacity register | Static PDFs; event-driven | ACCC material is generally [CC BY 4.0](https://www.accc.gov.au/about-us/using-our-website/disclaimer-and-copyright), subject to exclusions | The 2008 report notes that terminal capacity is difficult to measure and compare. Neither document supplies a current, nationally complete, consistently defined table. | `historical_context`; identity cross-check only |
| [WA works approval W6176/2018/1](https://www.der.wa.gov.au/images/documents/our-work/licences-and-works-approvals/Decisions_/W6176-2018-1d.pdf) | WA environmental regulator; works-approval decision PDF | Approved design capacity of 220,140 m3 and specified diesel tanks | One WA proposal and approval period | Static PDF; approval-event cadence | Item-level redistribution terms were not established in this review | Approval maximum does not prove as-built, commissioned, operable or current capacity. Product definitions and capacity concepts vary between approvals. | `planning_or_approval`; not current capacity |
| [Port Kembla terminal planning consent](https://majorprojects.planningportal.nsw.gov.au/prweb/PRRestService/mp/01/getContent?AttachRef=SSD-7264-MOD-1%2120190228T015749.251+GMT) | NSW planning system; consent document | Approval for up to 288 ML across 23 tanks | One NSW development and consent period | Direct PDF-like document route; approval-event cadence | Item-level redistribution terms were not established in this review | A consent envelope is not evidence that every tank was built, commissioned, remains operational or has available capacity. | `planning_or_approval`; not current capacity |
| [Lytton diesel terminal commissioning statement](https://statements.qld.gov.au/statements/98192) | Queensland Government; media statement | 110 ML diesel storage terminal commissioned in July 2023 | One Queensland facility and one product; dated commissioning claim | Human-readable statement; event-driven | Government page; item-level data-redistribution assessment was not completed | Strong site-specific evidence for the stated event, but not a maintained national register and not proof of current available capacity. | `site_specific_official`; insufficient national coverage |
| [Fremantle Ports 2023 annual report](https://www.fremantleports.com.au/docs/default-source/annual-reports/2023-annual-report.pdf?sfvrsn=993ef35b_2) | Fremantle Ports; annual report PDF | Impala Kwinana storage facility described as 225 million litres, with first shipment in September 2022 | One WA facility; broad fuel scope; 2022-23 reporting context | Static annual report | Item-level reuse terms were not explicit in the reviewed report | Site-specific narrative does not establish a national schema, current usable capacity or consistent product allocation. | `site_specific_official`; insufficient coverage |
| [Stolthaven Newcastle terminal page](https://www.stolt-nielsen.com/our-businesses/stolthaven-terminals/terminal-network/stolthaven-newcastle/) | Commercial operator; site page | Nine tanks and 130,700 m3; petroleum-product service description | One operator's Newcastle facility; current page observation only | Human-readable commercial page; cadence not stated | Copyrighted commercial content; no open data licence identified | Operator marketing is not an independently governed national dataset. Capacity type, availability and comparable product allocation are not supplied. | `operator_claim`; unsuitable for repository aggregation |
| [National Freight Data Hub fuel commodity report](https://www.freightaustralia.gov.au/sites/default/files/documents/commodity-report--fuel.pdf) | Australian Government freight program; report PDF | Fuel-flow, import, distribution and supply-chain context | National freight context; report period only | Static PDF | Government publication with identified third-party analysis and non-reliance qualifications | No Australian terminal-capacity table. Context cannot be transformed into terminal capacity. | `historical_context`; not capacity |

## Why a composite dataset is unsafe

Joining the location layer to approvals, grant announcements, annual reports and operator pages would create a second, manually curated terminal registry with no common capacity definition or update contract. It would also mix:

- approved maxima with constructed capacity;
- incremental grant capacity with total site capacity;
- nameplate capacity with working or available capacity;
- diesel-only tanks with broadly described liquid-fuel storage;
- dated commissioning claims with undated operator pages; and
- open government data with content that lacks a clear redistribution licence.

Record linkage would itself require judgment about names, ownership changes, co-located facilities and duplicate projects. The resulting totals would look precise while being conceptually non-comparable. This repository will not publish that composite.

## Fail-closed repository behavior

While Gate B applies:

- keep `data/manual/fuel_security_terminal_capacity.json` unavailable;
- keep `values` empty and do not add a fallback count or capacity;
- do not treat GA location records as terminal-capacity records;
- do not add a terminal-capacity dashboard, map or national total;
- retain APS and MSO only as clearly labelled aggregate stock context;
- do not change source mode, evidence status, unit, cadence or freshness to make the gap appear solved; and
- keep the missing-data explanation explicit that unavailable is not zero.

This Phase 5A decision intentionally makes no data, registry, envelope, script or UI change.

## Re-review triggers

Re-run this gate when at least one of the following occurs:

1. Geoscience Australia or another accountable public publisher adds capacity value, unit, concept, product scope and effective-date fields to a maintained facility layer.
2. DCCEEW publishes a terminal-level capacity register or a reusable project-completion register with current operating status.
3. A state or national regulator publishes a stable, consistently defined cross-jurisdiction dataset with explicit reuse rights.
4. The 78-versus-79 GA record discrepancy is explained and a terminal-location use case is proposed separately from capacity.
5. A source's licence or machine-access terms materially change.

An access-blocked endpoint alone is not a trigger to mark the data unavailable or available. The source must still pass the evidence gate.

## Issue #35 disposition

Issue #35 should remain open while the Phase 5A pull request is unmerged. After this source-gate and audit record merge, closing the research issue as **completed** is appropriate because the issue's second success condition - explicit blocker evidence - has been met. It should not be closed as “not planned,” and the unavailable source envelope must remain open to future evidence-driven re-review.

## Claims not independently verified

This review cannot prove that no unpublished, paid, regulator-only or operator-confidential capacity dataset exists. It also cannot verify:

- current total, working, available, spare or product-specific Australian terminal capacity;
- current operation of every GA-listed facility;
- why the GA live layer and downloadable product counts differ;
- project-by-project completion of the diesel-storage grants;
- a common capacity definition across planning approvals and operator claims; or
- item-level reuse rights for every state, port and commercial document reviewed.

Those unknowns are reasons to remain at Gate B, not reasons to fill the gap.
