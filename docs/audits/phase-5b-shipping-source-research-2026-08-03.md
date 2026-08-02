# Phase 5B Shipping and Vessel Source Research

**Project:** Fuel Resilience AU

**Repository:** `WowCorey/fuel-fertilizer-dashboard`

**Review date:** 2026-08-03 AEST

**Source access date:** 2026-08-03

**Branch:** `phase-5b-shipping-data-gate`

**Base:** `origin/main` at `d4802573d881dbb49b0f4d0d71a5dbb8d18851e7`

## Executive result

The Phase 5B decision is:

**C — useful sources exist, but redistribution or commercial terms block
public deployment.**

No reviewed path supplies the combination required for a public national live
fuel-shipping layer:

- vessel identity and stable IMO/MMSI;
- current position with declared latency and Australian coverage;
- reusable ETA/destination/port-call evidence;
- defensible cargo, product and quantity evidence;
- rights to automate, retain and republish the records.

The repository must keep vessel-level coverage unavailable. Existing
PM&C/DCCEEW aggregate tanker evidence remains the maximum defensible current
shipping claim.

No data values, vessel records, UI, map or envelope were added in this phase.

---

## 1. Issue and repository state verified

[GitHub issue #36](https://github.com/WowCorey/fuel-fertilizer-dashboard/issues/36),
`research(data): define vessel/shipping live-data gate for fuel security`, was
open with no comments when inspected on 2026-08-03.

Its current blocker correctly records that the dashboard has no live vessel
identities, AIS tracks, ETAs, cargo assignments or port-call schedules. Its
success condition is a written gate and source decision: either a defensible
integration path, or an explicit blocked result. The issue excludes fake maps,
unlicensed AIS scraping, cargo inference shown as fact and UI that implies live
coverage.

Repository evidence independently confirmed:

- `data/manual/fuel_security_live_vessel_tracking.json` is an unavailable
  placeholder, not a feed;
- `data/manual/pmc_tankers_on_water.json` contains official aggregate tanker
  groups, not vessel records;
- `docs/fuel-security-source-investigation.md` classifies shipping visibility
  as partial and excludes vessel identity, AIS, ETA and shipment cargo;
- `docs/remaining-data-gaps.md` prohibits inference from AIS or port calls;
- the repository does not load or redistribute Kpler data directly.

The source gate therefore began from an honest unavailable state. It did not
need a value correction.

---

## 2. Research method

The review preferred first-party publisher pages, technical documentation,
licence/terms pages and official data catalogues. Search-result summaries were
not used as evidence when an underlying source could be opened.

For each candidate, the review recorded:

- identity, IMO/MMSI and vessel type;
- position and track;
- arrival, departure, destination, ETA, route and port call;
- cargo, product and quantity;
- geographic and vessel-class coverage;
- update cadence and latency;
- API/authentication/limits and historical access;
- retention, public-display, redistribution and commercial-use rights;
- whether a field is observed, reported, scheduled, estimated, inferred or
  unavailable.

A visible public web page was not treated as a licence. A failed or
authenticated request was recorded as an access condition, not proof that the
underlying dataset is unavailable.

The resulting durable policy is
`docs/shipping-live-data-source-gate.md`.

---

## 3. Official Australian evidence reviewed

### AMSA national vessel traffic

Sources:

- [AMSA Spatial digital data](https://www.operations.amsa.gov.au/spatial/DataServices/DigitalData)
- [AMSA vessel-track disclosure and dissemination policy](https://www.amsa.gov.au/safety-navigation/spatial-data/vessel-track-data-disclosure-and-dissemination-policy)
- [AMSA Spatial copyright](https://www.operations.amsa.gov.au/spatial/DataServices/Copyright)
- [AMSA AIS carriage requirements](https://www.amsa.gov.au/safety-navigation/navigation-systems/requirements-carrying-automatic-identification-system)
- [AMSA AIS overview](https://www.amsa.gov.au/safety-navigation/navigation-systems/about-automatic-identification-system)

Findings:

- AMSA publishes monthly historical vessel-traffic files, not a general-public
  live national feed.
- The public policy permits historic public release subject to sanitisation of
  commercially valuable content and an accuracy/suitability disclaimer.
- Ongoing or near-real-time release is constrained to specified purposes and
  recipients; research access is described as subject to negotiated written
  agreements.
- AMSA's published historic metadata records removal of vessel identifiers and
  thinning of position observations. These files cannot be joined to a fuel
  cargo or vessel identity.
- Spatial@AMSA material is generally CC BY-NC 3.0 AU, excluding third-party
  material and named exclusions. That licence does not create rights to an
  unreleased or third-party live AIS feed.
- AIS carriage rules do not establish complete coverage: a vessel may switch
  AIS off where the master considers continued operation a safety or security
  risk.

Decision: suitable only for static, anonymised historical context.

### Australian identity registers

Sources:

- [AMSA list of registered ships](https://www.amsa.gov.au/vessels-operators/ship-registration/list-registered-ships)
- [AMSA Australian MMSI search](https://www.operations.amsa.gov.au/mmsisearch/)
- [AMSA copyright](https://www.amsa.gov.au/copyright)

Findings:

- The ship register provides official Australian-registered identity fields,
  including name and IMO where applicable.
- The MMSI search covers Australian MMSIs and is an interactive lookup; no
  documented bulk API was located.
- Foreign tankers supplying Australia need not appear in either Australian-only
  scope.

Decision: supporting identity verification only; not a national movement feed.

### Commonwealth aggregate and completed-voyage sources

Sources:

- [Australian Government Fuel Plan statistics](https://fuelplan.gov.au/fuel-statistics)
- [BITRE maritime statistics](https://www.bitre.gov.au/maritime)
- [Australian Sea Freight 2023–24](https://www.bitre.gov.au/resource/maritime/australian-sea-freight-2023-24)
- [ABS international merchandise trade catalogue record](https://catalogue.data.infrastructure.gov.au/dataset/abs-data-for-international-merchandise-trade)
- [Commonwealth coastal voyage reports](https://www.infrastructure.gov.au/infrastructure-transport-vehicles/maritime/business/coastal_trading/licencing/voyage_reports)
- [Coastal trading FAQ](https://www.infrastructure.gov.au/infrastructure-transport-vehicles/maritime/maritime-business/coastal-trading/faq)
- [Infrastructure department copyright](https://www.infrastructure.gov.au/copyright)

Findings:

- Fuel Plan exposes official aggregate ships-on-water counts and equivalent
  days. It states that DCCEEW estimates the counts using Kpler, but does not
  publish or license the underlying vessel records.
- BITRE and ABS sources are aggregate and historical. They do not link a
  commodity record to a current vessel position or ETA.
- Completed coastal voyage reports can contain vessel, actual load date, cargo
  kind/volume and load/discharge ports. They are submitted after covered
  temporary-licence voyages and published about twice monthly.
- Coastal reports cover a narrow completed domestic-voyage process, not all
  international inbound fuel imports. The exact item did not identify a clear
  reuse licence on the accessed page, so public redistribution remains
  unverified despite its official provenance.

Decision: Fuel Plan remains production-suitable for aggregate context. The
other sources are historical/aggregate or supporting evidence, not a live
vessel layer.

---

## 4. Port-authority and state evidence reviewed

### Port Authority NSW

Sources:

- [API help](https://webservices.portauthoritynsw.com.au/Help)
- [VesselArrivals schema](https://webservices.portauthoritynsw.com.au/Help/Api/GET-api-VesselArrivals)
- [VesselArrivalsAMSA schema](https://webservices.portauthoritynsw.com.au/Help/Api/GET-api-VesselArrivalsAMSA)
- [VesselMovementsTFNSW schema](https://webservices.portauthoritynsw.com.au/Help/Api/GET-api-VesselMovementsTFNSW)

The schemas describe useful official fields: vessel ID, IMO, name/type, port,
berth, origin/destination and expected/actual movements. The TFNSW schema also
describes coordinates and update time.

Direct requests to the three documented data paths returned HTTP `401` on
2026-08-03. No public credential path, quota or explicit redistribution licence
was located. This is an authenticated-access result, not evidence that the
dataset or vessels are unavailable.

Decision: potentially useful NSW evidence, presently inaccessible and
rights-unverified.

### Other port systems

Sources:

- [Port of Brisbane shipping schedule](https://www.portbris.com.au/operations-and-trade/shipping-schedule)
- [Queensland QSHIPS](https://qships.tmr.qld.gov.au/webx/)
- [Ports Victoria ship movements](https://ports.vic.gov.au/marine-operations/ship-movements/)
- [TasPorts shipping schedule](https://www.tasports.com.au/shipping-schedule-all)
- [TasPorts PortMate terms](https://tasports.com.au/volumes/documents/Terms-Conditions/PortMate-portal-Terms-of-Use-August-2020.pdf)
- [Darwin Port harbour control](https://www.darwinport.com.au/port-operations/harbour-control)
- [Darwin Port movements](https://portinfo.darwinport.com.au/)
- [Flinders Ports PortMIS catalogue record](https://catalogue.data.infrastructure.gov.au/dataset/shipping-information-centre-portmis-flinders-ports)

Findings:

- These official sources can expose local expected, actual or current port
  movements.
- No reviewed page established a common public API and explicit right to
  automate and redistribute all records.
- Flinders' catalogue entry labels access as open but records the licence as
  `not specified`; this is not an explicit reuse grant.
- A vessel/tanker type shown by a port source does not identify the cargo.
- Local schedules have different definitions and do not combine into complete
  national coverage.

Decision: supporting local schedule evidence only. It is not a source-safe
national layer.

---

## 5. Commercial AIS evidence reviewed

### Kpler / MarineTraffic

Sources:

- [Maritime API documentation](https://servicedocs-sm.kpler.com/maritime-2-0/)
- [Combined AIS data fields](https://servicedocs-sm.kpler.com/combined-data-extracts/)
- [AIS fundamentals](https://servicedocs-sm.kpler.com/ais-fundamentals/)
- [Kpler terms of use](https://www.kpler.com/company/terms-of-use)

The technical product can provide identity, IMO/MMSI, position, reported
destination and ETA, port events and predicted route. Its documentation also
records important limits:

- AIS ETA and destination are entered aboard rather than independently
  observed;
- satellite AIS may be delayed or arrive in bursts and out of order;
- bad positions and spoofing are possible;
- Class B messages may omit voyage fields;
- AIS `ship_and_cargo_type` is a code, not a cargo manifest.

The standard terms prohibit copying, publishing, forwarding or external/public
dissemination without express permission. The review had no licensed account
with which to verify proprietary cargo fields, their methodology, coverage or
contract-specific rights.

Decision: technically capable but redistribution-restricted.

### VesselFinder and ORBCOMM

Sources:

- [VesselFinder API](https://api.vesselfinder.com/docs/)
- [VesselFinder AIS response definition](https://api.vesselfinder.com/docs/response-ais.html)
- [VesselFinder terms](https://www.vesselfinder.com/terms)
- [ORBCOMM data-service terms](https://www.orbcomm.com/terms-and-conditions-doc/data-service-terms-and-conditions)
- [ORBCOMM AIS overview](https://www.orbcomm.com/PDF/brochures/ais-advantage.pdf)

VesselFinder exposes paid identity, position, AIS ETA/destination and
port/route products. ORBCOMM markets satellite and terrestrial AIS services.
Their standard terms do not establish this repository's right to publish the
data; service/order-specific authorization would be required. Neither a
vessel's design capacity nor tanker class establishes cargo aboard.

Decision: technically capable but redistribution-restricted.

---

## 6. Open and noncommercial AIS evidence reviewed

Sources:

- [AISStream documentation](https://aisstream.io/documentation.html)
- [AISStream coverage](https://aisstream.io/coverage)
- [AISStream privacy](https://aisstream.io/privacypolicy)
- [AISHub API](https://www.aishub.net/api)
- [AISHub participation requirements](https://www.aishub.net/join-us)
- [AISHub coverage](https://www.aishub.net/coverage)
- [Global Fishing Watch APIs](https://globalfishingwatch.org/our-apis/documentation)
- [Global Fishing Watch AIS vessel-presence dataset](https://globalfishingwatch.org/platform-update/global-ais-vessel-presence-dataset/)
- [NOAA MarineCadastre AIS FAQ](https://coast.noaa.gov/data/marinecadastre/ais/faq.pdf)
- [NOAA MarineCadastre viewer](https://coast.noaa.gov/digitalcoast/tools/mmc.html)

Findings:

- AISStream is a beta WebSocket service without a located data-redistribution
  licence or SLA. Its published coverage is receiver-dependent and largely
  terrestrial/coastal.
- AISHub access requires contributing a qualifying AIS feed. No explicit right
  to republish the aggregated feed was located; coverage is contributor-based.
- Global Fishing Watch provides noncommercial, attributed access, but its
  vessel-presence product is reduced and delayed by approximately 96 hours.
  Its port visits are algorithmically inferred, and it supplies no fuel cargo.
- NOAA MarineCadastre offers reusable historical AIS, but for the United States
  and territories rather than Australia.

Decision: useful for research or delayed historical context in limited cases,
but no production-safe Australian live fuel layer.

---

## 7. Field-level result

| Field | Best evidence located | Public Phase 5B result |
|---|---|---|
| Vessel identity | Australian official registers; commercial/global AIS for wider coverage | Partial official identity only; national live identity remains unavailable |
| IMO/MMSI | AMSA Australian-only lookup/register, IMO GISIS manual lookup, restricted/commercial feeds | No verified reusable bulk national path |
| Vessel type | Registry/AIS/port-reported | May identify vessel class only; never cargo |
| Position | Historic sanitised AMSA; commercial live AIS; incomplete open feeds | No rights-safe live national public path |
| Track | Ordered AIS positions from licensed/commercial feeds | No rights-safe live national public path; no reconstructed route claim |
| Destination | AIS or operator/agent reported | Reported only; no final-delivery proof |
| ETA | AIS-reported, port-scheduled or provider-estimated | Evidence type must be explicit; no authoritative national reusable path |
| Arrival/departure/port call | Local official schedule/actual systems; inferred open-data visits | Fragmented and rights-unclear; future and inferred calls remain distinct |
| Route | Provider prediction or project reconstruction | Estimated/inferred; no public live route layer |
| Cargo/product/quantity | Narrow completed coastal report or proprietary provider product | No complete, current, rights-safe inbound fuel-cargo path |

The detailed source and field matrices, display vocabulary, confidence rules,
failure semantics and prohibited claims are in the primary gate document.

---

## 8. Hostile-review findings

1. **Aggregate Kpler-derived publication is not a Kpler licence.** Fuel Plan's
   aggregate counts cannot be reverse-engineered or used to claim access to
   vessel records.
2. **AIS voyage fields are not all observations.** Destination and ETA are
   reported; provider routes may be estimated; port visits may be inferred.
3. **Tanker is not cargo.** Vessel type, AIS ship/type code, draught, route,
   destination, berth, terminal, deadweight and design capacity do not prove
   product or quantity.
4. **Public visibility is not redistribution permission.** Port schedule pages
   and web maps require an explicit reuse path before automation/publication.
5. **Local schedules are not national coverage.** Different port systems have
   different fields, states and rights.
6. **Access failure is not absence.** `401`, `403`, `429`, timeout, anti-bot and
   empty portal states must not become zero vessels.
7. **Historic open AIS is not live evidence.** AMSA's monthly sanitised files
   and Global Fishing Watch's delayed presence cannot support live wording.
8. **No weak cargo inference is acceptable.** The previous methodology wording
   was tightened so a visible estimate label cannot legitimise inference from
   weak movement or vessel proxies.

---

## 9. Changes made

- Added `docs/shipping-live-data-source-gate.md` as the durable source,
  evidence, rights, latency, failure, stale/conflict and claim-boundary policy.
- Updated `docs/fuel-security-methodology.md` to prohibit cargo/product/quantity
  inference from vessel type, AIS type code, draught, route, destination,
  terminal, berth, deadweight or design capacity.
- Added this dated research audit.

No source mode, envelope status, numeric value, rights record, cadence, date,
unit or frontend behaviour changed.

---

## 10. Deliberate non-claims and limitations

This review could not independently verify:

- contract-specific public-display rights or pricing for commercial providers;
- proprietary provider cargo-model inputs, methods, accuracy or Australian fuel
  coverage without licensed access;
- Port Authority NSW credential eligibility, quotas or private contract terms;
- public redistribution rights for portal data where the publisher supplied no
  explicit data licence on the accessed page;
- complete receiver/satellite coverage for open AIS networks;
- that every Australian port publishes a public schedule;
- that a transient portal or network failure indicates source unavailability.

No source was rejected merely because it returned an access block or transient
failure. Where rights or definitions were not evidenced, the classification is
unverifiable or unavailable rather than reusable.

---

## 11. Issue recommendation

The written gate and Decision C fulfil issue #36's research success condition.
The issue should receive an evidence-based update linking this audit and the
Phase 5B pull request, remain open while the pull request is unmerged, and be
closed as completed after the gate is reviewed and merged.

If a provider later grants the necessary written public rights and supplies a
documented Australian coverage/cargo path, that should create a separate
implementation issue. It should not silently change this research result.

---

## 12. Validation evidence

The following commands completed successfully locally on 2026-08-03. The
repository validation, unit tests and browser suite were rerun after rebasing
onto current `origin/main` at `d4802573d881dbb49b0f4d0d71a5dbb8d18851e7`.

| Command | Result |
|---|---|
| `npm ci` | Passed; 56 packages installed, 57 audited, zero vulnerabilities |
| `npm audit` | Passed; zero vulnerabilities |
| `npm run check:ui` | Passed; committed UI artifacts current |
| `npm run test:ui-unit` | Passed; 6 tests |
| `python -m py_compile` over all maintained `scripts/*.py` files | Passed; 12 scripts |
| `python scripts/build_source_manifest.py --check` | Passed; source manifest current |
| `python scripts/apply_source_url_governance.py --check` | Passed; governance already applied |
| `python scripts/validate_project.py` | Passed with 17 pre-existing freshness warnings: 13 manual and 4 generated; no blocking errors |
| `python scripts/build_trust_status.py --check` | Passed; trust manifest current |
| `python scripts/validate_trust_status_v2.py` | Passed |
| `python -m unittest discover -s tests` | Passed; 65 tests |
| `npx playwright install chromium` | Passed |
| `npm run smoke:ui` | Passed; 62 Chromium tests |

The expected timeout/error text printed by unit fixtures exercises fail-closed
optional and required source behaviour; the unit suite itself passed.

Network-dependent source checks remain advisory and are not used to turn access
failures into blocking data claims.

---

## Phase 5B conclusion

Useful vessel and shipping sources exist, but none reviewed on 2026-08-03
provides a complete, rights-safe public live fuel-vessel layer. The defensible
repository action is to retain aggregate shipping context and make the
vessel-level gap explicit.

The absence of a new map is the successful result of this gate.
