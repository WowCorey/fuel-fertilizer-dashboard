# Shipping and Vessel Live-Data Source Gate

**Project:** Fuel Resilience AU

**Gate:** Phase 5B vessel and shipping source suitability

**Decision date:** 2026-08-03 AEST

**Source access date:** 2026-08-03

**Decision:** **C — useful sources exist, but redistribution or commercial
terms block public deployment**

## 1. Decision

Fuel Resilience AU must not publish a live or near-live vessel layer from the
sources reviewed in this gate.

Commercial AIS products can technically expose vessel identity, position,
reported destination and ETA, predicted route and port-event data. Their
standard public terms do not give this repository a defensible right to retain
and republish those records. Public Australian sources are instead one or more
of:

- aggregate rather than vessel-level;
- historic and sanitised;
- restricted to one port or jurisdiction;
- available only through an interactive portal or authenticated service;
- missing an explicit licence for automated public redistribution;
- unable to establish petroleum cargo, product or quantity.

The existing `fuel_security_live_vessel_tracking` envelope must therefore stay
`Unavailable`. The dashboard may continue to show the separately sourced
PM&C/DCCEEW aggregate ships-on-water and forward-order evidence. It must not add
a vessel map, placeholder vessels, reconstructed tracks or inferred cargo.

This is a source-gate result, not a claim that vessel data does not exist.

## 2. Scope and public claim boundary

This gate asks whether this independent public-source project can defensibly
publish vessel-level fuel-import evidence. It assesses each field separately:

- vessel identity and type;
- IMO and MMSI identifiers;
- position and track;
- arrival, departure and port call;
- destination, ETA and route;
- cargo, cargo product and cargo quantity.

The gate does not assess private government access, emergency-response systems
or a subscriber's internal use of commercial data. A feed can be technically
capable and still be unsuitable for public deployment here.

Nothing in this document proves:

- that a tanker carries fuel relevant to Australia;
- that its reported destination is its final delivery point;
- that a scheduled call occurred;
- that a draught change represents a known cargo quantity;
- that a terminal or berth identifies the product handled;
- that AIS coverage is complete;
- that a publisher access failure means no vessel or dataset exists.

## 3. Evidence vocabulary

Availability and evidence type are separate. A field can be source-provided yet
still be reported, scheduled or rights-restricted rather than observed and
reusable.

| Wording | Required meaning |
|---|---|
| `Observed` | A timestamped sensor measurement or completed event directly recorded by the named source. A position observation establishes position at that time only. |
| `Reported` | Information supplied by a vessel, master, operator, registry or government reporter. It may change or conflict with another report. |
| `Scheduled` | A future booking, notice or expected movement. It is not evidence that the movement occurred. |
| `Estimated` | A named source's modelled output. The model owner, method or product, generation time and known uncertainty must be disclosed. |
| `Inferred` | A conclusion created from other fields. The inputs, method version, confidence and author must be explicit and structurally separate from observations. |
| `Unavailable` | The field is absent, inaccessible, unlicensed, stale beyond its declared limit, or unresolved after a material conflict. It is `null`, never zero or a fallback estimate. |

For the source matrices below:

| Code | Field-availability classification |
|---|---|
| `OR` | Directly observed or source-reported field with a verified public reuse path. The evidence label still distinguishes observed from reported or scheduled. |
| `RR` | Directly observed or source-reported field exists, but redistribution is restricted or not licensed for this public use. |
| `OA` | Official aggregate only; no vessel-level record is available. |
| `IN` | Inferred or modelled, not direct evidence. |
| `UV` | A field may be visible or advertised, but access, definition, method or rights could not be independently verified. |
| `NA` | Unavailable from the source. |

`OR` does not make a reported ETA an observed fact. The public display label is
controlled by the field rules in the next section.

## 4. Field-level evidence and display rules

### Vessel identity

Minimum evidence:

- source-supplied name plus a stable identifier;
- the identifier's issuing or reporting source;
- the time at which dynamic identity was last received;
- any conflicting identity retained for audit rather than silently replaced.

Display rule:

- a valid IMO matched to an official register is `Reported identity — high
  confidence`;
- an AIS name/MMSI without an authoritative IMO match is `Reported identity —
  medium confidence` at best;
