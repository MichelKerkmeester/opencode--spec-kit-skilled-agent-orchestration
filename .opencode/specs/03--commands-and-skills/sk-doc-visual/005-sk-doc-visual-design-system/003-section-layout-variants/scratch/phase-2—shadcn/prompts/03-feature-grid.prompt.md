# Feature Grid Section — Shadcn Zinc Light Theme Variants

> **Section:** Feature Grid
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

Generate 5 structurally distinct **Feature Grid** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for showcasing features and capabilities.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: grid strategy (uniform vs. bento vs. list), visual anchors (icons vs. numbers vs. images), information density (sparse highlight vs. dense comparison), grouping model (flat vs. categorized vs. hierarchical).

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

**Seed 1 — Clean Card Grid:**
3×2 uniform card grid (6 cards total). Each card: ring-1 elevation (`0 0 0 1px hsl(var(--foreground) / 0.1)`), `--radius-xl` corners, `--space-6` padding. Card content: icon in a muted circle container (`hsl(var(--muted))` bg, `--radius-lg`), title in `--font-medium`, description in `--muted-foreground`. On hover: ring strengthens to `hsl(var(--foreground) / 0.2)` with transition. Section heading + description above the grid. Equal gap between cards using `--space-6`.

**Seed 2 — Asymmetric Bento:**
CSS Grid with mixed sizes — one large "hero" card (spans 2 columns, 2 rows) containing a metric number + chart-color accent + description, surrounded by 3 smaller equal-sized cards. The large card has a prominent stat (e.g., "99.9% Uptime") in `--text-4xl` with `--tracking-tight`. Small cards each have: icon, title, short description. All cards use ring-1 elevation. Bento-box layout creates visual interest through size contrast. Section heading above.

**Seed 3 — Horizontal Band List:**
No cards — horizontal alternating bands instead. 6 feature entries as full-width rows. Odd rows: white bg. Even rows: `hsl(var(--muted) / 0.5)` bg. Each row: left icon in muted circle, center title + description, right badge (`badge--secondary`) showing a category label. Single-row scan pattern — each feature entry is one horizontal line. A separator at top and bottom of the band list. Section heading + description above.

**Seed 4 — Feature Comparison Table:**
Full-width table component. Header row: 4 columns (Feature, Free, Pro, Enterprise). Each tier column has a badge at top (`badge--outline`, `badge--default`, `badge--secondary`). Feature rows (~8 rows): feature name in first column, checkmark (inline SVG) or dash for availability in tier columns. The "Pro" column has a `badge--default` "Recommended" label in the header. Rows use `border-b` + hover `bg-muted/50`. Clean, data-driven comparison.

**Seed 5 — Icon Grid with Categories:**
No cards — typography-only layout grouped by category. 3 category sections, each with: a category heading with a thin line extending to the right (`border-b` with `--border` color), then 2-column entries below. Each entry: small inline SVG icon + title + one-line description, all in a single row. Compact, scannable. Categories might be "Core", "Integrations", "Developer Tools". Section heading + description at top. Whitespace between categories creates grouping.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
