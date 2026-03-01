# Quick Start Section — UntitledUI Light Theme Variants

> **Section:** Quick Start
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

Generate 5 structurally distinct **Quick Start** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants guide users through initial setup steps but explore radically different layout strategies for onboarding/getting-started content.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: step visualization (numbered cards vs. checklist vs. tabs), code presentation (dark blocks vs. inline snippets vs. terminal windows), progression model (linear vs. branching vs. parallel), interaction pattern (`<details>/<summary>` vs. static vs. scrollable).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern (circular, brand-colored) to anchor card/section entry points
- Use Badge Pill pattern for step numbers, status indicators, environment labels
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for code/commands
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<details>`, `<summary>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate
- Target 600–900 lines per variant for rich, production-quality layouts
- Use Code Block pattern (dark background, monospace) for terminal commands and code snippets

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes
- No React/JSX syntax
- No external icon fonts or CDN icon libraries
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Stepper Cards:**
Numbered step cards (1-2-3-4) arranged in a horizontal rail with a thin connecting line between them. Each card has: Featured Icon (with step number), title, 2-line description, and a code snippet block (dark background, monospace). The active/current step is highlighted with a `--border-brand` left border or ring. Cards use `--shadow-sm`, hover to `--shadow-md`. Responsive: stacks vertically on narrow viewports via `flex-wrap`.

**Seed 2 — Tabbed Environment:**
Tab bar at the top showing environment options (macOS / Linux / Windows / Docker) styled as pill-shaped buttons. The "selected" tab uses `--bg-brand-solid` + white text; others use `--bg-secondary` + `--text-secondary`. Below the tabs: a prerequisites checklist (items with check/circle icons) and an install command in a Code Block. Uses `<details>/<summary>` for CSS-only tab-like expand/collapse behavior. Each environment section has distinct install commands.

**Seed 3 — Checklist Flow:**
Vertical checklist where each item has a checkbox-style icon (success-green circle-check for completed, gray circle for pending). Each item can expand (via `<details>`) to reveal: command in a Code Block, expected output in a lighter code area, and a "What this does" explanation paragraph. A progress bar at the top of the section shows percentage completion (CSS-only, using a colored bar inside a track). Clean vertical flow with connecting dotted line between items.

**Seed 4 — Command Palette:**
Central search-like input field ("Type a command…") with a magnifying glass icon, styled with `--border-primary` border, `--shadow-sm`, and `--radius-xl`. Below: a dropdown-style list of quick-start commands. Each command row: left icon (Featured Icon, sm), command name in monospace, brief description, and a keyboard shortcut badge pill (e.g., `⌘K`). Terminal-inspired information density but rendered in UntitledUI's light theme aesthetic. Grouped by category with subtle dividers.

**Seed 5 — Split Pane Guide:**
Two-panel layout. Left panel (~35% width): scrollable step list with numbered items (compact: number badge + title only). The current step has `--bg-brand-primary` background highlight and `--border-brand` left accent. Right panel (~65% width): detail area showing the selected step's full content — description paragraph, Code Block with command, expected output area (lighter bg), and a "Next step" link at the bottom. The left panel is sticky on scroll. Clean border between panels.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
