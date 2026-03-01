# Support Section — UntitledUI Light Theme Variants

> **Section:** Support
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

Generate 5 structurally distinct **Support** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants present help/support/troubleshooting information but explore radically different layout strategies for FAQs, knowledge bases, escalation paths, and diagnostic content.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: support model (self-service vs. guided vs. escalation), content structure (table vs. accordion vs. cards vs. flow), search prominence (search-first vs. browse-first vs. process-first), severity handling (triage table vs. decision tree vs. lifecycle flow).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern to anchor support categories, channels, and escalation levels
- Use Badge Pill pattern for severity levels (critical/warning/info), response times, categories
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for error codes, commands, and technical identifiers
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<details>`, `<summary>`, `<table>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate
- Target 600–900 lines per variant for rich, production-quality layouts
- Use error/warning/success color scales for severity and status indicators

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes
- No React/JSX syntax
- No external icon fonts or CDN icon libraries
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Triage Table:**
3-column table layout: Issue (description + error code in monospace), Likely Cause (explanation), Resolution (steps + code snippet if applicable). Each row has a severity badge pill in the Issue column (critical = error-red, warning = warning-yellow, info = brand-purple). Search input above the table with magnifying glass icon. Expandable rows via `<details>` for detailed troubleshooting steps when clicked. Table uses `--border-secondary` cell borders, `--bg-secondary` alternating rows. 8–12 representative issue rows.

**Seed 2 — FAQ Accordion:**
Full-width accordion layout using `<details>/<summary>`. Questions grouped under category headers (Getting Started, Configuration, Troubleshooting, Billing). Each category header has a Featured Icon + category name + question count badge. Each `<summary>`: question text in semibold, chevron icon that rotates on open. Answer areas: formatted prose, inline code snippets in `code-inline` style, occasional Code Block for multi-line commands, and "Was this helpful?" prompt at bottom of each answer. Clean vertical spacing between groups.

**Seed 3 — Contact Ladder:**
Escalation path visualization: 3 horizontal cards connected by arrow/chevron icons between them. Card 1: "Self-Service" — book/search icon, description, "Docs & FAQ" resources list, "Instant" response time badge (success-green). Card 2: "Community" — users icon, description, forum/Discord links, "< 24h" response badge (warning-yellow). Card 3: "Direct Support" — headphones icon, description, email/ticket links, "< 4h" response badge (brand-purple). Cards use increasing shadow elevation (xs → sm → md) to suggest escalation progression. Each card: Featured Icon (xl), heading, description, resource links, response time badge.

**Seed 4 — Knowledge Base Grid:**
4-column grid of category cards. Each card: Featured Icon (light theme) at top, category name in semibold, article count badge pill ("12 articles"), 3 top article links (with small arrow icons), and a "View all →" footer link in `--text-brand-secondary`. Full-width search bar spanning the entire grid width above the cards — input with search icon, placeholder "Search knowledge base...", `--shadow-sm`, `--radius-xl`. Section header: "Knowledge Base" title + "Find answers to common questions" subtitle. Cards hover: `--shadow-md`.

**Seed 5 — Support Lifecycle:**
Horizontal process flow with 5 phases: Report → Triage → Investigate → Resolve → Verify. Each phase: Featured Icon (current phase uses brand/dark variant, completed uses success, pending uses gray/outline), phase name below, 2-line description beneath. Phases connected by horizontal arrows/lines (using `--border-secondary`). The currently active phase has larger icon and `--border-brand` bottom accent. Status badges under each phase (e.g., "In Progress", "Completed", "Pending"). Below the flow: a detail card showing the expanded content for the active phase with actions and notes.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
