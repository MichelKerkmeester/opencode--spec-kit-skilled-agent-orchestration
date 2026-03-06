# Hero Section — Shadcn Zinc Light Theme Variants

> **Section:** Hero
> **Variants:** 5 (generated in a single call)
> **Design System:** Shadcn UI — Zinc theme (light mode)
> **Framework:** TIDD-EC + Prompt Improver principles
> **Separator:** `---VARIANT-SEPARATOR---`
> **Output:** 5 complete HTML files, raw (no markdown fences)

## Prompt

---

### ROLE

You are a senior front-end engineer specializing in design-system-to-CSS translation, with deep expertise in Shadcn UI's Zinc light-theme token architecture. You think from three perspectives simultaneously:

1. **Prompt Engineering**: Maximizing structural variety across 5 outputs — each variant must use a fundamentally different information architecture
2. **AI Interpretation**: Ensuring each HTML file is unambiguous, self-contained, and requires zero external dependencies (no CDN fonts, no JavaScript)
3. **End-User Design**: Creating polished, production-ready layouts that showcase Shadcn's signature aesthetic — minimal ring-based elevation, HSL color tokens with opacity modifiers, calc-based border radii, Geist Sans typography, and whitespace-driven hierarchy

### TASK

Generate 5 structurally distinct **Hero** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for the hero/header area.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: container strategy (centered vs. split vs. full-width), grouping logic (stacked vs. columnar vs. asymmetric), emphasis model (text-first vs. action-first vs. data-first), visual rhythm (dense vs. sparse).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `hsl(var(--token))` references for colors — never raw hex/rgb values outside the `:root` block. Use `hsl(var(--token) / opacity)` for tints. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, `<meta color-scheme="light">`, ring-1 elevation, calc radii, Geist Sans font, semantic HTML, reduced-motion query, no JavaScript, no Tailwind, no React, no Google Fonts link.

### DO'S

- Use `0 0 0 1px hsl(var(--foreground) / 0.1)` ring pattern as primary card/container elevation
- Use `hsl(var(--token))` for all colors — bare HSL triplets from `:root`
- Use `hsl(var(--token) / opacity)` for tints and overlays — NOT rgba()
- Use `var(--radius-*)` with calc pattern from `--radius` base for all border radii
- Use `var(--space-*)` tokens for all spacing consistently
- Use Geist Sans (`var(--font-sans)`) for all body/display text, Geist Mono (`var(--font-mono)`) for code
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<header>`, `<details>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light">`
- Target 600–900 lines per variant for rich, production-quality layouts
- Let whitespace and typography hierarchy create visual structure (Shadcn aesthetic)

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes (`class="bg-white p-4 rounded-lg"`)
- No React/JSX syntax (`className=`, `onClick=`, `{variable}`)
- No external icon fonts or CDN icon libraries (FontAwesome, Material Icons, etc.)
- No raw hex/rgb values outside the `:root` block — use `hsl(var())` references only
- No skeumorphic `::before` inner borders on buttons (that is UntitledUI, not Shadcn)
- No `--bg-brand-*`, `--text-brand-*`, `--fg-brand-*` tokens (UntitledUI naming)
- No `--shadow-skeumorphic` token
- No Background Grid Pattern SVG decoration (UntitledUI, not Shadcn)
- No Google Fonts `<link>` tag — Geist Sans uses system-ui fallback
- No `content="light dark"` — must be `content="light"` only
- No box-shadow as the ONLY elevation — ring-1 must be present on elevated containers
- No JavaScript (`<script>`, `addEventListener`, `setInterval`)
- No neon glows, particle effects, parallax scrolling, or 3D transforms

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Minimal Typographic Masthead:**
Pure type + whitespace composition. Centered layout with generous `--space-24` vertical padding. A small `badge--secondary` label above the heading. Massive `text-5xl` heading with `--tracking-tight`, a subtitle in `--muted-foreground`, and two buttons below (default + outline). No icons, no cards — typography and whitespace create all the hierarchy. The heading may highlight one keyword using `--primary` color. Clean and sparse.

**Seed 2 — Asymmetric Split Header:**
Two-column layout (55% / 45%). Left column: breadcrumb trail in `--muted-foreground`, large heading with `--tracking-tight`, description paragraph, and a row of two buttons (default + ghost). Right column: a single card with ring-1 elevation containing a code block (dark bg, monospace) showing a terminal command. Below the card, a row of 3 small metric badges (`badge--outline`) showing stats like "v2.4.0", "MIT License", "TypeScript". Asymmetric but balanced.

**Seed 3 — Status Bar + Headline:**
Thin horizontal status bar at top with 3 badges (`badge--success`, `badge--info`, `badge--outline`) showing system status. Below: centered heading area with `text-4xl` heading where one word is wrapped in a `<mark>` element styled with `hsl(var(--warning-muted))` background. Single CTA button (default variant). Below button: a metadata line with separator dots showing "Last updated: March 2026 · Version 2.4 · 12 min read" in `--muted-foreground`. Minimal, information-dense.

**Seed 4 — Command-Line Welcome:**
Terminal-inspired hero. Small terminal icon (inline SVG) above heading. `text-4xl` heading. Below: a prominent search/command input field (full-width, `input` component with search icon) as the primary interaction point. Below input: a horizontal row of 4 ghost buttons acting as quick-action shortcuts (e.g., "Quick Start", "API Docs", "Examples", "Changelog"). Each ghost button has a small inline SVG icon. Clean, developer-focused.

**Seed 5 — Card Cluster Header:**
Horizontal top bar layout. Left: icon (inline SVG in a muted circle) + title stacked. Center: row of 3 status badges. Right: button group (default + outline + icon-only ghost button). Below this bar: a `separator--horizontal`. Below separator: a description paragraph and a row of 3 small cards (ring-1 elevation) showing key metrics — each card has a label in `--muted-foreground`, a large number, and a small trend indicator. Data-dense, dashboard-like.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
