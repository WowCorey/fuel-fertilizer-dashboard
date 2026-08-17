# Phase 5A Terminal-Capacity Source Research Audit

**Project:** Fuel Resilience AU

**Repository:** `WowCorey/fuel-fertilizer-dashboard`

**Review date:** 2026-08-03 AEST

**Issue:** [#35 - assess public terminal-capacity source options](https://github.com/WowCorey/fuel-fertilizer-dashboard/issues/35)

**Decision record:** [`docs/terminal-capacity-source-gate.md`](../terminal-capacity-source-gate.md)

## Executive result

Phase 5A reached **Gate B**: do not ingest or display terminal-capacity values.

The review corrected one part of the repository's earlier understanding. Geoscience Australia now exposes a current machine-readable Liquid Fuel Facilities service, so the old AURIN retrieval problem is not evidence that terminal locations are inaccessible. The current service nevertheless contains location and facility-description fields only. It contains no terminal-capacity value, capacity unit, capacity concept, product allocation, throughput or inventory.

Official stock series, storage-grant records, planning approvals, port reports and individual operator pages also failed the production-safe capacity gate for different reasons. None can be silently substituted for a current, consistently defined national terminal-capacity dataset.

No values were invented, estimated, interpolated or joined. No source registry, evidence envelope, generated data, script or UI file changed in this phase.

## 1. Repository baseline inspected

The research branch was created from `origin/main` at `163b314dd7e9d0168d6fd07742b0f0472f2de317` and fast-forwarded before publication to current `origin/main` commit `d4802573d881dbb49b0f4d0d71a5dbb8d18851e7`.

The existing repository state was checked directly:

- `data/sources.yml` registers `fuel_security_terminal_capacity` as `fetch: unavailable`.
- `data/manual/fuel_security_terminal_capacity.json` has `status: unavailable`, `unit: ML`, `last_data_point: null` and an empty `values` array.
- The envelope names PM&C MSO reserve volumes and APS stock series as context, not terminal capacity.
- `docs/fuel-security-source-investigation.md`, `docs/fuel-security-methodology.md`, `docs/fuel-security-backlog.md`, `docs/petroleum-ledger-source-gates.md` and `docs/remaining-data-gaps.md` already prohibit fabricating capacity.
- The fuel-security UI says no defensible terminal-by-terminal public capacity dataset is loaded.
- Issue #35 was open with no comments at the start of this review.

The baseline's unavailable result remains correct. Its narrow statement about the 2015 AURIN path needed newer source research, which this audit supplies without altering the unavailable evidence state.

## 2. Research method

Sources were tested against the following questions:

1. Is the publisher accountable and the source directly citable?
2. Does each record identify a terminal and location?
3. Is there an explicit numerical capacity and unit?
4. Is the capacity concept defined: approved, nameplate, working, available or another measure?
5. Is product scope explicit?
6. Is there a source date or capacity-effective date?
7. Is current operating status supported?
8. Is coverage national, or is partial coverage explicitly bounded?
9. Are reuse and redistribution rights clear?
10. Is extraction reproducible without inferred values or uncontrolled joins?

The review covered:

- Commonwealth data catalogues and department pages;
- Geoscience Australia catalogue and ArcGIS REST services;
- APS and MSO stock publications;
- fuel-security program and grant records;
- Commonwealth freight and policy reports;
- ACCC market reports;
- state planning and environmental-approval portals;
- port annual reports and government commissioning statements; and
- a representative operator terminal page.

Every web source cited below was accessed on 2026-08-03 AEST. Network results are observations from that access time, not permanent availability claims.

## 3. Reproducible Geoscience Australia check

The current official feature-layer endpoints reviewed were:

- layer metadata: `https://services.ga.gov.au/gis/rest/services/Liquid_Fuel_Facilities/MapServer/1?f=pjson`
- all non-geometric attributes: `https://services.ga.gov.au/gis/rest/services/Liquid_Fuel_Facilities/MapServer/1/query?where=1%3D1&outFields=*&returnGeometry=false&f=json`

The metadata reported these exact source fields:

```text
objectid
shape
featuretype
description
class
name
operationalstatus
operator
owner
address
suburb
state
spatialconfidence
revised
```

The live query returned 78 records:

| Observation | Count |
|---|---:|
| Operational | 69 |
| Decommissioned | 9 |
| New South Wales | 12 |
| Northern Territory | 4 |
| Queensland | 22 |
| South Australia | 6 |
| Tasmania | 6 |
| Victoria | 12 |
| Western Australia | 16 |

No ACT record was returned. Non-null `revised` values ranged from 2012-06-11 to 2020-08-21. The service description says the database was reviewed and revised in August 2020; the service copyright text is dated 2022 and identifies CC BY 4.0.

These are audit observations about the source, not new repository dashboard values. Record count is not capacity, the operational label is not live availability, and the `revised` field is not a capacity-effective date.

The [Geoscience Australia product package](https://doi.org/10.26186/147636) returned 79 terminal records when its downloadable data was inspected. The one-record difference from the live layer was not explained by the published metadata. This discrepancy reinforces the need for a separate, tested location-data design before using the layer for any future facility inventory. It does not affect the Gate B capacity decision because neither source representation contains capacity.

## 4. Source findings by evidence class

The full field, coverage, rights and decision matrix is in the [source-gate record](../terminal-capacity-source-gate.md#source-decision-matrix). The material findings are summarised here.

### 4.1 Location datasets

Reviewed:

- [GA Liquid Fuel Facilities ArcGIS layer](https://services.ga.gov.au/gis/rest/services/Liquid_Fuel_Facilities/MapServer/1)
- [GA Liquid Fuel Facilities product package](https://doi.org/10.26186/147636)
- [data.gov.au National Liquid Fuel Terminals 2015 catalogue record](https://data.gov.au/data/dataset/au-govt-ga-national-liquid-fuel-terminals-2015-na)

Result: official and reusable location evidence exists. Capacity evidence does not.

The old data.gov.au package's AURIN download-manager URL redirected during review and its recorded gatekeeper hostname did not resolve. That result is classified `access_blocked`. It is not proof that the underlying source is unavailable, particularly because the newer GA service answered machine queries successfully.

### 4.2 Aggregate stocks and obligations

Reviewed:

- [Australian Petroleum Statistics](https://www.energy.gov.au/energy-data/australian-petroleum-statistics)
- [APS data.gov.au package](https://data.gov.au/data/dataset/australian-petroleum-statistics)
- [MSO statistics](https://www.dcceew.gov.au/energy/security/australias-fuel-security/minimum-stockholding-obligation/statistics)
- [DCCEEW measures of liquid fuel stocks](https://www.dcceew.gov.au/energy/security/australias-fuel-security/measures-of-liquid-fuel-stocks)

Result: these sources provide national or product stock evidence, including ML and days-equivalent measures. They do not provide installed terminal capacity or terminal-level records.

Stock is an amount held at a time. Capacity is a physical or operational limit whose definition may itself vary. Dividing, comparing or otherwise transforming the stock figures cannot reveal terminal capacity without additional source fields and a documented method. No such derivation is authorised.

### 4.3 Grants and government program claims

Reviewed:

- [2021 diesel-storage program announcement](https://www.minister.industry.gov.au/ministers/taylor/media-releases/expanding-australias-diesel-storage-boost-long-term-fuel-security)
- [current diesel-storage grant recipients](https://business.gov.au/grants-and-programs/boosting-australias-diesel-storage-program/grant-recipients)
- [DCCEEW fuel-security program overview](https://www.dcceew.gov.au/energy/security/australias-fuel-security)

Result: the 2021 announcement described 10 location-level projects totalling 779 ML of new diesel storage. The current recipient page has eight grant rows and no storage-capacity column; Stolthaven is absent. Matching the remaining named grants to their original announced quantities, including the two Park locations grouped in one current row, yields 653 ML. That number is an audit reconciliation across two pages, not a current register field or current-capacity measure. DCCEEW says the first tanks under the program were completed in 2023 but does not publish a project-by-project completion register.

These values describe incremental grant scope, not each site's total capacity or the national terminal system. Awarded, planned, constructed, commissioned and currently operational are distinct evidence states. The figures therefore cannot be summed with other sources or presented as current terminal capacity.

### 4.4 Policy, freight and competition reports

Reviewed:

- [2019 Interim Liquid Fuel Security Review](https://www.dcceew.gov.au/sites/default/files/documents/liquid-fuel-security-review-interim-report.pdf)
- [National Freight Data Hub fuel commodity report](https://www.freightaustralia.gov.au/sites/default/files/documents/commodity-report--fuel.pdf)
- [ACCC 2008 petrol report](https://www.accc.gov.au/system/files/ACCC%20Petrol%20Report%202008.pdf)
- [ACCC Viva Energy/OTR public competition assessment](https://www.accc.gov.au/system/files/public-registers/documents/Viva%20Energy%20-%20OTR%20Group%20-%20Public%20Competition%20Assessment_1.pdf)

Result: these documents provide historical infrastructure, ownership, access, throughput, flow or aggregate-change context. They do not expose a current national terminal-level capacity table with reusable underlying fields. The 2019 review's underlying Hale & Twomey terminal data is not published as a reproducible record set. The ACCC's earlier analysis also warns that terminal capacity is difficult to measure and compare.

### 4.5 Planning and approval records

Reviewed examples:

- [WA works approval W6176/2018/1](https://www.der.wa.gov.au/images/documents/our-work/licences-and-works-approvals/Decisions_/W6176-2018-1d.pdf): approved design capacity 220,140 m3
- [NSW Port Kembla planning consent](https://majorprojects.planningportal.nsw.gov.au/prweb/PRRestService/mp/01/getContent?AttachRef=SSD-7264-MOD-1%2120190228T015749.251+GMT): up to 288 ML across 23 tanks

Result: these are precise evidence of approval boundaries for named proposals. They are not proof of as-built, commissioned, currently operating, working or available capacity. A national series assembled from approvals would mix planning maxima with other capacity concepts and would have unknown jurisdictional completeness.

### 4.6 Site-specific official and operator statements

Reviewed examples:

- [Queensland Government Lytton statement](https://statements.qld.gov.au/statements/98192): 110 ML diesel terminal commissioned in July 2023
- [Fremantle Ports 2023 annual report](https://www.fremantleports.com.au/docs/default-source/annual-reports/2023-annual-report.pdf?sfvrsn=993ef35b_2): Impala Kwinana facility described as 225 million litres, first shipment September 2022
- [Stolthaven Newcastle operator page](https://www.stolt-nielsen.com/our-businesses/stolthaven-terminals/terminal-network/stolthaven-newcastle/): nine tanks and 130,700 m3

Result: the government and port claims can support only their exact named-site statements at the stated dates. The operator page lacks an open data licence and independent national coverage. None supplies current available capacity or a common national definition. Using selected discoverable sites would create selection bias and falsely imply completeness.

## 5. Hostile substitution tests

| Proposed shortcut | Review result |
|---|---|
| Treat GA terminal count as capacity | Rejected: a count and a volume are different measures |
| Treat GA `operationalstatus` as live availability | Rejected: record revisions end in 2020 and no live status contract is stated |
| Use APS or MSO stocks as capacity | Rejected: inventory held is not a storage limit |
| Add all announced grant ML | Rejected: incremental, proposed and completed states are not equivalent |
| Use planning maxima | Rejected: approval is not construction, commissioning or operation |
| Combine government, port and operator pages | Rejected: incompatible definitions, dates, rights and coverage |
| Infer missing sites from maps or imagery | Rejected: would create unsourced values and identities |
| Declare the old AURIN data unavailable after access failure | Rejected: access failure is not dataset unavailability |
| Publish partial discoveries as a national total | Rejected: coverage denominator and omissions are unknown |

## 6. Rights review

The strongest reusable sources were:

- Geoscience Australia service: CC BY 4.0 stated in layer metadata;
- APS data.gov.au package: CC BY 3.0 Australia;
- DCCEEW pages: generally CC BY 4.0 under the department's [copyright statement](https://www.dcceew.gov.au/about/copyright), subject to exclusions;
- business.gov.au: generally CC BY 3.0 Australia under its [copyright statement](https://business.gov.au/legal-notices/copyright), subject to exclusions; and
- ACCC: generally CC BY 4.0 under its [copyright statement](https://www.accc.gov.au/about-us/using-our-website/disclaimer-and-copyright), subject to exclusions.

Open rights do not cure missing capacity fields or incompatible concepts. Conversely, selected planning, port and operator items did not provide a sufficiently clear item-level redistribution path for building a new public composite. No data from those pages was copied into repository envelopes.

## 7. Repository decision and failure behavior

The existing terminal-capacity source and envelope are left unchanged:

- source mode remains `unavailable`;
- evidence status remains `unavailable`;
- values remain empty;
- no location records are relabelled as capacity;
- no dashboard route or map is added; and
- APS and MSO remain aggregate stock context only.

If a future source fetch fails, the last verified evidence must not be silently replaced. If a future source lacks a required capacity field, coverage boundary, date, unit or right, ingestion must fail closed and retain unavailable status.

No schema proposal is included because there is no source whose actual fields can anchor a defensible capacity schema. Designing a speculative schema now would invite later source data to be coerced into unsupported concepts.

## 8. Issue #35 recommendation

Leave issue #35 open while the Phase 5A pull request is draft or otherwise unmerged. The issue's source-viability success condition is satisfied by either a safe integration path or explicit blocker evidence. This review provides the latter.

After merge, close #35 as **completed**, linking this audit and the source-gate decision. Do not close it as “not planned.” A later qualifying source should trigger a new evidence-reviewed implementation issue or reopen the source decision.

## 9. Limitations and non-claims

This audit does not claim that:

- no private, paid, regulator-only or unpublished terminal-capacity data exists;
- the 78 GA live records are a complete current terminal inventory;
- the 69 GA records labelled operational are all currently operating;
- the 79-record GA download is more or less authoritative than the live layer;
- grant-recipient projects are all complete or incomplete;
- planning approvals equal built capacity;
- site-specific values are mutually comparable;
- stock held reveals capacity or spare capacity; or
- Gate B is permanent.

The following material facts could not be independently verified from a production-safe public dataset:

- current national total terminal capacity;
- terminal-by-terminal current capacity;
- current working, available or spare capacity;
- current capacity by petrol, diesel, jet fuel or other product;
- a complete national terminal denominator;
- the cause of the GA 78-versus-79 record difference; and
- project-by-project BADSP completion and current operation.

## 10. Conclusion

Phase 5A improves the evidence boundary without creating a new data surface. Australia has public terminal-location evidence and several fragments of storage evidence, but the fragments cannot be made into a trustworthy current capacity dataset by arithmetic or manual joining.

The correct repository behavior is to retain the explicit unavailable state and re-open the gate only when an actual source supplies the missing fields, definitions, coverage and rights.
