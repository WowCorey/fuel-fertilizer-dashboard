---
name: fuel-resilience-au-design
description: Use this skill to generate well-branded interfaces and assets for Fuel Resilience AU, a public-facing, policy-grade dashboard tracking Australia's fuel, fertilizer and supply-chain resilience. Contains essential design guidelines, colors, type, fonts, assets and UI kit components for prototyping and production work.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- README.md — design philosophy, content fundamentals, visual foundations, iconography
- colors_and_type.css — all design tokens (color, type, spacing, radii, motion)
- assets/ — logo lockup, Australia outline SVG
- preview/ — small reference cards for each token group
- ui_kits/fuel-dashboard/ — interactive homepage recreation with MetricCard, ChartCard, InsightFeed, Header, Footer

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Design principles to preserve when generating new work:
- Paper background, never white; ink text, never pure black
- One signal accent (ink blue #1F3A8A); semantic data colors only on data
- Serif for headlines and big numbers (Source Serif 4); sans for UI (Inter Tight); mono for values (JetBrains Mono)
- Hairline 1px borders; small radii (2–4px); near-zero shadows
- Tabular figures enabled globally; delta glyphs (▲ ▼ —) never pills
- No gradients, no emoji, no decorative icons, Australian English copy
