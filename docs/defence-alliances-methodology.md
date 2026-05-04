# Defence, Alliances and Strategic Posture Methodology

Last reviewed: 2026-04-29

This dashboard is a public-interest view of Australia's defence spending,
selected public ADF capability rows, official alliance and strategic-framework
profiles, and sovereign defence-industry context.

It is not a readiness dashboard, a war-fighting model, a stock-tipping page, or
a catalogue of classified posture. It does not publish secret, live or
readiness-sensitive data.

## Scope

The first-pass surface loads source-safe public rows for:

- Defence budget and planned expenditure from the 2026 National Defence
  Strategy budget factsheet.
- Permanent ADF, APS and reserve paid-service workforce context from the
  Defence Annual Report 2024-25.
- Selected Navy, Air Force and Army capability or acquisition rows from
  official public service and ministerial pages.
- ANZUS, AUKUS, Five Eyes, Quad, AUSMIN and the PNG-Australia treaty as
  separate framework profiles.
- Sovereign Defence Industrial Priorities and selected official industry
  program context.
- An explicit unavailable source gate for readiness, live availability,
  munitions stockpile depth and classified posture.

## Budget is not capability availability

Budget rows are money amounts in a period. The page keeps each budget concept in
its own field:

- Defence funding.
- Planned acquisition expenditure.
- Planned sustainment expenditure.
- Planned workforce expenditure.
- Additional investment.
- Capability investment over the planning decade.

None of these rows is treated as a delivered capability count, readiness rate or
operational availability measure.

The page leaves "defence spending as share of GDP" unavailable in the current
pass because it has not loaded a current official GDP denominator or a named
official percentage row into an envelope.

## Public asset rows are not readiness rows

Selected asset and acquisition rows are taken from official public sources. They
are useful for explaining force-structure context, but they do not show:

- mission-capable rates,
- serviceability,
- crewing,
- deployable strength,
- stockpile sufficiency,
- basing posture,
- live operational availability.

Acquisition rows are labelled as acquisition rows. For example, "up to 75" is
preserved where the source uses that wording, rather than being converted into a
verified current fleet count.

## Alliances, partnerships and forums are not interchangeable

The dashboard separates framework type:

- A formal security treaty is a treaty or treaty-record row.
- An intelligence partnership is not shown as a mutual defence treaty.
- A trilateral security and technology partnership is not treated as a mutual
  defence treaty unless the source says so.
- A diplomatic partnership or strategic forum is not labelled as a formal
  alliance.
- A ministerial consultation is not counted as a separate treaty.

The page therefore labels ANZUS, AUKUS, Five Eyes, Quad and AUSMIN differently
instead of collapsing them into one generic alliance score.

## Strategic posture framing

Strategic posture is described only from public government strategy language.
The page can state that official strategy refers to a strategy of denial,
self-reliance, sovereign industrial resilience and partner coordination. It does
not predict conflict outcomes, rank adversaries or claim that Australia can
"beat" another country.

## Sensitive-data boundary

The dashboard intentionally excludes secret, classified, live or sensitive rows.
The unavailable readiness source gate covers:

- mission-capable rates,
- operational availability,
- live readiness,
- munitions stockpile depth,
- classified basing posture,
- live deployment availability,
- war-winning comparisons.

These fields remain unavailable until a named public source supports the exact
field and the repo maintainers decide that publishing it is source-safe and
public-interest safe.

## Trust labels

Each section uses the existing trust-label language:

- `Observed`: copied from a named public source with clear period/unit.
- `Derived`: calculated from loaded source envelopes. This page currently avoids
  derived defence metrics unless the method is explicitly documented.
- `Partial coverage`: source-safe context exists, but the row is incomplete,
  selected, qualitative or not exhaustive.
- `Manual`: hand-keyed or qualitative context from a named public source.
- `Unavailable`: no source-safe field is loaded.
- `Stale`: the validator can flag an envelope if its source cadence has likely
  moved past the loaded data.

Unavailable rows stay unavailable rather than being estimated.

## Current first-pass gaps

- No readiness, mission-capable, live availability or deployable-force metric is
  loaded.
- No munitions stockpile size or adequacy metric is loaded.
- No classified basing or live posture metric is loaded.
- No complete current inventory of all ADF platforms is loaded.
- No defence-spending share-of-GDP row is computed.
- No base or estate capacity table is loaded.


## Uncrewed systems (Pass 2)

The Defence posture page includes a dedicated uncrewed systems and counter-drone
section that sits between "Capabilities and assets" and "Sovereign capability
and industry". It is loaded from `data/manual/defence_uncrewed_systems.json`.

The section keeps the following row types conceptually separate and never
collapses them into one line or one number:

- **In-service / introduced** — uncrewed systems that the public Defence
  project page lists as introduced or in service. First-pass examples include
  the MQ-4C Triton (Project AIR 7000 Phase 1B) and the Insitu Integrator
  Tactical UAS (Project LAND 129 Phase 3).
- **Acquisition / development** — programmes that public Defence pages
  describe as in development, prototype or under acquisition rather than
  fielded. First-pass examples include the MQ-28A Ghost Bat (Project AIR 6014
  Phase 1) and the LAND 156 counter-small UAS work.
- **Sovereign / domestic program** — Australian-developed or co-funded
  uncrewed work, such as the Ghost Shark Extra-Large Autonomous Undersea
  Vehicle and the Sovereign Defence Industrial Priorities autonomous-systems
  category.
- **Counter-drone** — capabilities that defend against adversary uncrewed
  systems. Counter-drone is presented as its own line; it is not the same
  thing as drones Australia operates.
- **Funding boundaries** — the 2024 Integrated Investment Program and the
  2026 National Defence Strategy reference uncrewed and autonomous-systems
  lines inside broader capability investment envelopes. Neither publishes a
  clean drone-only budget. The page keeps a "Drone-only budget" row marked
  Unavailable rather than presenting an IIP or NDS envelope as drone funding.

### What the uncrewed section does NOT do

- It does not publish a complete ADF drone inventory.
- It does not publish mission-capable rates, sortie rates, deployability or
  live availability for any uncrewed platform.
- It does not present development prototypes (Ghost Bat, Ghost Shark) as
  fielded operational capability.
- It does not bundle counter-drone, sovereign-program and acquisition rows
  into a single inventory or single budget.
- It does not include classified or sensitive uncrewed systems.

If a row's quantity or status is not separately published on the cited
Defence project page, the dashboard records that fact rather than asserting
a fleet count.
