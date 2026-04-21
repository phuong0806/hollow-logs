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

### Themed layouts (the key abstraction)

A post picks a theme by importing one of the layout files in [src/layouts/](src/layouts/) (e.g. `MinimalistDarkLayout`, `NeobrutalismLayout`, `EditorialLayout`, `MemphisLayout`, `ZineLayout`, `DarkUILayout`, `DarkInfographicLayout`). Every theme layout wraps [BaseLayout.astro](src/layouts/BaseLayout.astro) — which only sets `<html>`/`<head>`/`<body>` and a `bodyClass` prop — then renders its own `<Nav variant=".." />`, hero/header, `<slot />` inside an `<article class="prose-*">`, and `<Footer variant=".." />`.

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

### Known README drift

[README.md](README.md) still references sample posts `value-trap.astro` and `slow-thinking.astro` that no longer exist, and mentions only 3 themes when 7 layouts are now present. Trust the filesystem over the README when they disagree.
