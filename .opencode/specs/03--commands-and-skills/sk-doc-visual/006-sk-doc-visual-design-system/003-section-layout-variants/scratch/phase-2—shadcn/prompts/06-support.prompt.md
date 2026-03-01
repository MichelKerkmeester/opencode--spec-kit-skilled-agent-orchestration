# Support Section — Shadcn Zinc Light Theme Variants

> **Section:** Support
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

Generate 5 structurally distinct **Support** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for troubleshooting, help, FAQ, and support areas.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: help model (self-service vs. guided vs. escalation), content structure (flat vs. hierarchical vs. decision-tree), interaction pattern (browse vs. search vs. triage), density (sparse overview vs. detailed reference).

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
- Use status tokens (`--success`, `--warning`, `--destructive`, `--info`) for severity indicators

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

**Seed 1 — Issue Triage Table:**
Full-width table for issue lookup. Top: section heading + search input with icon. Table columns: Error Code (monospace), Severity (badge — destructive/warning/info), Description, Resolution. 8 rows of common issues. Rows with expandable `<details>` showing extended resolution steps and code blocks. Severity badges color-coded using status tokens. `border-b` between rows, `hover:bg-muted/50`. Pagination row below with outline buttons.

**Seed 2 — FAQ Accordion:**
Question-and-answer layout using `<details>/<summary>` accordion. Grouped into 3 categories (e.g., "Installation", "Configuration", "Runtime") with category headings and separator lines between groups. Each question: summary with chevron icon, expanded answer with prose and optional code snippet. 4 questions per category (12 total). Clean vertical flow with generous spacing between groups. Section heading + "Frequently asked questions" description at top.

**Seed 3 — Escalation Ladder:**
3 cards arranged horizontally, representing escalation levels: "Self-Service" → "Community" → "Priority Support". Cards connected by arrow indicators (inline SVG right-arrow between cards). Each card: ring-1 elevation, increasing ring opacity (0.1 → 0.15 → 0.2) to visually show escalation. Card content: icon, level title, description, list of included resources, and a CTA button (ghost → outline → default variants, escalating prominence). Section heading above.

**Seed 4 — Knowledge Base Grid:**
4-column category grid. Top: section heading + full-width search bar (`input` with search icon). 4 category cards in a row: "Getting Started", "API Reference", "Troubleshooting", "Best Practices". Each category card: ring-1 elevation, icon in muted circle, category title, brief description, article count badge (`badge--secondary`, e.g., "12 articles"), and 3-4 article title links below. Clean, navigable knowledge base entry point.

**Seed 5 — Diagnostic Flowchart:**
Decision-tree layout for troubleshooting. Starts with a question card at top ("What issue are you experiencing?"). Below: 3 option cards in a row, each representing a symptom category. Connector lines (CSS borders) from top card down to option cards. Each option card leads to a nested card below it with a specific resolution — containing a code block and an alert with the fix. Tree structure using CSS Grid. 3 levels deep. Badge labels on connector lines.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
