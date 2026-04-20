# Contributing

## Static-hosting contract (GitHub Pages)

This project deploys as static files from the repository branch. Contributions
must preserve static compatibility.

- Keep dashboard pages as checked-in HTML under `ui_kits/`.
- Do not add server runtime features for site delivery (API routes, server
  rendering handlers, runtime middleware).
- Keep asset and navigation paths relative to the current file location.
- Keep data access file-based via repository JSON envelopes in `data/`.
- Do not add client routing that requires history-fallback rewrites.

## Design-language contract (original author intent)

- Keep UI styling token-driven through `colors_and_type.css` and shared classes in `ui_kits/shared/styles.css`.
- Do not use ad-hoc inline spacing/color styles in dashboard pages; add/reuse token-based classes instead.
- Use semantic chart accents via token variables (`--series-*`, `--accent`, `--caution`, etc.), not hardcoded hex values in page code.
- Keep neutral, plain-English public-interest copy (Australian English), no hype/advocacy tone.
- No dark mode, gradients, decorative icon clutter, or emoji in UI copy.

## Required checks before PR

Run these commands from repository root:

```sh
rg "(href|src)=\\\"/" ui_kits/*.html ui_kits/**/*.html
rg "fetch\\(\\s*['\\\"]/" ui_kits/shared ui_kits/*
python3 scripts/validate_data.py
```

If `rg` finds matches in dashboard HTML/JS for root-absolute URLs, convert them
to relative paths before opening a PR.
