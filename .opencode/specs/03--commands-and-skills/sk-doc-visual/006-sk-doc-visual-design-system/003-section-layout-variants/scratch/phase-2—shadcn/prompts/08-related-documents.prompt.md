# Related Documents Section — Shadcn Zinc Light Theme Variants

> **Section:** Related Documents
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

Generate 5 structurally distinct **Related Documents** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for linking to related resources, documentation navigation, and content discovery areas.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: navigation model (grid vs. list vs. tree vs. path), discovery style (browse vs. curated vs. algorithmic-feel), grouping strategy (by type vs. by topic vs. by difficulty vs. by dependency), visual density (card-heavy vs. text-link vs. icon-driven).

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

**Seed 1 — Document Card Grid:**
3-column card grid. Top: section heading + a row of filter buttons (`badge--secondary` style, clickable-looking: "All", "Guides", "API", "Tutorials", "Reference"). 9 document cards (3×3), each with ring-1 elevation: document type icon (inline SVG — book, code, wrench, etc.) in a muted circle, document title as link, category badge (`badge--outline`), one-line description in `--muted-foreground`, and reading time estimate. Cards hover: ring strengthens. Browse pattern.

**Seed 2 — Learning Path Stepper:**
Horizontal numbered path. 6 circles connected by lines, numbered 1-6, representing progressive learning stages. Active/completed circles filled with `--primary`, upcoming as ring-only. Below each circle: a vertical card showing the stage content — title, description, difficulty badge (Easy/Medium/Advanced using success/warning/destructive colors), prerequisite list, and 2-3 document links. Current stage card is larger/emphasized. Left-to-right progression path.

**Seed 3 — Category Shelf:**
Horizontal scrollable shelves (3-4 shelves stacked vertically). Each shelf: category heading on the left, then a horizontal row of document cards that extends beyond the viewport with CSS `overflow-x: auto` and `scroll-snap-type: x mandatory`. Each card: ring-1 elevation, fixed width, type icon, title, description snippet. Left and right fade gradients (using `mask-image: linear-gradient(...)`) at shelf edges to hint at scrollability. Netflix/Spotify shelf pattern.

**Seed 4 — Dependency Tree:**
CSS-only tree visualization showing document relationships. Root node at top, branches down to 2-3 child nodes, which branch further to leaf nodes. Each node: a small card (ring-1 elevation) with document title, type badge, and status dot (green = up-to-date, yellow = needs review, red = outdated). Connection lines using CSS borders. 3 levels deep, ~12 nodes total. Shows which documents depend on which. Section heading + legend above.

**Seed 5 — Multi-Column Link Footer:**
Full-width section with `hsl(var(--muted) / 0.5)` background. 4 columns of categorized links. Each column: category heading with a thin underline accent (`2px solid hsl(var(--primary))`), followed by 5-6 document links. Each link: title text with hover underline, optional badge (`badge--outline`) for "New" or "Updated" items. Below the 4 columns: a separator and a row with "View all documentation" button (outline variant) centered. Footer-style navigation pattern.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
