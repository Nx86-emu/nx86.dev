# AGENTS.md

## Project

Static HTML website for **nx86.dev** — a Switch emulator project focused on native recompilation (AArch64 → NxIR → x86_64-v4). No frameworks, no build tools, no bundler. Just HTML, CSS, and vanilla JS served as flat files.

## File layout

```
index.html          Home page
about.html          What Nx86 is and why it exists
status.html         Current project status (now / not yet / next)
technical.html      Deep technical details (compiler pipeline, NxIR, memory, testing)
ndx/index.html      NDX modloader overview and section index
ndx/installing.html Installing mods
ndx/eden.html       Eden compatibility
ndx/creating.html   Creating mods
ndx/nxmod.html      nxmod format reference
ndx/profiles.html   Mod profiles
ndx/cache.html      Cache management
ndx/cheats.html     Cheats
ndx/gso.html        GSO/GSC
ndx/repos.html      Mod repositories
ndx/safety.html     Safety and trust
ndx/ai.html         AI agent guide
blog.html           Dev log — articles sorted client-side by data-date
legal.html          Legal disclaimers and license info
404.html            Custom 404 page (noindex)
style.css           Single stylesheet — all pages share this
nav.js              SPA-like soft navigation + prefetch on hover
logo.svg            Header logo (inverted in light mode, raw in dark)
favicon.svg         Favicon
robots.txt          Allows all, points to sitemap
sitemap.xml         Lists all public pages
```

## Page structure convention

Every page (except 404) follows this exact boilerplate:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nx86 - PageName</title>
  <meta name="description" content="...">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Nx86">
  <meta property="og:title" content="Nx86 - PageName">
  <meta property="og:description" content="...">
  <meta property="og:url" content="https://nx86.dev/page.html">
  <link rel="canonical" href="https://nx86.dev/page.html">
  <meta name="theme-color" content="#0d1117">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <a href="index.html"><img src="logo.svg" alt="Nx86" class="logo"></a>
  <p class="subtitle">A work-in-progress Switch emulator focused on native recompilation.</p>

  <nav>
    <a href="index.html">Index</a><span class="sep"></span>
    <a href="about.html">About</a><span class="sep"></span>
    <a href="status.html">Status</a><span class="sep"></span>
    <a href="technical.html">Technical Details</a><span class="sep"></span>
    <a href="ndx/index.html">NDX</a><span class="sep"></span>
    <a href="blog.html">Blog</a><span class="sep"></span>
    <a href="legal.html">Legal</a>
  </nav>

  <div class="content">
    <!-- page content here -->

    <footer>nx86.dev &middot; <a href="https://github.com/nx86-emu">GitHub</a></footer>
  </div>

  <script src="nav.js"></script>
</body>
</html>
```

Rules:
- The logo, subtitle, and nav are **duplicated in every HTML file** — they are not injected by JS.
- The nav link order is always: Index, About, Status, Technical Details, NDX, Blog, Legal.
- Separators are `<span class="sep"></span>` (CSS renders ` | ` via `::before`).
- The footer is inside `.content` and always reads: `nx86.dev · GitHub`.
- `nav.js` is loaded at the bottom of `<body>`, after `.content`.
- 404.html has `<meta name="robots" content="noindex">` and no footer link to GitHub (just the standard footer).
- Only `index.html` has `<script type="application/ld+json">` structured data.

## Adding a new page

1. Copy an existing page's HTML as a template.
2. Update `<title>`, `<meta name="description">`, all `og:` tags, and `canonical` href.
3. Add the page to `sitemap.xml`.
4. Add a `<nav>` link in **every** HTML file (including the new one) in the correct order.
5. Use only existing CSS classes — do not add inline styles or new CSS unless truly needed.

## CSS conventions

- **CSS custom properties** for all colors: `--fg`, `--bg`, `--accent`, `--accent-bg`, `--muted`.
- Dark mode via `@media (prefers-color-scheme: dark)` — no toggle, no class-based switching.
- Logo inversion: `filter: invert(1)` in light mode, `filter: none` in dark mode.
- `.content` is max-width `60rem`, centered with auto margins.
- `article` elements get `background: var(--accent-bg)` — used for blog posts.
- `.muted` for secondary text, `.pipeline` for monospaced pipeline strings.
- `code` — inline monospace. `pre` — block code with `var(--accent-bg)` background; defined in style.css.
- NDX sub-pages live in `ndx/` and use `../` to reference root assets (`../style.css`, `../logo.svg`, `../nav.js`, `../favicon.svg`) and root pages (`../about.html`, etc.). The NDX nav link within `ndx/` pages is `index.html` (no prefix). Cross-links between NDX pages are relative with no prefix.
- NDX sub-pages use a `<p class="muted">` secondary nav at the top of `.content`, listing all 12 NDX pages with the current page bolded rather than linked.
- `hr` for section dividers inside `.content`.
- Body padding: `6px 50px`.
- No external fonts — `sans-serif` system font stack.

## JS conventions

- `nav.js` is an IIFE — no globals, no modules.
- It intercepts local link clicks, fetches the target page, swaps `.content` innerHTML, and pushes history state.
- Nav links are prefetched on hover/focus via `<link rel="prefetch">`.
- External links, `_blank` targets, download links, and links with `aria-label` are excluded from soft nav.
- Blog post sorting is a separate inline `<script>` in `blog.html` — not part of nav.js.

## Blog posts

- Each post is an `<article data-date="YYYY-MM-DD">` inside `#posts`.
- Posts are sorted newest-first by `data-date` via client-side JS.
- Date display is in the post body as `<p class="muted">Month DD, YYYY</p>`.
- There is a commented-out template at the bottom of `#posts` for new posts.

## Content style

- Tone: direct, technical, honest. No hype, no marketing language.
- Use "Nx86" (not "nx86" or "NX86") in prose.
- Use em dashes (—) not en dashes (–) for parenthetical asides.
- Use "x86_64-v4" for the target architecture (not "x86-64" or "x64").
- Use "AArch64" or "ARM64" for the guest architecture.
- Abbreviations like NxIR, SSA, W^X, NZCV are used without expansion after first mention on a page.
- The project does not ship games, firmware, keys, or system files — never imply otherwise.

## SEO

- Every public page has: `<meta name="description">`, Open Graph tags, `<link rel="canonical">`.
- `robots.txt` allows all and points to sitemap.
- `sitemap.xml` lists all public pages (not 404).
- JSON-LD structured data only on `index.html`.

## What NOT to do

- Do not introduce a build system, bundler, or framework.
- Do not use npm/yarn/pnpm for the site itself (the `.mimocode/` dir is agent config, not site deps).
- Do not add external CDN links (fonts, icons, scripts).
- Do not add inline styles — use classes from `style.css`.
- Do not restructure the nav or change the page order without updating all HTML files.
- Do not add comments in HTML/CSS/JS unless documenting a non-obvious constraint.
- Do not use jQuery, React, or any library.