- a name-only match is not sufficient to join records.

### IMO and MMSI

IMO is the preferred immutable ship identifier when the source supplies a valid
number. MMSI is a radio identity and can change. Neither identifier proves
cargo, destination or ownership at a later date.

Display rule: show the identifier, source and last-verified time. Do not invent
one from the other or infer a match from vessel name alone.

### Vessel type

Vessel type is `Reported`. AIS ship/type codes and registry classifications
describe a vessel, not the cargo aboard on a particular voyage.

Display rule: `Reported vessel type`; never shorten `tanker` to `fuel shipment`.

### Position

Minimum evidence:

- source-supplied latitude and longitude;
- observation timestamp and receipt timestamp;
- source and collection mode where available;
- rights permitting public display and the required retention period.

Display rule: `Observed AIS position`, followed by observation time and data
age. A displayed point must not imply continuous coverage.

### Track

A track is an ordered series of observed positions. Lines between points are
rendering aids, not observations. Gaps must remain visible.

Display rule: `Observed AIS positions connected for context`. Never call a
reconstructed line the vessel's planned route.

### Destination

AIS destination is entered aboard the vessel and is `Reported`. A port-system
destination may be operator- or agent-reported. Either can change.

Display rule: `Reported destination`, with source and last-update time. It is
not proof of final delivery or unloading.

### ETA

AIS ETA is `Reported`; a port booking is `Scheduled`; a provider prediction is
`Estimated`. These values must not be merged into one unqualified ETA.

Display rule: show the evidence type, timezone, source and update time. An
expired or conflicting ETA becomes stale or unavailable; it is not silently
recalculated.

### Route

No source in this review provides a publicly reusable, authoritative planned
route for national fuel imports. A provider-predicted route is `Estimated`; a
project reconstruction is `Inferred`.

Display rule: no route layer under the current decision. Existing illustrative
supply lanes must remain explicitly non-live context.

### Arrival, departure and port call

A future port movement is `Scheduled`. A movement recorded as actual by the
responsible port authority is `Reported actual`. An algorithmic port visit is
`Inferred`, even when a provider assigns high confidence.

Display rule: keep scheduled, actual and inferred events separate. A port call
does not prove that petroleum was discharged.

### Cargo, product and quantity

The minimum acceptable evidence is a named cargo report, manifest, government
voyage report or licensed provider field whose definition and provenance are
documented. Quantity also requires an explicit unit, measurement basis and
reporting date.

The following are not cargo evidence, alone or in combination:

- vessel type or AIS `ship_and_cargo_type`;
- design capacity or deadweight;
- draught or a change in draught;
- route, position, destination or ETA;
- port, terminal or berth;
- operator marketing material.

A proprietary provider model must be stored as `provider_inferred`, with the
provider, product, method/version if disclosed, generated time and confidence.
It must never be promoted to observed cargo. If the method or public-display
right cannot be verified, cargo, product and quantity remain unavailable.

## 5. Source requirements

A production source must satisfy every applicable requirement:

1. **Identity:** stable vessel identifiers and documented field definitions.
2. **Provenance:** observation/report time, retrieval time and named publisher.
3. **Coverage:** declared geography, vessel classes, receiver/satellite limits
   and known gaps.
4. **Latency:** a published or contracted maximum latency and observable data
   age; otherwise the feed is `latest reported`, not `live`.
5. **Access:** documented API or deterministic file access, authentication,
   pagination, quotas and schema versioning.
6. **Rights:** written permission for automation, retention, transformation,
   caching, audit storage, public display and redistribution.
7. **Cargo boundary:** cargo/product/quantity source and method separate from
   AIS identity and movement fields.
8. **Failure semantics:** stale/unavailable states and explicit zero semantics.
9. **Validation:** schema, identifier, timestamp, coordinate, unit and conflict
   checks, with fixtures for failures.
10. **Attribution:** source-specific attribution and licence text preserved.

Credentials must remain server-side. A browser map must not contain a token or
directly call a provider endpoint unless the provider explicitly supports that
public pattern.

## 6. Rights gate

Subscription access, a public web map, an API key or technical ability to copy
data is not a reuse licence.

