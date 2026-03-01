# Extensibility Section — Shadcn Zinc Light Theme Variants

> **Section:** Extensibility
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

Generate 5 structurally distinct **Extensibility** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for plugin systems, APIs, extension points, and customization areas.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: discovery model (catalog vs. reference vs. diagram), code presentation (snippets vs. full examples vs. interactive-style), architecture visualization (blocks vs. layers vs. timeline), developer experience (browse vs. build vs. explore).

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
- Use monospace font (`var(--font-mono)`) for code examples, API endpoints, and technical identifiers

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

**Seed 1 — Plugin Catalog Grid:**
3×2 card grid with search + filter UI above. Top: section heading, search input (`input` with search icon), and a row of filter badges (`badge--secondary`: "All", "Official", "Community", "Beta"). 6 plugin cards below, each with ring-1 elevation: plugin icon (muted circle), name, version badge (`badge--outline`), short description, author name in `--muted-foreground`, and an "Install" button (outline variant). Cards hover: ring strengthens. Marketplace/catalog browse pattern.

**Seed 2 — API Reference Split:**
Two-panel layout. Left panel (30% width): vertical sidebar listing API endpoints grouped by category (e.g., "Authentication", "Resources", "Webhooks"). Each endpoint: HTTP method badge (GET = `badge--info`, POST = `badge--success`, DELETE = `badge--destructive`) + path in monospace. Right panel (70%): detail view for a selected endpoint — method + path heading, description, parameters table (Name, Type, Required, Description columns), request code block, response code block. Documentation reference pattern.

**Seed 3 — Architecture Diagram:**
CSS-only block diagram showing system modules. Central "Core" block connected to 4 surrounding extension point blocks via CSS border lines. Each block: ring-1 elevation card with icon, module name, brief description. Connection lines use `1px solid hsl(var(--border))`. Labels on connections (e.g., "hooks", "middleware", "plugins"). Below diagram: a description section explaining the architecture, with inline code references. Visual architecture overview.

**Seed 4 — Hook Registry Table:**
Table-based reference grouped by lifecycle phase. 3 groups: "Initialization", "Runtime", "Shutdown" — each group has a heading row with `--muted` background. Table columns: Hook Name (monospace), Phase (badge), Description, Arguments. 3-4 hooks per group (~10 total). Some rows have expandable `<details>` showing code examples. Below table: an alert with a tip about hook ordering. Section heading + description above. Developer reference pattern.

**Seed 5 — Extension Lifecycle Timeline:**
Vertical 6-step timeline showing the extension development lifecycle: "Scaffold" → "Develop" → "Test" → "Package" → "Publish" → "Maintain". Left side: dashed vertical line (1px dashed `hsl(var(--border))`) with circle markers at each step (numbered badges). Right side: step content cards with title, description, and a code block showing the relevant CLI command or config snippet. Current/active step has a filled marker, others are ring-only. Linear progression.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
