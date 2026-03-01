# Operations Overview Section — Shadcn Zinc Light Theme Variants

> **Section:** Operations Overview
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

Generate 5 structurally distinct **Operations Overview** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for operational dashboards, monitoring, and system status areas.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: data presentation (cards vs. tables vs. timelines), metric visualization (numbers vs. bars vs. dots), status indication (badges vs. colors vs. icons), temporal model (snapshot vs. historical vs. real-time style).

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
- Use status tokens (`--success`, `--warning`, `--destructive`, `--info`) for operational indicators

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

**Seed 1 — Health Dashboard:**
Top section: 3 metric cards in a row, each with ring-1 elevation. Each card shows: service name, large metric number (`--text-3xl`), and a row of 7 small status dots (one per day of the week). Green dots use `hsl(var(--success))`, yellow use `hsl(var(--warning))`, red use `hsl(var(--destructive))`. Below cards: a table with 5 service rows showing name, status badge, uptime percentage, and last-checked timestamp. Section heading above everything.

**Seed 2 — Process Flow Rail:**
Vertical workflow visualization. 5 steps connected by a vertical line (1px `--border` color). Each step: a circle marker on the line (filled = complete, ring-only = upcoming, pulsing ring for current). Step content to the right: title, description, and for the current/active step, an expandable details section with additional info and a code block. Status badges indicate step state. Clean vertical progression.

**Seed 3 — Audit Log:**
Full-width table layout. Top: section heading + a search input (`input` component with search icon). Table with 5 columns: Timestamp, Action, User, Resource, Status. 8 data rows with realistic audit entries. Status column uses badges (`badge--success` for "Success", `badge--destructive` for "Failed", `badge--warning` for "Pending"). Below table: pagination row with "Previous" / "Next" outline buttons and page number badges. Dense, data-driven.

**Seed 4 — SLA Metric Cards:**
2×2 grid of metric cards. Each card has ring-1 elevation and contains: metric label in `--muted-foreground`, large metric value (`--text-3xl`), a CSS-only progress bar (thin horizontal bar using `--primary` fill on `--muted` track, width set via inline style percentage), and a trend indicator showing "↑ 2.3%" or "↓ 0.5%" using success/destructive colors. Metrics: Response Time, Uptime, Error Rate, Throughput. Section heading + period selector badges above.

**Seed 5 — Event Timeline:**
Reverse-chronological event list. Left side: timestamps in `--muted-foreground` monospace. Center: vertical connecting line with small circle nodes. Right side: event descriptions in cards (ring-1 elevation). Each event has: severity badge (`badge--success` / `badge--warning` / `badge--destructive`), event title, description text, and a small "View details" link. 6-8 events. Most recent at top. Section heading + filter badges (All / Critical / Warning / Info) above.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
