# Extensibility Section — UntitledUI Light Theme Variants

> **Section:** Extensibility
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

Generate 5 structurally distinct **Extensibility** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants present plugin/extension/API information but explore radically different layout strategies for developer-facing extensibility documentation.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: content type (catalog vs. reference vs. diagram vs. registry vs. timeline), navigation model (sidebar vs. grid vs. sequential), code emphasis (examples-first vs. schema-first vs. narrative), developer audience (plugin author vs. API consumer vs. system architect).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern to anchor plugin entries, API endpoints, and architecture modules
- Use Badge Pill pattern for versions, HTTP methods (GET/POST/PUT/DELETE), status, categories
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for code, API paths, hook names, and package names
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<details>`, `<summary>`, `<table>`, `<code>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate
- Target 600–900 lines per variant for rich, production-quality layouts
- Use Code Block pattern for API examples, hook implementations, and CLI commands

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes
- No React/JSX syntax
- No external icon fonts or CDN icon libraries
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Plugin Catalog:**
Card grid (2×3) of plugin/extension entries. Each card: Featured Icon (light theme) at top-left, plugin name (semibold), author name in `--text-tertiary`, short description (2 lines), version badge pill, and an "Install" button (primary, sm size). Above the grid: full-width search bar + category filter dropdown buttons (All / Official / Community). Left sidebar (~20% width, optional): category list with counts. Cards use `--shadow-sm`, `--radius-xl`, hover to `--shadow-md` and `--border-primary`. Section header: "Plugin Marketplace" + "N extensions available" subtitle.

**Seed 2 — API Reference Table:**
Two-panel layout. Left sidebar (~30% width): scrollable endpoint list grouped by resource (Users, Projects, Settings). Each group: heading + indented endpoint list (method badge pill + path). Selected endpoint has `--bg-brand-primary` background. Right panel (~70% width): selected endpoint detail — method badge (GET = success-green, POST = brand-purple, PUT = warning-yellow, DELETE = error-red) + full path in monospace, description paragraph, parameters table (name, type, required badge, description), and response example in a Code Block. Clean border between panels.

**Seed 3 — Architecture Diagram:**
CSS-only block diagram visualization centered in the section. Boxes representing core modules (Core Engine, Plugin Manager, Event Bus, API Gateway, Storage Layer) arranged in a layered grid using CSS Grid/Flexbox. Boxes use `--bg-primary` with `--border-secondary`, connected by lines (created using borders on pseudo-elements). Labels on connections showing data flow direction ("events", "requests", "callbacks"). Legend in top-right corner mapping box colors to module types. Section header above: "System Architecture" title + description. Each module box: Featured Icon (sm) + module name + 1-line role description.

**Seed 4 — Hook Registry:**
Full-width table: hook name (monospace, `--text-brand-secondary`), trigger event description, parameters (monospace, comma-separated), return type. Rows grouped by lifecycle phase (Initialization, Runtime, Cleanup) with group header rows that span full width — each header has a Featured Icon + phase name + hook count. Expandable rows via `<details>` showing code example in a Code Block for each hook. Table uses `--border-secondary` borders, sticky header row, alternating `--bg-secondary` backgrounds. "Registry" title with total hook count badge.

**Seed 5 — Extension Lifecycle:**
Vertical timeline with 6 steps: Scaffold → Develop → Test → Package → Publish → Update. Each step: numbered circle marker (brand-colored for current/completed, gray for future) connected by a dotted vertical line (`border-left: 2px dashed var(--border-secondary)`). Step content: title in semibold, description paragraph, and a Code Block with the relevant CLI command or code snippet. Current/active step has `--shadow-md` card treatment with `--border-brand` left accent. Completed steps show success checkmark icon instead of number. Section header: "Build Your First Extension" + estimated time badge.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
