# Hero Section — UntitledUI Light Theme Variants

> **Section:** Hero
> **Variants:** 5 (generated in a single call)
> **Design System:** UntitledUI Light Theme
> **Framework:** TIDD-EC + Prompt Improver principles
> **Separator:** `---VARIANT-SEPARATOR---`
> **Output:** 5 complete HTML files, raw (no markdown fences)

## Prompt

---

### ROLE

You are a senior front-end engineer specializing in design-system-to-CSS translation, with deep expertise in UntitledUI's light-theme token architecture. You think from three perspectives simultaneously:

1. **Prompt Engineering**: Maximizing structural variety across 5 outputs — each variant must use a fundamentally different information architecture
2. **AI Interpretation**: Ensuring each HTML file is unambiguous, self-contained, and requires zero external dependencies beyond Google Fonts
3. **End-User Design**: Creating polished, production-ready layouts that showcase UntitledUI's signature aesthetic — clean whites, purple brand accents, skeumorphic shadows, and precise typography

### TASK

Generate 5 structurally distinct **Hero** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for the hero/header area.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: container strategy (centered vs. split vs. full-width), grouping logic (stacked vs. columnar vs. asymmetric), emphasis model (text-first vs. icon-first vs. action-first), navigation treatment (breadcrumbs vs. badges vs. status bar).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern (circular, brand-colored) to anchor visual entry points
- Use Badge Pill pattern for version labels, status indicators, categories
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for code/commands
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<header>`, `<details>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate (buttons, cards)
- Target 600–900 lines per variant for rich, production-quality layouts
- Use Background Grid Pattern as subtle decorative element where appropriate

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes (`class="bg-white p-4 rounded-lg"`)
- No React/JSX syntax (`className=`, `onClick=`, `{variable}`)
- No external icon fonts or CDN icon libraries (FontAwesome, Material Icons, etc.)
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)
- No `setInterval`, `requestAnimationFrame`, or DOM manipulation

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Featured Icon Masthead:**
Centered layout with a Featured Icon (brand theme, lg size) above a `display-lg` heading. Supporting paragraph in `--text-secondary`. Dual CTA buttons below (primary brand + secondary outline). Badge pill for version/status positioned above the heading. Background grid pattern as subtle decoration behind the entire section. Generous vertical padding (`--space-24` top/bottom).

**Seed 2 — Split Brand Panel:**
Two-column layout. Left column: `--bg-brand-section` (dark purple) background with white text, large icon, and a brief tagline. Right column: white background with heading, multi-line description, and a vertical stack of 3 action cards (each card: icon + title + description + arrow link). Creates high-contrast visual drama. The left panel is ~40% width, right is ~60%.

**Seed 3 — Breadcrumb Navigator:**
Minimal top bar with breadcrumb trail (Home / Docs / Section Name) using `--text-tertiary` + chevron separators. Below: centered `display-lg` heading with subtle letter-spacing, a metadata row (version badge, last-updated date, author avatar placeholders as colored circles), and a single prominent CTA button. Clean, documentation-focused. White background throughout.

**Seed 4 — Announcement Bar + Hero:**
Top announcement strip: `--bg-brand-primary` (brand-50) background, Brand badge pill, announcement text, dismiss "X" icon. Below: centered hero section with `display-xl` heading where one key word has `--text-brand-secondary` color accent. Search/command input field (with icon and placeholder text) below heading. Trust indicators row at bottom (4 logos or metric badges in a horizontal line). Vertical rhythm with clear section boundaries.

**Seed 5 — Dashboard Header:**
Horizontal layout — left cluster: Featured Icon (outline variant) + title + subtitle stacked. Center area: row of 3–4 status badges (success/warning/error badge pills with dot indicators). Right area: action button group (primary + secondary + icon-only button). Below this header bar: full-width description paragraph with `border-top` separator (`--border-secondary`). Data-dense, operations-oriented, compact vertical footprint.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