Before integration, written terms must answer:

- May the repository automate collection?
- May raw positions and identity be retained, and for how long?
- May data be transformed and cached in a static GitHub Pages artifact?
- May raw or derived records be displayed to the general public?
- May records be redistributed in this public Git repository?
- Are screenshots, downloads and historical audit copies permitted?
- Are derived tracks, port events or aggregate counts permitted?
- Is noncommercial public use covered?
- What attribution and deletion obligations apply?

An unanswered material right fails closed. A general government copyright page
does not license a third-party AIS component unless that component is expressly
included.

## 7. Latency, failure and stale-data behaviour

### Latency

- `Live` requires a source-defined maximum latency and evidence that ingestion
  meets it.
- `Near-live` requires a declared delay/cadence and visible observation age.
- Data delayed by days is historical or delayed, not near-live.
- Monthly AMSA traffic files are historical.

### Failure

- A network, authentication, quota or schema failure publishes
  `Unavailable` or preserves the last good record as visibly `Stale`.
- HTTP `401`, `403`, `429`, timeout, anti-bot or server error describes access,
  not the existence of a dataset or vessel.
- An empty response can mean zero only when the source contract guarantees
  complete coverage and explicitly defines an empty response as zero matches.
- A failed refresh must not overwrite the last good evidence with an empty
  array.

### Staleness

Expiry must be source-specific and based on the documented cadence or contract.
When an update is missed, retain the last good observation for audit if rights
permit, label it stale and stop making current-position or current-ETA claims.
Do not extrapolate movement.

### Conflicts

- Preserve conflicting source records and their timestamps.
- Prefer a valid official IMO record for immutable identity fields, but retain
  the conflicting AIS report and lower confidence.
- Do not silently choose between incompatible destination or ETA reports.
- A material cargo/product/quantity conflict makes that field unavailable
  unless an authoritative cargo report resolves it.
- Retention or deletion terms override the desire to preserve an audit copy.

## 8. Candidate field matrix

This matrix classifies fields for public deployment under the rights and access
located on 2026-08-03. It does not describe private access a government agency
or a separately licensed customer may hold.

| ID | Source | Identity / IMO / MMSI / type | Position / track | Arrival / departure / ETA / destination / port call / route | Cargo / product / quantity |
|---|---|---|---|---|---|
| A1 | AMSA public monthly vessel traffic | `NA` identifiers; vessel-type use not relied upon | `OR` historic sanitised positions; monthly and thinned | `NA` | `NA` |
| A2 | AMSA Australian ship register and MMSI search | `OR` reported identity, but Australian-registered or Australian-MMSI scope only | `NA` | `NA` | `NA` |
| A3 | Australian Government Fuel Plan | `OA` | `OA` | `OA` tanker groups and equivalent days only | `OA` crude and clean-product group counts, not vessel cargo |
| A4 | BITRE and ABS shipping/trade statistics | `OA` | `NA` | `OA` historical port/voyage aggregates | `OA` historical freight or commodity aggregates |
| A5 | Commonwealth coastal voyage reports | vessel name `UV` for public reuse; stable IMO/MMSI not established by the reviewed report | `NA` | source-reported completed load/discharge ports and dates `UV` for public reuse | source-reported cargo kind and volume `UV` for public reuse |
| P1 | Port Authority NSW web-service schemas | `UV` because data endpoints require authorization | `UV` for the TFNSW schema | `UV` scheduled/actual movement fields; no usable credentials or licence verified | `NA` |
| P2 | Queensland QSHIPS / Port of Brisbane | visible reported identity/type `UV` | `NA` | visible scheduled/actual movements `UV` | `NA` |
| P3 | Ports Victoria | visible reported name/type `UV` | `NA` | visible scheduled/actual movements `UV` | `NA`; tanker marker is not cargo |
| P4 | TasPorts | visible reported name/type `UV` | `NA` | visible scheduled/actual movements `UV` | `NA` |
| P5 | Darwin Port | visible reported identity `UV` | `NA` | visible scheduled/actual movements `UV` | `NA` |
| P6 | Flinders Ports PortMIS | visible reported identity `UV` | `NA` | visible scheduled/actual movements `UV` | `NA` |
| I1 | IMO GISIS | reported identity/IMO `UV` for bulk reuse | `NA` | `NA` | `NA` |
| I2 | Equasis | reported identity/IMO `RR` | `NA` | limited historical fields `RR` | `NA` |
| C1 | Kpler / MarineTraffic | `RR` reported identity/IMO/MMSI/type | `RR` observed AIS positions and provider track products | `RR` reported ETA/destination, provider port events and estimated route | provider cargo products `RR`/`UV`; AIS ship/type code is not cargo evidence |
| C2 | VesselFinder | `RR` reported identity/IMO/MMSI/type | `RR` observed AIS positions and track products | `RR` reported ETA/destination and port/route products | `NA` for cargo aboard; vessel design capacity is not quantity aboard |
| C3 | ORBCOMM / S&P Global | `RR` reported identity | `RR` observed AIS positions | product-dependent `RR`/`UV` | `UV` |
| O1 | AISStream | reported identity/IMO/MMSI/type `UV` | observed terrestrial AIS positions `UV` | reported AIS ETA/destination `UV`; route/official call `NA` | `NA` |
| O2 | AISHub | reported identity/IMO/MMSI/type `UV` | observed contributor-network AIS positions `UV` | reported AIS ETA/destination `UV` | `NA` |
| O3 | Global Fishing Watch | reported identity `OR` under noncommercial terms | delayed/thinned observed AIS presence `OR` | inferred port visits `IN`; no authoritative ETA/route | `NA` |
| O4 | NOAA MarineCadastre AIS | `OR` for its dataset | historical positions `OR` | historical/inferred use only | `NA` |

