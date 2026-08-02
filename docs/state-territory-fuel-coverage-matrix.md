# State and Territory Fuel Visibility Coverage Matrix

Last reviewed: 2026-08-03

This matrix records which official public fuel sources can support the
repository's price, availability, disruption, reserve and infrastructure
evidence layers. It is a research and source-governance document, not a data
feed and not evidence that every named source is currently integrated.

The classifications are deliberately narrow:

- **Integrated** means the repository has a source registry entry, a current
  fetch or manual envelope, validation and visible scope notes.
- **Viable but gated** means an official source exposes suitable fields, but
  credentials, approval, contractual reuse terms or operational verification
  still block production use.
- **Manual dated evidence** means an official publication can support an exact
  dated observation but not a current automated feed.
- **Public UI only** means a government-facing interface is visible, but no
  documented reusable API or file was verified.
- **Unavailable** means no defensible public source for the requested concept
  was verified. It does not mean the real-world value is zero.

HTTP `403`, `429`, timeouts, anti-bot pages and other access blocks are access
classifications. They are not proof that the underlying publication or dataset
does not exist.

## Coverage summary

| Jurisdiction | Retail price | Availability / stock-out | Emergency / disruption | Reserve / terminal / port context | Repository evidence state |
|---|---|---|---|---|---|
| NSW | OAuth/API-key current API; open monthly history | Public UI and mandatory retailer reporting, but no availability field in the public read API | Official dated notices and qualitative updates | No comparable public state reserve or terminal-capacity feed verified | QLD/WA values only in current multi-state envelopes; NSW code is credential-gated and now implements the published OAuth contract |
| VIC | Free application-gated, 24-hour-delayed API | `isAvailable` in the same API | Qualitative public updates | Dated 10 ML agricultural diesel reserve announcement; no terminal-capacity feed | Viable but gated; not integrated |
| QLD | Open monthly changes plus approval-gated direct API | `Price = 9999` in open monthly changes and direct feed | No reusable emergency-status feed verified | Project/proposal context only; no current capacity or inventory | Monthly partial availability layer integrated |
| WA | Public FuelWatch RSS | No documented availability field in RSS; public UI is not a reusable feed | Weekly qualitative government update | Exact dated 20 ML state reserve context; daily TGP is price, not capacity | Price RSS and separated quantitative/qualitative evidence integrated |
| SA | Subscriber-token publisher API | `9999` means unavailable in publisher API | Dated government notices and emergency-management context | Exact dated 10 ML diesel reserve at Port Bonython, option to 20 ML | Viable but gated; not integrated |
| TAS | FuelCheck via API NSW v2; public LIST station layer | Public API has no availability field; missing product is ambiguous | Weekly official fuel-supply reports | Weekly reports may describe terminal supply; no capacity feed | Manual dated evidence candidate; no new envelope in Phase 5C |
| ACT | Public FuelCheck interface | Voluntary/opt-in UI coverage; no documented ACT developer API | Qualitative ACT supply page | No public reserve or terminal-capacity feed verified | Public UI only; not integrated |
| NT | Mandatory MyFuel NT public interface | UI removes out-of-stock products, but no documented reusable API | Qualitative official context | East Arm import/wholesale context only; no capacity/inventory feed | Public UI only; not integrated |

No row above provides a live, reusable national dry-station feed. The existing
Fuel Plan stock-out table is an exact dated national/state snapshot, not a live
station feed.

## NSW

### Retail price source

