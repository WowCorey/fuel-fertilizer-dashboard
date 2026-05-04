# Defence, Alliances and Strategic Posture Source Audit

Last reviewed: 2026-04-29

This audit records the public sources used for the first-pass Defence,
Alliances and Strategic Posture dashboard. Official Australian Government
sources are preferred. News reports, Wikipedia, think-tank commentary, company
press releases and defence blogs are not used as primary metric sources.

## Usable sources

| Source | Publisher | Format | Supports | Decision | Rights and caveats |
|---|---|---|---|---|---|
| 2026 National Defence Strategy budget factsheet | Department of Defence | PDF | Defence funding, planned expenditure categories, additional investment, capability investment over decade, alternative-financing context | usable | Commonwealth copyright; Defence terms apply. Budget rows are money/planning rows, not readiness or availability. |
| 2026 National Defence Strategy / 2026 Integrated Investment Program landing page | Department of Defence | HTML/PDF links | Strategy of denial, self-reliance, sovereign industrial resilience, integrated focused force, decade capability-investment context | usable | Commonwealth copyright; qualitative strategy framing only. No threat ranking or war-fighting prediction. |
| Defence Annual Report 2024-25 | Department of Defence | PDF | Permanent ADF, APS and reserve paid-service workforce rows | usable | Commonwealth copyright; workforce rows are not deployability or readiness. |
| Organisation structure | Department of Defence | HTML | ADF Headquarters, Joint Capabilities Group, Joint Operations Command, Army, Air Force, Navy | usable | Public structure context only. No force-readiness metric. |
| Sea Power Centre submarine, destroyer and frigate pages | Royal Australian Navy / Sea Power Centre | HTML | Collins class submarine count, Hobart class destroyer count, Anzac class frigate context | usable | Public asset count/context only. Counts do not show mission-capable status or crewing. |
| RAAF aircraft pages | Royal Australian Air Force | HTML | Selected F-35A, F/A-18F, EA-18G, P-8A, C-17A and C-130J public counts or committed rows | usable | Public asset or committed-fleet context only. Counts are not live availability. |
| Defence ministerial acquisition releases | Defence Ministers | HTML | HIMARS, Redback IFV and M1A2 SEPv3 acquisition rows | usable | Acquisition status only. "Up to" wording is preserved where source uses it. |
| ANZUS treaty record | DFAT Australian Treaties Database | HTML | Formal treaty name, treaty status, dates and scope | usable | Treaty-record facts only. The dashboard does not model operational decisions under the treaty. |
| AUKUS Optimal Pathway | Australian Submarine Agency | HTML | Trilateral submarine pathway and industrial cooperation context | usable | Public pathway context only. AUKUS is not labelled as a mutual defence treaty. |
| Five Eyes partners page | Office of National Intelligence | HTML | High-level Five Eyes partnership description and member set | partial | Public description supports high-level profile; detailed intelligence-sharing mechanics are not public. |
| Quad page | DFAT | HTML | Quad membership and diplomatic partnership framing | usable | Public framework context. The Quad is labelled as a diplomatic partnership, not a formal alliance. |
| AUSMIN 2025 fact sheet | DFAT | HTML | Australia-US ministerial consultation and cooperation themes | usable | Consultation mechanism context; not a separate treaty. |
| PNG-Australia Mutual Defence Treaty | DFAT | HTML | Public treaty text and purpose | partial | Treaty text is public; implementation and entry-into-force details are not modelled beyond source notes in this first pass. |
| Sovereign Defence Industrial Priorities | Department of Defence | HTML | Seven SDIPs and industrial capability framing | usable | Official industrial-priority context only. Does not publish classified supply-chain depth. |
| Guided Weapons and Explosive Ordnance Enterprise | Department of Defence | HTML | Up to A$21b decade funding and munitions manufacturing context | usable | Funding/program context only. No stockpile depth or readiness metric. |
| Australia's AUKUS Submarine Industry Strategy | Australian Submarine Agency | HTML | Submarine industrial capability context | usable | Qualitative official context only; no private supply-chain capacity estimate. |