NOAA MarineCadastre covers the United States and its territories, not
Australia, so its reusable status does not make it geographically suitable.

## 9. Access, latency, coverage and rights matrix

`Not verified` means the reviewed first-party material did not establish the
fact. It does not mean the provider cannot offer it under a separate agreement.

| ID | API/access and historical access | Latency and geography | Redistribution, retention, commercial use and limits | Confidence in assessment |
|---|---|---|---|---|
| A1 | Monthly static downloads and metadata; historic files available | Monthly/historical; Australian Search and Rescue Region, with named subareas | Spatial material generally CC BY-NC 3.0 AU subject to third-party exclusions; noncommercial public reuse with attribution, no live-data grant | High for public historic release; live access unavailable to verify |
| A2 | Downloadable Australian ship register; interactive MMSI lookup; no bulk MMSI API located | Register update cadence; Australian registration/MMSI scope only | AMSA general copyright is generally CC BY 4.0 subject to exclusions; separate bulk MMSI retention/API terms not verified | High for register scope; medium for MMSI reuse |
| A3 | Public web table; no stable vessel API or underlying records | Weekly aggregate Australian snapshot | Public aggregate may be cited under its publisher terms; no right to retain or redistribute underlying Kpler vessel data; API limits not applicable | High |
| A4 | BITRE/ABS files and tables; historical series available | Monthly ABS with publication lag; annual BITRE; Australian aggregate | Rights are item-specific; ABS catalogue marks the trade dataset open. Proprietary inputs in some BITRE products require table-level checking | High for aggregate scope |
| A5 | Public completed-voyage reports/files; no live API located | Submitted after voyage completion and published about twice monthly; covered Australian coastal-trading voyages only | Exact report licence, automated reuse, retention and commercial redistribution not verified | High for field/scope finding; low for reuse right |
| P1 | Documented web-service schemas; actual endpoints returned `401`; historical depth and quotas not verified | NSW ports; schedule/update latency is endpoint-dependent and inaccessible | Authentication, retention, external display, redistribution, commercial use and API limits not verified | High for schemas and `401`; low for deployability |
| P2 | Guest interactive QSHIPS portal; no public API/history contract located | Queensland port movements; current/forecast, local coverage | Explicit data licence, retention, commercial reuse and request limits not verified | Medium |
| P3 | Public HTML movement table; no API/history contract located | Victoria; page states hourly updates | Explicit bulk redistribution, retention and commercial-use rights not verified | High for visible fields/cadence; low for reuse right |
| P4 | Public schedule UI and account portal; no public API/history contract located | Tasmania; local schedule cadence not contractually stated | No public redistribution grant located; account terms are not a public-data licence | Medium |
| P5 | Public movement portal; no API/history contract located | Darwin only; current schedule, with no verified latency guarantee | Redistribution, retention, commercial use and limits not verified | Medium |
| P6 | HTML PortMIS linked from an official catalogue; no public API/history contract located | South Australian ports; current/expected/actual movements | Catalogue says open access but licence is `not specified`; retention and commercial reuse not verified | High for catalogue metadata; low for reuse right |
| I1 | Interactive GISIS lookup; bulk API/history extraction not verified | Global official identity records; update cadence not verified for this use | Bulk retention, redistribution, commercial use and limits not established by the public disclaimer | Medium |
| I2 | Registered-user interactive service | Global identity/safety history | Terms restrict automated/bulk extraction, storage/transmission and third-party supply; unsuitable for repository redistribution | High |
| C1 | Bearer-token APIs and extracts; history/quotas depend on purchased product | Global terrestrial/satellite AIS; terrestrial can be immediate, satellite delayed/bursty; terms warn positions may be delayed/incomplete | Contract/product controls retention and limits; standard terms bar external publication/redistribution without express permission | High for documented technical/rights boundary; proprietary cargo accuracy unverified |
| C2 | Paid API key; history, polling limits and display rights depend on plan | Marketed global real-time coverage, but no completeness guarantee adopted by this gate | Standard access does not establish repository redistribution; retention and public display require plan-specific authorization | High for field definitions; medium for plan-specific rights |
| C3 | API/service only when ordered; history and limits are order-specific | Global satellite/terrestrial coverage; product-specific latency | Standard terms constrain retention and bar resale, sublicensing or publication outside authorised use | High for standard rights boundary; product details unverified |
| O1 | API-key WebSocket; current stream, no verified historical archive; documentation limits filters and stream use | Beta/no SLA; receiver-dependent terrestrial coverage, including coastal gaps/offshore limits | No explicit data licence, retention permission or public redistribution/commercial-use grant located | High for documented access/coverage; low for rights |
| O2 | Contributor API; access requires a qualifying operational AIS feed; no verified historical archive | Approximately minute-level output; contributor/terrestrial coverage | No explicit public redistribution, retention or commercial-use grant located | High for participation rule; low for rights/completeness |
| O3 | Token API and downloadable/API products; delayed history | Global; vessel-presence data is reduced to about hourly points and delayed about 96 hours | Noncommercial CC BY-NC 4.0 with attribution; documented API limits apply; not live and port visits are inferred | High |
| O4 | Historical downloadable US AIS datasets/tools | Annual/historical; United States and territories | Public/reusable US government data; no Australian coverage | High |

