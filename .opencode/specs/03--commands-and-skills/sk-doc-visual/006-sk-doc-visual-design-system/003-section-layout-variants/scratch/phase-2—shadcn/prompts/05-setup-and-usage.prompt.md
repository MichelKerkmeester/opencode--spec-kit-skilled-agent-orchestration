# Setup & Usage Section — Shadcn Zinc Light Theme Variants

> **Section:** Setup & Usage
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

Generate 5 structurally distinct **Setup & Usage** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for configuration, setup instructions, and usage documentation areas.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: revelation strategy (all-at-once vs. progressive vs. on-demand), code vs. prose ratio (heavy code vs. narrative vs. balanced), configuration model (form-like vs. file-based vs. wizard), reference style (inline vs. sidebar vs. tabbed).

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

**Seed 1 — Progressive Disclosure Accordion:**
5 collapsible sections using `<details>/<summary>` accordion pattern. At the top: a thin progress bar made of 5 segments — filled segments use `hsl(var(--primary))`, unfilled use `hsl(var(--muted))`. Each accordion section: numbered title, prose description, code block with config snippet, and a small alert with a tip or warning. Sections cover: Prerequisites, Installation, Configuration, First Run, Verification. Vertical flow, one section at a time.

**Seed 2 — Config Wizard Flow:**
Multi-step wizard layout. At top: horizontal progress dots (5 dots with labels beneath, active dot filled with `--primary`, completed dots with checkmarks, upcoming dots as rings). Below: the "current step" card (ring-1 elevation, large) showing 3 option cards arranged as a row. Each option card: radio-selection style (ring-1 border, active card gets `--primary` border), icon, title, description. Below options: "Back" (ghost) and "Continue" (default) buttons. Wizard-like progressive setup.

**Seed 3 — Environment Matrix Table:**
Full-width table showing configuration across environments. Column headers: Setting, Development, Staging, Production — each environment column has a badge. Rows (~10): config keys in monospace (`--font-mono`) in the first column, values in subsequent columns. Sensitive values (passwords, API keys) shown as `••••••••` with a muted tint background (`hsl(var(--warning-muted))`). Below table: a code block showing a sample `.env` file. Section heading + description above.

**Seed 4 — Recipe Cards:**
3-column card grid. Each card represents a "recipe" or use-case configuration. Card content: title, difficulty indicator (1-3 filled dots), estimated time badge (`badge--outline`, e.g., "5 min"), brief description, and an expandable `<details>` section containing step-by-step instructions with code blocks. 6 cards total (2 rows of 3). Cards use ring-1 elevation. Section heading + "Choose a recipe to get started" description above.

**Seed 5 — Two-Column Prose + Code:**
Side-by-side layout. Left column (50%): narrative prose with headings, paragraphs, alert callouts, and bulleted lists explaining configuration concepts. Right column (50%): sticky-positioned code blocks showing corresponding config files and commands. The right column scrolls independently, keeping the relevant code visible alongside the prose. 5 sections of paired prose+code. Separator between sections. Documentation-manual style.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