- [API NSW Fuel API product](https://api.nsw.gov.au/Product/Index/22)
- [Fuel API v2 Swagger specification](https://apinsw.onegov.nsw.gov.au/api/swagger/spec/22)
- [API NSW support and application process](https://api.nsw.gov.au/Support)
- [Service NSW API NSW referral](https://www.service.nsw.gov.au/referral/access-the-nsw-government-apinsw-service)
- [FuelCheck monthly historical dataset](https://www.data.nsw.gov.au/data/dataset/fuel-check)

The current v2 endpoint is
`https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices`. It supports NSW
and Tasmania. The documented contract requires:

1. an approved application's consumer key and consumer secret;
2. a client-credentials exchange at
   `https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken` using
   `grant_type=client_credentials` and Basic authentication over the encoded
   `key:secret` pair;
3. the returned bearer access token;
4. the consumer key in the `apikey` header;
5. `Content-Type: application/json; charset=utf-8`, a unique `transactionid`
   and UTC `requesttimestamp`; and
6. an explicit `states=NSW` query for this repository's NSW contributor.

The standard product tier is described as free with 2,500 calls per month.
Registration and application approval are still required, so the source is not
anonymous, immediate or guaranteed. API NSW says registration confirmation can
take up to 24 hours.

The current-price response exposes station identity/location/state and price
rows containing station code, fuel type, cents-per-litre price and last-updated
timestamp. It does **not** expose a fuel availability field. The historical
monthly CSV/XLSX resources require no key and are labelled Creative Commons
Attribution Share-Alike, but monthly history is not a silent substitute for the
current API.

### Availability boundary

[Current operator requirements](https://www.nsw.gov.au/business-and-economy/running-a-business/industry-specific-business-requirements/operating-a-service-station/fuelcheck-information)
require retailers to report fuel unavailability, and consumers can inspect it
through FuelCheck. The public v2 read schema nevertheless omits availability.
The older retailer submission specification's `isavailable` field belongs to a
write interface and must not be attributed to the public read API.

A [25 March 2026 ministerial release](https://www.nsw.gov.au/ministerial-releases/minns-government-steps-up-fuel-coordination-as-distribution-pressure-continues)
contains exact dated outage counts. It is not a reusable live feed and is not
loaded as a new value in Phase 5C.

### Phase 5C decision

The repository retains NSW as an optional price contributor only when both
credentials are present and the complete OAuth/current-price contract succeeds.
Any missing credential, failed token exchange, rejected request, unexpected
schema, invalid timestamp or empty product result excludes NSW without
inventing a fallback value. No NSW stock-availability claim is made.

## Victoria

- [Servo Saver public API](https://service.vic.gov.au/find-services/transport-and-driving/servo-saver/help-centre/servo-saver-public-api)
- [Application](https://service.vic.gov.au/find-services/transport-and-driving/servo-saver/help-centre/servo-saver-public-api/apply-for-servo-saver-public-api)
- [Application timing](https://service.vic.gov.au/find-services/transport-and-driving/servo-saver/help-centre/servo-saver-public-api/done)
- [Technical specification](https://service.vic.gov.au/-/media/bb0b5dbe245f443db4a90263090b6d88.pdf?2)
- [Terms and acceptable-use policy](https://service.vic.gov.au/find-services/transport-and-driving/servo-saver/help-centre/servo-saver-public-api/terms-and-acceptable-use-policy)
- [Mandatory fuel-price reporting](https://www.consumer.vic.gov.au/consumers-and-businesses/products-and-services/mandatory-fuel-price-reporting)
- [Current Victorian fuel-supply page](https://www.vic.gov.au/fuel-supply)

Anyone may apply for free access. Approved clients receive a consumer ID and
key; the stated application outcome target is within 14 business days. The
read-only JSON API is statewide and delayed by 24 hours. It exposes station ID,
name, brand, address, phone, coordinates and timestamp, plus fuel type, price in
AUD cents per litre, `isAvailable` and timestamp. Product codes cover U91, P95,
P98, diesel, premium diesel, E10, E85, B20, LPG, LNG and CNG.

The data is licensed CC BY 4.0 subject to the platform terms and prescribed
notice `© State of Victoria accessed via the Victorian Government Service
Victoria Platform`. Credentials must remain secret. This is the strongest
unintegrated programmatic availability candidate, but it must be labelled
24-hour-delayed and remain gated until credentials and a production response
are verified.

A [Victorian reserve announcement](https://www.premier.vic.gov.au/10-million-litres-diesel-secured-victorian-farmers)
describes a 10 ML diesel reserve for agriculture, releasable only at national
Level 4. It does not disclose storage location and is not terminal-capacity or
live-inventory evidence.

## Queensland

- [Fuel Price Reporting 2026 dataset](https://www.data.qld.gov.au/dataset/fuel-price-reporting-2026)
- [Dataset column explanation](https://www.data.qld.gov.au/dataset/0dfad294-f852-45a5-b86f-986773745fe2/resource/2fc7161e-cf1f-4228-a1c7-141f0df99b4c/download/dataset-column-explanation-for-fuel-price-reporting.txt)
- [FuelPricesQLD direct API](https://www.fuelpricesqld.com.au/)
- [Direct API specification](https://www.fuelpricesqld.com.au/documents/FuelPricesQLDDirectAPI(OUT)v1.6.pdf)
- [Limited-use licence](https://www.fuelpricesqld.com.au/documents/LimitedUseLicence.pdf?v=3)

Queensland Open Data publishes monthly changes-only CSV/API resources under CC
BY 4.0. Fields include site ID/name/brand/address/suburb/state/postcode,
coordinates, fuel type, transaction timestamp and price in tenths of a cent per
litre. `Price = 9999` denotes temporary unavailability. Because the resource
contains changes, its unavailable rows are monthly unavailable reports, not a
current statewide outage total.

The direct API is closer to current reporting but requires registration and
approval. Its licence distinguishes consumer and publisher use, limits polling
to once per minute and restricts onward/public dissemination. The repository
must not publish from it without the appropriate approval. The open monthly
partial layer is already integrated and remains correctly labelled.

Queensland infrastructure announcements and proposals do not supply current
terminal capacity, inventory or reserve volumes and cannot fill those fields.

## Western Australia

- [FuelWatch RSS documentation and reuse conditions](https://www.fuelwatch.wa.gov.au/tools/rss)
- [FuelWatch background](https://www.fuelwatch.wa.gov.au/about/background)
- [FuelWatch public interface](https://www.fuelwatch.wa.gov.au/)
- [WA Government weekly fuel update](https://www.wa.gov.au/government/publications/fuel-security-wa-government-weekly-fuel-update)
- [FuelWatch terminal gate prices](https://www.fuelwatch.wa.gov.au/industry/terminal-gate-prices)
- [Historical TGP catalogue](https://catalogue.data.wa.gov.au/en/dataset/fuelwatch-historic-terminal-gate-prices)

FuelWatch RSS is free XML and expressly permits website/application use with
FuelWatch attribution and a link. It covers the whole state from 1 May 2026 and
provides today, tomorrow after 2:30 pm, or up to one week historical prices.
Published fields include brand, date, price, trading name, location, address,
phone, coordinates, site features and restrictions. The documented RSS schema
does not contain stock availability. The public UI's availability display is
not a documented reusable data endpoint and must not be reverse-engineered.

The weekly government update is qualitative evidence. Its phrase that
stock-outs were low must not become a number. The same update records exactly
20 ML of state-owned diesel at Wyndham, Esperance, Geraldton, Kalgoorlie and
Kwinana; that is a dated reserve disclosure, not terminal-capacity or current
inventory telemetry. Daily TGP data is price evidence under CC BY 4.0, not
capacity.

## South Australia

- [SA fuel-price reporting](https://www.sa.gov.au/topics/driving-and-transport/fuel-pricing/fuel-price-reporting)
- [Publisher registration](https://www.safuelpricinginformation.com.au/publishers.html)
- [Publisher API specification](https://www.safuelpricinginformation.com.au/documents/SAFPIS_API%20Out_v1.2.pdf)
- [Publisher terms](https://www.safuelpricinginformation.com.au/documents/TermsandConditions.pdf)
- [Public fuel-price and availability interface](https://www.fuel.sa.gov.au/fuel-prices)
- [Fuel supply and reserve context](https://www.fuel.sa.gov.au/fuel-supplies-in-south-australia)
- [Dated availability announcement](https://www.premier.sa.gov.au/media-releases/news-items/real-time-fuel-availability-updates-available-on-the-raa-app-for-south-australians)

The publisher API requires registration and a subscriber token. It exposes
site and fuel IDs, timestamps, collection method and price in tenths of a cent
per litre; `9999` means currently unavailable. Retailers report prices and
unavailability within 30 minutes, while publisher clients must not call the
price method more than once per minute.

The terms are contractual rather than a general open licence. They require
attribution and impose dissemination/operational conditions. Registration and
licence acceptance must be completed before integration. The government page
records a 10 ML diesel reserve at IOR Port Bonython, with an option to increase
it to 20 ML. This is dated reserve/port context, not a terminal-capacity feed.

## Tasmania

- [FuelCheck Tasmania](https://www.fuelcheck.tas.gov.au/App/Home/About)
- [LIST service station ArcGIS layer](https://services.thelist.tas.gov.au/arcgis/rest/services/Public/Infrastructure/MapServer/75)
- [LIST web-service terms](https://listdata.thelist.tas.gov.au/public/LISTWebServicesTermsConditions.pdf)
- [Tasmanian weekly fuel-supply updates](https://www.recfit.tas.gov.au/get_involved/fuel-supply-update-for-tasmania)
- [24 July 2026 weekly report](https://www.recfit.tas.gov.au/__data/assets/pdf_file/0016/642400/Fuel-Supply-Update-Director-of-Energy-Planning-Friday-24-July-2026.pdf)
- [Tasmanian Crown copyright guidance](https://www.tas.gov.au/codi)

FuelCheck provides current prices, and API NSW v2 formally supports Tasmania.
The public read response has no availability field. FuelCheck also warns that a
missing fuel type can mean either the station does not sell it or it is out of
stock, so missing products cannot be converted into outages.

The public LIST layer exposes station identity, geometry and product-presence
fields without authentication. It does not provide a reliable review timestamp
or availability boolean, and the applicable production reuse notice is not
clear enough to treat it as an outage feed.

Weekly RecFIT reports provide exact dated stock and station-availability
snapshots. The 24 July report described approximately 112 days of petrol and
67 days of diesel as at 21 July, 99% of outlets fully stocked, two temporary
stockouts and all terminals supplied. These values were not added to the data
registry in Phase 5C. They remain candidates for a separately reviewed manual
envelope with explicit Crown-rights attribution and date scope.

## Australian Capital Territory

- [Access Canberra fair-trading and FuelCheck information](https://www.accesscanberra.act.gov.au/consumer-rights/fair-trading-and-consumer-rights)
- [FuelCheck post-implementation review](https://www.parliament.act.gov.au/__data/assets/pdf_file/0008/2355308/2_FuelCheck-Post-Implementation-Review-Summary-Report.pdf)
- [Current ACT fuel-supply page](https://www.act.gov.au/act-government/fuel-supply-in-the-act)
- [2026 transparency and consumer-protection announcement](https://www.cmtedd.act.gov.au/open_government/inform/act_government_media_releases/barr/2026/strengthening-fuel-supply-transparency-and-consumer-protections)

The public FuelCheck interface displays current ACT and NSW prices. The 2023
review reported more than 95% ACT station participation, but the ACT scheme is
voluntary/opt-in. The published API NSW contract names NSW and Tasmania, not
the ACT, and no documented reusable ACT developer API or file was verified.

Current ACT supply material is qualitative. Government powers to compel stock
and delivery reporting do not create a public dataset; the reported
information may be commercially protected. ACT remains public-UI/manual context
only.

## Northern Territory

- [MyFuel NT](https://consumeraffairs.nt.gov.au/myfuel-nt)
- [MyFuel NT retailer guidance](https://consumeraffairs.nt.gov.au/myfuel-nt/fuel-retailers)
- [Public MyFuel NT application](https://myfuelnt.nt.gov.au/)
- [NT Consumer Affairs 2024–25 annual report](https://consumeraffairs.nt.gov.au/__data/assets/pdf_file/0006/1567797/northern-territory-consumer-affairs-annual-report-2024-25.pdf)
- [NT retail fuel market context](https://nteconomy.nt.gov.au/prices-and-wages/retail-fuel-market)
- [NT copyright and reuse notice](https://nt.gov.au/page/copyright-disclaimer-and-privacy)

MyFuel NT is mandatory for all retailers and its public application displays
current prices and availability. Operator guidance says out-of-stock products
are removed from display. No documented public API, file download or broad
reuse licence was verified. General NT terms reserve reuse unless material is
expressly licensed or use falls within statutory exceptions.

The application must not be scraped and a missing product must not be converted
into a repository outage record. The official economic context says most fuel
enters through the East Arm import/wholesale facility, but publishes no current
capacity or inventory. A documented feed and reuse permission from NT Consumer
Affairs remain the unlock conditions.

## National and cross-jurisdiction boundaries

The canonical [Australian Government Fuel Plan statistics page](https://fuelplan.gov.au/fuel-statistics)
is accessible static HTML and publishes the official dated state/territory and
Australia stock-out table. No stable CSV, XLSX, JSON, JSON:API or public API
endpoint was verified. The former PM&C URL may return an Incapsula response;
that does not make the current Fuel Plan publication unavailable.

[DCCEEW Minimum Stockholding Obligation statistics](https://www.dcceew.gov.au/energy/security/australias-fuel-security/minimum-stockholding-obligation/statistics)
are national weekly/quarterly stock evidence, not state, station or terminal
availability. DCCEEW's [liquid-fuel stock measures](https://www.dcceew.gov.au/energy/security/australias-fuel-security/measures-of-liquid-fuel-stocks)
explain why MSO holdings, IEA holdings and consumption cover are not
interchangeable.

The matrix does not justify:

- a national live outage count;
- a terminal-capacity or live-inventory value;
- vessel identity, ETA, cargo or destination inference;
- converting qualitative government language into a numeric metric;
- treating app visibility as redistribution permission; or
- a Stable/Tight/Disrupted/Critical national status model.
