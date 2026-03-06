# Operations Overview Section — UntitledUI Light Theme Variants

> **Section:** Operations Overview
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

Generate 5 structurally distinct **Operations Overview** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants present operational/monitoring information but explore radically different layout strategies for dashboards, status views, and operational data.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: data presentation (cards vs. tables vs. timelines), status visualization (badges vs. bars vs. dots), metric emphasis (large numbers vs. progress indicators vs. trend arrows), temporal model (real-time view vs. historical log vs. SLA report).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern to anchor status cards and metric groups
- Use Badge Pill pattern extensively for status (success/warning/error), severity, and categories
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for timestamps, metrics, IDs, and code
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<table>`, `<details>`, `<summary>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate
- Target 600–900 lines per variant for rich, production-quality layouts
- Use error/warning/success color scales for operational status indicators

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes
- No React/JSX syntax
- No external icon fonts or CDN icon libraries
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Status Dashboard:**
Header area with "System Status" heading + a large overall status indicator (green success badge with dot, e.g., "All Systems Operational"). Below: 3 status cards in a row. Each card: service name (API, Database, CDN), Featured Icon (colored by status), uptime percentage in `display-xs`, latency metric in `--text-tertiary`, and a mini status timeline (7 small dots in a row — green/yellow/red representing last 7 periods). Cards use `--shadow-sm`, `--border-secondary`. Footer: "Last updated" timestamp in monospace.

**Seed 2 — Workflow Rail:**
Vertical left rail (~25% width) with workflow step icons connected by a continuous vertical line (`--border-secondary`). Each step: Featured Icon (completed = success, current = brand, pending = gray) + step name. The current/selected step has `--bg-brand-primary` background highlight. Right panel (~75% width): expanded detail view of the selected step — title, description, metadata table (key-value pairs with monospace values), and an action button. Progress indicator at the very top showing "Step 3 of 6" with a colored bar.

**Seed 3 — Audit Log Table:**
Full-width table with columns: Timestamp (monospace, `--text-tertiary`), Actor (name + avatar circle), Action (verb description), Resource (monospace ID), Status (badge pill — success/warning/error). Filter bar above the table: search input with icon + dropdown filter buttons. Table rows use `--bg-primary` with `--border-secondary` cell borders. Alternating row backgrounds (`--bg-secondary` on even rows). Pagination footer: "Showing 1–10 of 247" + page number links. Sortable column headers with up/down arrow icons.

**Seed 4 — SLA Grid:**
2×2 grid of SLA metric cards, each prominently displaying: metric name ("Uptime", "Response Time", "Error Rate", "Throughput"), current value in `display-lg` (large, bold), target threshold below in `--text-tertiary` ("Target: 99.9%"), a progress bar (CSS-only: colored bar inside a `--bg-tertiary` track — green if meeting target, yellow if close, red if breaching), and a trend arrow icon (up-green or down-red). Cards use `--shadow-sm`, `--radius-xl`. Section header with "SLA Performance" title + date range badge.

**Seed 5 — Incident Timeline:**
Reverse-chronological vertical timeline. Left side: timestamps (date + time, monospace). Right side: event cards connected by a vertical line with circular dot markers. Each event card: severity badge pill (error-red for critical, warning-yellow for degraded, success-green for resolved), event title in semibold, description paragraph, and duration badge ("Duration: 23m"). The vertical connecting line uses `--border-secondary` with `--fg-brand-primary` dot markers at each node. Most recent event at top with `--shadow-md` emphasis.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
