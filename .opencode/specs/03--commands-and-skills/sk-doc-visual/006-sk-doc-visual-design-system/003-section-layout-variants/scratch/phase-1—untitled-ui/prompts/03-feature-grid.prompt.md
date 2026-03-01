# Feature Grid Section — UntitledUI Light Theme Variants

> **Section:** Feature Grid
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

Generate 5 structurally distinct **Feature Grid** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants showcase product features/capabilities but explore radically different layout strategies for presenting feature collections.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: grid strategy (uniform vs. bento vs. masonry), card anatomy (icon-led vs. metric-led vs. description-led), grouping model (flat grid vs. categorized bands vs. comparison table), visual hierarchy (equal weight vs. featured+supporting vs. progressive reveal).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern (circular, brand-colored) to anchor each feature card's entry point
- Use Badge Pill pattern for categories, labels, status indicators
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for code/commands
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<details>`, `<summary>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate
- Target 600–900 lines per variant for rich, production-quality layouts

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes
- No React/JSX syntax
- No external icon fonts or CDN icon libraries
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Icon Feature Cards:**
3×2 grid of equal-sized cards. Each card: Featured Icon (light theme, md size) at top-left, heading in `--text-primary` (font-weight semibold), 2-line description in `--text-secondary`, and a "Learn more →" link in `--text-brand-secondary`. Cards have `--bg-primary` background, `--border-secondary` border, `--shadow-sm`, and `--radius-xl` corners. On hover: `--shadow-md` and border shifts to `--border-primary`. Clean 24px gap between cards. Section header above grid: section badge pill + `display-md` title + supporting text.

**Seed 2 — Metric Bento:**
Bento-box layout with mixed card sizes using CSS Grid. One large card spans 2 columns (has illustration area using Background Grid Pattern + large metric number in `display-xl` + label + description). Four smaller cards in remaining cells (each: Featured Icon sm + metric value in `display-xs` + label in `--text-tertiary`). The primary metric card uses `--border-brand` accent. Small cards use `--bg-secondary` background for subtle differentiation. Section header with badge + title above.

**Seed 3 — Category Bands:**
Horizontal bands alternating between `--bg-primary` and `--bg-secondary` backgrounds. Each band contains: category heading aligned left (with Featured Icon inline), and 3 feature items arranged right in a row. Feature items are compact: icon (inline, 20px) + title (semibold) + one-line description. Bands separated by `--border-tertiary` dividers. Very scannable, information-dense layout. Section header at top with title + "N features across M categories" subtitle.

**Seed 4 — Comparison Table:**
Full-width table with feature rows and plan/tier columns (Free / Pro / Enterprise). Header row: tier names with badge pills, recommended column highlighted with `--bg-brand-primary` background and `--border-brand` top border. Feature rows: feature name (left, with icon) and checkmark/X SVG icons in each column cell. Zebra striping using `--bg-secondary` on alternating rows. Sticky header row. Footer row with CTA buttons per tier. Clean table styling with `--border-secondary` cell borders.

**Seed 5 — Testimonial + Features:**
Top area: centered testimonial quote in `display-sm` italic, with avatar placeholder (colored circle with initials), name, and role below. Decorative quotation mark icon (large, `--fg-quaternary`). Below: horizontal divider, then 4 feature cards in 2×2 grid. Each card: Featured Icon (outline variant) + heading + description. The testimonial provides social proof that anchors the feature claims. Background Grid Pattern behind the testimonial area.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
