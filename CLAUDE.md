# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static HTML website for **nx86.dev** — a Switch emulator project (AArch64 → NxIR → x86_64-v4 native recompilation). No build system, no bundler, no framework. Single shared `style.css`, one `nav.js` IIFE, flat `.html` files.

## Local development

```bash
bunx serve
# or
npx http-server
```

Deployed to Cloudflare Workers via `wrangler.jsonc` (serves the repo root as static assets).

## Architecture

- `style.css` — single stylesheet for all pages; uses CSS custom properties (`--fg`, `--bg`, `--accent`, `--accent-bg`, `--muted`). Dark mode via `@media (prefers-color-scheme: dark)`, no JS toggle.
- `nav.js` — IIFE that intercepts local link clicks, fetches the target, swaps `.content` innerHTML, and pushes history state. Also prefetches on hover/focus. No globals, no modules.
- `docs.html` — hub page linking to Status, Technical Details, and NDX. These three are the Docs section; their main nav Docs link has `aria-current="page"`.
- `ndx/` — sub-section pages under Docs; reference root assets with `../` prefix. Each has a `<nav class="subnav">` listing all 12 NDX pages with `<span class="sep">` separators and the current page as `<strong>`.
- `status.html` / `technical.html` — also under Docs; each has a 3-item subnav (Status | Technical Details | NDX).
- `blog.html` — posts are `<article data-date="YYYY-MM-DD">` inside `#posts`, sorted newest-first by a separate inline `<script>`, not nav.js.

## Page boilerplate

Every page (except 404) must have: `<title>`, `<meta name="description">`, all `og:` tags, `<link rel="canonical">`, the logo/subtitle/nav block duplicated verbatim, and `<script src="nav.js"></script>` at the bottom of `<body>`. Nav order is always: **Index, About, Docs, Blog, Legal**. Separators are `<span class="sep"></span>`. The current page's nav link gets `aria-current="page"`; for Docs-section pages (`docs.html`, `status.html`, `technical.html`, `ndx/*.html`) that's the Docs link.

When adding a new page:
1. Copy an existing page as template and update all meta tags.
2. Add to `sitemap.xml`.
3. Add nav link in **every** HTML file.

## Constraints

- No build tools, bundlers, frameworks, or CDN links.
- No inline styles — use existing classes from `style.css`.
- No new CSS unless truly necessary; no jQuery or any library.
- The logo, subtitle, and nav are duplicated in every HTML file — not injected by JS.
- `.mimocode/` is agent tooling config, not site deps — do not `npm install` in the root.

## Content conventions

- "Nx86" in prose (not "nx86" or "NX86"); "x86_64-v4" for target arch; "AArch64" or "ARM64" for guest arch.
- Em dashes (—) for parenthetical asides, not en dashes.
- Tone: direct, technical, honest — no hype or marketing language.
- The project never ships games, firmware, keys, or system files.
