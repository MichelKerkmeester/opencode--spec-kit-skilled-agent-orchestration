# Related Documents Section — UntitledUI Light Theme Variants

> **Section:** Related Documents
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

Generate 5 structurally distinct **Related Documents** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants present links to related documentation but explore radically different layout strategies for document navigation, discovery, and cross-referencing.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: discovery model (browse vs. search vs. path vs. graph), grouping strategy (by type vs. by topic vs. by difficulty vs. by dependency), navigation pattern (grid vs. list vs. shelf vs. tree), metadata emphasis (reading time vs. prerequisites vs. last-updated vs. difficulty level).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern to represent document types (guide, reference, tutorial, API doc)
- Use Badge Pill pattern for document type labels, difficulty levels, reading time, status
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for file paths and version identifiers
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<details>`, `<summary>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate
- Target 600–900 lines per variant for rich, production-quality layouts
- Use link/navigation patterns — arrow icons, hover underlines, card click targets

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes
- No React/JSX syntax
- No external icon fonts or CDN icon libraries
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Document Hub:**
3-column grid of document link cards. Each card: document type icon (Featured Icon — different icon per type: book for guide, code for reference, graduation-cap for tutorial), document title in semibold, 1-line description in `--text-secondary`, metadata row with last-updated date and reading time badge pill. Above the grid: horizontal tab-style category filters (All / Guides / References / Tutorials / API Docs) using pill-shaped buttons — selected tab is `--bg-brand-solid` + white text. Cards use `--shadow-sm`, `--radius-xl`, full card clickable (via `<a>` wrapping). Hover: `--shadow-md` + `--border-primary`.

**Seed 2 — Learning Path:**
Linear path visualization: numbered circles (1–6) connected by a horizontal line. Each circle is a step in the learning journey. The current/active circle uses `--bg-brand-solid` + white number; completed circles use `--bg-success-primary` + checkmark; future circles use `--bg-secondary` + gray number. Below each circle: document title, 1-line description, prerequisite badge (if any, showing dependency), and difficulty badge (Beginner/Intermediate/Advanced using success/warning/brand colors). The current step has a larger card treatment with `--shadow-md`. Responsive: wraps to vertical on narrow viewports.

**Seed 3 — Category Shelf:**
Horizontal shelves stacked vertically (one shelf per category). Each shelf: category heading with Featured Icon and document count badge, then a horizontal row of compact document cards. Cards: small type icon + title + type badge pill. The row extends beyond viewport with overflow behavior (CSS `overflow-x: auto` with scroll snap). Subtle fade gradients at the left/right edges of each shelf (using CSS `mask-image: linear-gradient`). 4–5 shelves: Getting Started, Core Concepts, API Reference, Tutorials, Community. Each shelf has 4–6 cards.

**Seed 4 — Dependency Graph:**
Tree/graph visualization using nested CSS boxes. Root document ("Project Overview") at the top center, with child documents branching below connected by vertical + horizontal lines (created with `::before`/`::after` borders). Each node: compact card with title, type badge pill, and a status indicator (green dot = up-to-date, yellow = needs review, gray = draft). 2–3 levels deep. Lines use `--border-secondary`. Active/current document node highlighted with `--border-brand` + `--shadow-md`. Section header: "Document Map" + "Understanding dependencies between docs" subtitle.

**Seed 5 — Quick Links Footer:**
Multi-column footer-style layout (4 columns). Each column: category heading in `--text-primary` semibold with underline accent, then a vertical list of document links. Each link: small arrow-right icon + document title — hover changes to `--text-brand-secondary` + underline. Bottom row spanning full width: version info in `--text-tertiary` monospace, "Last generated" date, and export/print links. Background uses `--bg-secondary` for the entire section to differentiate it from main content. Clean, dense, reference-oriented layout.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
