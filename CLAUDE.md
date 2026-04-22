# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # http://localhost:4321
npm run build     # static output to dist/
npm run preview   # preview built site
```

No lint or test scripts are configured. Deployment is via Vercel auto-build on push to `main` (Astro preset, no adapter — static output).

## Architecture

Personal blog on **Astro 5 + Tailwind v4**. Posts are hand-written `.astro` files (not markdown) so each post has full HTML + Tailwind control.

### Post discovery

[src/lib/posts.ts](src/lib/posts.ts) uses `import.meta.glob('/src/pages/posts/*.astro', { eager: true })` to collect every post's exported `metadata` object at build time. Any `.astro` file in `src/pages/posts/` that exports `metadata` (matching `PostMeta` in [src/lib/posts.ts:6](src/lib/posts.ts:6)) shows up on the homepage and in the RSS feed, sorted by `pubDate` desc. Setting `draft: true` in metadata hides the post from the listing but the page still exists at its URL.

[src/pages/index.astro](src/pages/index.astro) and [src/pages/rss.xml.js](src/pages/rss.xml.js) both read from `getAllPosts()` — there is no separate content source or collections config.

### Post rules

- Every new post **must** include `pubDate` in its exported `metadata`. Posts without a date will not sort correctly on the homepage.
- The homepage list is sorted newest-first (`pubDate` desc). Always set `pubDate` to the actual publication date.
- `tags` should only contain the **category** (e.g. `kinh tế`, `triết học`, `công nghệ`) and the **subject** (e.g. `Adam Smith`, `Stoicism`, `AI`). Do not add generic or descriptive tags. **Maximum 3 tags per post.**
- Every post **must cite specific sources** (book titles, authors, page numbers, papers, URLs). Include a "Tài liệu tham khảo" (References) section at the end of every article.
- When data is involved (statistics, timelines, comparisons), present it visually using **charts or timelines** rather than plain text.
- **Do not use scroll-triggered or page-load animations** (fade-ins, reveals, IntersectionObserver-based effects) on post content. Animations should only apply on **hover** (e.g. hover state changes on blocks) and for **interactive elements within blocks** (e.g. expand/collapse chevrons, popover show/hide). Charts and bars render at full size immediately — no scroll-triggered width animations.
- Structure content in **separate blocks** where one data point or event logically leads to the next — clear cause-and-effect or chronological flow.
- **Every** specialized, technical, or foreign-language keyword must have a **clickable popover** (tooltip) that shows a brief Vietnamese explanation on click. Do not leave any jargon, English term, or domain-specific concept unexplained — assume the reader has no prior knowledge of the topic.
- For complex or dense content sections, include an **expandable detail block** (click-to-expand) so readers can dive deeper without cluttering the main flow.
- The "Tài liệu tham khảo" (References) section must be placed inside an **accordion block** (expandable `<details>` element), not displayed as open content.
- Every reference must be a **clickable link** wrapping the entire item (`<a>` around full citation text) that opens the source in a new tab (DOI, publisher page, or stable URL). No separate link label — the whole item is the link.
- Every article must end with a **closing quote** from a well-known influential figure relevant to the article's topic, accompanied by the author's own supporting commentary that reinforces the article's message.
- Use **wide layout containers** — `NeobrutalismLayout` hero/main at `max-w-[1400px]` with article at `max-w-[920px]`; `DarkInfographicLayout` main at `max-w-7xl` with inner sections at `max-w-5xl`.
- Use **large body text** — `prose-neo` paragraphs at `1.25rem`; DarkInfographic body text at `text-base` minimum (use `text-base md:text-lg` for main content paragraphs). Do not use `text-sm` for body content.

### Themed layouts (the key abstraction)

A post picks a theme by importing one of the layout files in [src/layouts/](src/layouts/) (e.g. `MinimalistDarkLayout`, `NeobrutalismLayout`, `EditorialLayout`, `MemphisLayout`, `ZineLayout`, `DarkUILayout`, `DarkInfographicLayout`). Most theme layouts wrap [BaseLayout.astro](src/layouts/BaseLayout.astro) — which only sets `<html>`/`<head>`/`<body>` and a `bodyClass` prop — then render their own `<Nav variant=".." />`, hero/header, `<slot />` inside an `<article class="prose-*">`, and `<Footer variant=".." />`.

**Exceptions to the standard pattern:**
- `DarkInfographicLayout` uses the `dark` Nav/Footer variant (not a dedicated one) and passes `<slot />` directly without a `prose-*` wrapper — posts using it handle their own content styling.
- The `mars` and `light` variants exist in Nav/Footer but have no dedicated layout file. The homepage ([src/pages/index.astro](src/pages/index.astro)) uses `mars` directly with `BaseLayout`.

**Adding a new theme requires four coordinated edits:**
1. New `XyzLayout.astro` in [src/layouts/](src/layouts/).
2. Add a `xyz` key to the `variant` union and `styles` object in [src/components/Nav.astro](src/components/Nav.astro).
3. Add the same key to [src/components/Footer.astro](src/components/Footer.astro) (`variant` union + `styles` map + any footer-specific branding branches).
4. Add a `.prose-xyz` ruleset in [src/styles/global.css](src/styles/global.css) for long-form text (h2/h3/p/blockquote/etc).

The Nav/Footer `variant` unions are the source of truth for which themes exist — missing a variant there causes a TypeScript error even though posts still render.

### Tailwind v4 conventions (important)

- Custom design tokens live in the `@theme { ... }` block at the top of [src/styles/global.css](src/styles/global.css) (fonts, colors like `--color-ink`, `--color-accent-gold`, theme palettes `--color-memphis-*`, `--color-zine-*`). These generate utility classes like `bg-ink`, `text-accent-gold`, `border-border-subtle`.
- **Do not use `@apply` with these custom tokens** — it fails with "Cannot apply unknown utility class". The prose rulesets use raw CSS with `var(--color-*)` instead (see [src/styles/global.css:55](src/styles/global.css:55) onward). Follow that pattern when extending prose styles.
- Google Fonts `@import url(...)` MUST come before `@import "tailwindcss"` at the top of `global.css`. Reordering breaks the build.

### Content language

HTML lang is `vi` ([BaseLayout.astro:19](src/layouts/BaseLayout.astro:19)) and post content is Vietnamese. Preserve Vietnamese text when editing existing posts; metadata field names (`title`, `description`, etc.) stay English.

- **All content must be in Vietnamese**, including quotes, blockquotes, headings, labels, and commentary. Translate foreign-language quotes into Vietnamese.
- **Only keep keywords and specialized terms in their original language** (e.g. "Autophagy", "GDP", "Invisible Hand"). All surrounding prose, explanations, and UI text must be Vietnamese.

### Known README drift

[README.md](README.md) still references sample posts `value-trap.astro` and `slow-thinking.astro` that no longer exist, and mentions only 3 themes when 7 layouts and 8 Nav/Footer variants are now present. Trust the filesystem over the README when they disagree.