## Partial or blocked areas

| Area | Decision | Reason |
|---|---|---|
| Mission-capable rates | blocked/unavailable | No source-safe public national metric loaded; publishing would risk implying readiness from asset counts. |
| Live operational availability | blocked/unavailable | No official public live availability feed loaded, and live readiness can be sensitive. |
| Munitions stockpile size or adequacy | blocked/unavailable | Public GWEO pages discuss stockpile expansion and industrial programs, not dashboard-safe stockpile depth. |
| Classified basing posture | blocked/unavailable | The dashboard does not publish classified or sensitive posture information. |
| Defence spending as share of GDP | unavailable in this pass | No current official percentage row or GDP denominator is loaded into the page. |
| Complete ADF platform inventory | partial | Selected official public rows are loaded. The page is not a complete equipment catalogue. |
| Base/estate capacity | unavailable | Estate and basing context can be sensitive and no source-safe capacity table is loaded. |

## Source discipline

The dashboard must not:

- combine budgets, asset counts and readiness into one score,
- turn acquisition announcements into verified current fleet counts,
- use news reports or commentary as primary metric sources,
- treat the Quad as a formal military alliance,
- treat Five Eyes as a mutual defence treaty,
- infer secret, live or readiness-sensitive fields from public asset counts.


## Pass 2: Uncrewed systems and counter-drone sources

| Source | Publisher | What it supports | Trust handling |
|---|---|---|---|
| Project AIR 7000 Phase 1B (MQ-4C Triton) | Department of Defence | In-service / introduced row, RAAF maritime patrol UAS | Manual |
| Project AIR 6014 Phase 1 (MQ-28A Ghost Bat) | Department of Defence | Development / prototype row, sovereign-developed Airpower Teaming System | Manual |
| Project LAND 129 Phase 3 (Insitu Integrator) | Department of Defence | In-service tactical UAS row for Australian Army | Manual |
| Project LAND 156 (counter-small UAS) | Department of Defence | Counter-drone capability row (Army c-sUAS) | Manual |
| Ghost Shark Extra-Large Autonomous Undersea Vehicle | Department of Defence / Australian Submarine Agency / Defence Ministers | Sovereign development / prototype maritime autonomous row | Manual |
| Sovereign Defence Industrial Priorities — autonomous systems | Department of Defence | Industrial priority category context | Manual |
| Defence Industry Development Strategy 2024 | Department of Defence | Strategy-level autonomous-systems context | Manual |
| 2024 Integrated Investment Program | Department of Defence | Capability investment envelope context | Partial coverage |
| 2026 National Defence Strategy budget factsheet | Department of Defence | Capability investment envelope context | Partial coverage |
| Royal Australian Navy public pages | Royal Australian Navy | Broader RAN maritime autonomous context | Partial coverage |

**Rights**: Commonwealth copyright; Defence and service-specific website copyright terms apply.

**What is intentionally not loaded as primary source**: Wikipedia, news articles, military blogs, fan databases, manufacturer marketing decks, third-party aggregators. The dashboard cites the named Defence project page or named ministerial release as the authoritative source for each row.

**Why some rows stay partial or unavailable**:

- The 2024 IIP and the 2026 NDS budget factsheet group uncrewed and autonomous capability inside broader investment lines that also fund crewed platforms, sustainment and infrastructure. There is no source-safe "drone-only" budget line to extract.
- RAN maritime autonomous coverage is loaded as Partial coverage because no single public RAN page consolidates every uncrewed maritime program with a consistent definition.
- All readiness, deployability, mission-capable, sortie-rate and live-availability data is excluded because it is not on a public Defence page in a source-safe form.
- Classified or sensitive systems are excluded.