## 10. Source decision matrix

### National and Commonwealth sources

| ID | Publisher and source | Time/geography/access | Rights and evidence risk | Integration decision |
|---|---|---|---|---|
| A1 | [AMSA Spatial digital data](https://www.operations.amsa.gov.au/spatial/DataServices/DigitalData), [vessel-track disclosure policy](https://www.amsa.gov.au/safety-navigation/spatial-data/vessel-track-data-disclosure-and-dissemination-policy), [Spatial copyright](https://www.operations.amsa.gov.au/spatial/DataServices/Copyright) | Monthly historical traffic within the Australian Search and Rescue Region; downloadable files | Public historic releases are sanitised of commercially valuable content. Published metadata records identifier deletion and position thinning. Spatial material is generally CC BY-NC 3.0 AU, subject to third-party exclusions. | Suitable only for static historical, anonymised context; not a live fuel-vessel layer. |
| A2 | [AMSA registered ships](https://www.amsa.gov.au/vessels-operators/ship-registration/list-registered-ships), [AMSA MMSI search](https://www.operations.amsa.gov.au/mmsisearch/), [AMSA copyright](https://www.amsa.gov.au/copyright) | Current Australian registers and Australian MMSIs; downloadable register plus interactive MMSI search | Official identity, but partial national relevance because foreign tankers are outside the register/MMSI scope. No bulk MMSI API was located. | Supporting identity verification only. |
| A3 | [Australian Government Fuel Plan statistics](https://fuelplan.gov.au/fuel-statistics) | Weekly Australian aggregate public snapshot | Ships-on-water values are DCCEEW estimates using Kpler. The publication does not convey Kpler vessel records or redistribution rights. | Production-suitable only for the existing aggregate cards. |
| A4 | [BITRE maritime statistics](https://www.bitre.gov.au/maritime), [Australian Sea Freight 2023–24](https://www.bitre.gov.au/resource/maritime/australian-sea-freight-2023-24), [ABS international merchandise trade](https://catalogue.data.infrastructure.gov.au/dataset/abs-data-for-international-merchandise-trade) | Annual BITRE and monthly ABS aggregate statistics; ABS has an approximately three-month publication lag | No vessel-level linkage. Some BITRE tables rely on proprietary source material, so each table's rights must be checked before extraction. | Aggregate historical context only. |
| A5 | [Coastal voyage reports](https://www.infrastructure.gov.au/infrastructure-transport-vehicles/maritime/business/coastal_trading/licencing/voyage_reports), [coastal trading FAQ](https://www.infrastructure.gov.au/infrastructure-transport-vehicles/maritime/maritime-business/coastal-trading/faq), [department copyright](https://www.infrastructure.gov.au/copyright) | Completed temporary-licence voyages; reports are submitted after completion and published about twice monthly | Directly reported cargo kind/volume and load/discharge ports for a narrow domestic scope. It is not an inbound international-import feed. The exact dataset did not identify a clear licence on the accessed page. | Supporting historical source only until exact reuse permission is confirmed. |

AMSA's current public policy permits historic general-public releases but says
they must carry an accuracy/suitability disclaimer and be sanitised of
commercially valuable content. It describes ongoing or near-real-time release
to agencies, providers and research organisations as constrained and, for
research, subject to negotiated written agreements. This is not a general
public live-data licence.

### Port and state movement sources

| ID | Publisher and source | Fields and latency | Access/rights result | Integration decision |
|---|---|---|---|---|
| P1 | [Port Authority NSW API help](https://webservices.portauthoritynsw.com.au/Help), [VesselArrivals schema](https://webservices.portauthoritynsw.com.au/Help/Api/GET-api-VesselArrivals), [VesselArrivalsAMSA schema](https://webservices.portauthoritynsw.com.au/Help/Api/GET-api-VesselArrivalsAMSA), [VesselMovementsTFNSW schema](https://webservices.portauthoritynsw.com.au/Help/Api/GET-api-VesselMovementsTFNSW) | Schemas describe IMO/name/type, port, berth, origin/destination and scheduled/actual movements; TFNSW schema also describes coordinates/update time | Direct requests to the three documented API paths returned `401` on 2026-08-03. Credentials, rate limits and public redistribution terms were not located. | Potentially useful official NSW data, presently inaccessible and rights-unverified. |
| P2 | [Port of Brisbane shipping schedule](https://www.portbris.com.au/operations-and-trade/shipping-schedule), [Queensland QSHIPS](https://qships.tmr.qld.gov.au/webx/) | Actual and forecast Queensland movements in an interactive portal | No documented public API or explicit data-redistribution licence was located. Port schedules can change. | Supporting local schedule only. |
| P3 | [Ports Victoria ship movements](https://ports.vic.gov.au/marine-operations/ship-movements/) | Expected and actual movements, refreshed hourly; name/from/to/agent and tanker-type marker | No explicit bulk reuse permission was located. A tanker marker describes vessel type, not cargo. | Supporting local schedule only. |
| P4 | [TasPorts shipping schedule](https://www.tasports.com.au/shipping-schedule-all), [PortMate terms](https://tasports.com.au/volumes/documents/Terms-Conditions/PortMate-portal-Terms-of-Use-August-2020.pdf) | Port, berth, vessel, type, movement and ETA for Tasmania | No public API or public redistribution right located; account-portal terms do not establish one. | Supporting local schedule only. |
| P5 | [Darwin Port harbour control](https://www.darwinport.com.au/port-operations/harbour-control), [Darwin Port movements](https://portinfo.darwinport.com.au/) | Current Darwin movements/notice context | No documented public API or explicit reuse licence located. A portal error or empty view is not zero traffic. | Supporting local schedule only. |
| P6 | [Flinders Ports PortMIS catalogue record](https://catalogue.data.infrastructure.gov.au/dataset/shipping-information-centre-portmis-flinders-ports) | Expected/actual South Australian schedules and current vessels in port | Catalogue access is described as open, but its licence is `not specified`; the linked service is an HTML portal without a documented public API. | Supporting only until licence and automated access are confirmed. |

These sources are geographically fragmented and do not create national
coverage when combined. Their definitions and event states also differ, so the
project must not silently normalise them into a nationally complete feed.

### Identity services

| ID | Source | Rights/access | Integration decision |
|---|---|---|---|
| I1 | [IMO GISIS public portal](https://gisis.imo.org/public/default.aspx), [GISIS disclaimer](https://gisis.imo.org/public/Shared/Public/Disclaimer.aspx) | Public manual lookup; no documented bulk API or public redistribution licence was verified. | Manual identity verification only. |
| I2 | [Equasis registration terms](https://www.equasis.org/EquasisWeb/public/ConditionsRegistration?fs=About), [Equasis FAQ](https://www.equasis.org/EquasisWeb/Static/MOA/FAQ/faq.html) | Terms restrict information to internal use and prohibit third-party supply, automated/bulk use and transmission. | Rights-restricted; do not copy into public envelopes. |

### Commercial AIS providers

| ID | Provider and source | Capability and quality | Rights result | Integration decision |
|---|---|---|---|---|
| C1 | [Kpler / MarineTraffic API](https://servicedocs-sm.kpler.com/maritime-2-0/), [combined AIS fields](https://servicedocs-sm.kpler.com/combined-data-extracts/), [AIS fundamentals](https://servicedocs-sm.kpler.com/ais-fundamentals/), [Kpler terms](https://www.kpler.com/company/terms-of-use) | Identity, position, reported destination/ETA, port events and predicted route. Kpler documents terrestrial/satellite delay, out-of-order/error/spoofing risk and that ETA/destination are entered aboard. AIS `ship_and_cargo_type` is not a cargo manifest. | Standard terms prohibit copying, publishing, forwarding and public/external dissemination without express written permission. Product-specific cargo fields and methods could not be independently tested without licensed access. | Technically capable, redistribution-restricted. A bespoke written licence would be required. |
| C2 | [VesselFinder API](https://api.vesselfinder.com/docs/), [AIS response fields](https://api.vesselfinder.com/docs/response-ais.html), [VesselFinder terms](https://www.vesselfinder.com/terms) | Paid position/identity, reported AIS ETA/destination/draught and port/route products | Public display and redistribution require plan-specific authorization; the standard terms do not establish this repository's right to republish. Design capacity is not cargo aboard. | Technically capable, redistribution-restricted. |
| C3 | [ORBCOMM AIS service terms](https://www.orbcomm.com/terms-and-conditions-doc/data-service-terms-and-conditions), [AIS overview](https://www.orbcomm.com/PDF/brochures/ais-advantage.pdf) | Satellite and terrestrial identity/location services; product-specific access | Terms provide API access only when ordered and restrict resale, sublicensing, publication and retention outside authorized internal use. | Technically capable, redistribution-restricted. |

### Open or noncommercial AIS projects

| ID | Project and source | Coverage/latency | Rights and quality | Integration decision |
|---|---|---|---|---|
| O1 | [AISStream documentation](https://aisstream.io/documentation.html), [coverage](https://aisstream.io/coverage), [privacy](https://aisstream.io/privacypolicy) | WebSocket feed; predominantly terrestrial coastal coverage; beta service with no SLA | No explicit data licence or public redistribution permission was located. Coverage is not complete nationally or offshore. | Incomplete and rights-unverified; not production-safe. |
| O2 | [AISHub API](https://www.aishub.net/api), [participation](https://www.aishub.net/join-us), [coverage](https://www.aishub.net/coverage) | Contributor-network terrestrial AIS, generally minute-level; access requires contributing an operational feed | No explicit right to publish or redistribute the aggregated feed was located. Coverage is receiver-dependent. | Incomplete and rights-unverified; not production-safe. |
| O3 | [Global Fishing Watch API documentation](https://globalfishingwatch.org/our-apis/documentation), [AIS vessel-presence dataset](https://globalfishingwatch.org/platform-update/global-ais-vessel-presence-dataset/) | Global delayed AIS presence, reduced to approximately one point per vessel per hour and available only after an approximately 96-hour delay; port visits are algorithmically inferred | Noncommercial CC BY-NC 4.0 access with attribution and API limits. It has no fuel cargo field and is not a live individual-vessel tracking source. | Suitable only for delayed, noncommercial historical context with explicit inference labels. |
| O4 | [NOAA MarineCadastre AIS FAQ](https://coast.noaa.gov/data/marinecadastre/ais/faq.pdf), [MarineCadastre viewer](https://coast.noaa.gov/digitalcoast/tools/mmc.html) | Reusable historical AIS for the United States and territories | Public/reusable, but outside the required Australian geography. | Unsuitable. |

## 11. Identity and cargo confidence

| Field | High confidence | Medium confidence | Low confidence / unavailable |
|---|---|---|---|
| Identity | Valid IMO matched to a current official registry record; source and verification date retained | Consistent source-supplied IMO/MMSI/name across licensed feeds | Name-only match, invalid identifier or unresolved source conflict |
| Position | Licensed source point with observation time, declared collection mode and acceptable age | Licensed point with observation time but incomplete mode/coverage disclosure | Missing/expired time, impossible coordinate, unresolved conflict, unlicensed record |
| Destination/ETA | There is no `observed high-confidence ETA`; strongest form is a current official port booking labelled scheduled | Current vessel-reported AIS value or provider estimate with type disclosed | Expired, conflicting, parsed from free text without provenance, or inaccessible |
| Port call | Port authority records the movement as actual | Current official scheduled call | Algorithmic inference, stale schedule, portal-only record without reuse right |
| Cargo/product/quantity | Named official cargo report or licensed source-provided field with definition, unit, time and voyage identity | Licensed provider-inferred field with method/product and confidence disclosed | Any inference from vessel type, draught, route, destination, terminal, berth or design capacity |

There is deliberately no confidence label that upgrades a weak cargo proxy into
fact. If the high or explicitly provider-inferred standard is not met, the
field is unavailable.

## 12. Prohibited public claims

Under the current decision, the project must not publish or imply:

- `live vessel coverage` or `all inbound tankers`;
- `this tanker is carrying petrol/diesel/jet fuel` based on vessel type or AIS;
- `quantity aboard` based on draught, deadweight or vessel capacity;
- `arriving in Australia` based only on AIS destination text or predicted route;
- `will unload at this terminal` based on a schedule, berth or destination;
- `port call completed` from an algorithmic visit or future booking;
- continuous tracking when receiver/satellite gaps exist;
- zero vessels when a feed is empty, blocked or unavailable;
- a right to republish data merely because it is visible on a public website;
- that PM&C's aggregate Kpler-derived counts grant access to the underlying
  proprietary vessel records.

## 13. Current repository action

Decision C produces no new data envelope or dashboard surface.

- Keep `fuel_security_live_vessel_tracking` unavailable.
- Continue displaying PM&C/DCCEEW aggregate tanker counts and equivalent days
  with partial-coverage wording.
- Keep route graphics explicitly illustrative and non-live.
- Do not add a map, vessel list, cargo inference or fabricated fallback.
- Treat the Phase 5B research gate as satisfying issue #36's research success
  condition once reviewed and merged.

## 14. Conditions that could reopen implementation

A separate implementation proposal may be opened only when evidence includes:

1. a written provider or publisher grant covering public display,
   redistribution, retention, static caching and audit storage;
2. a documented national or explicitly partial Australian coverage statement;
3. contracted latency, API limits and failure semantics;
4. stable IMO/MMSI identity and timestamped positions;
5. a schema that separates observed, reported, scheduled, estimated and
   inferred fields;
6. an authoritative or documented licensed cargo method independent of weak
   vessel/route/berth proxies;
7. source-specific expiry and conflict rules;
8. validator and browser tests proving unavailable and stale states fail
   closed.

Until those conditions are met, aggregate shipping context is the maximum
defensible public claim.
