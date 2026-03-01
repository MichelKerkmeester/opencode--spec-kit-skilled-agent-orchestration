# Setup & Usage Section — UntitledUI Light Theme Variants

> **Section:** Setup & Usage
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

Generate 5 structurally distinct **Setup & Usage** section layouts using the UntitledUI design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants present configuration/setup information but explore radically different layout strategies for installation guides, configuration references, and usage documentation.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary, component CSS recipes (Featured Icon, Badge, Card, Button, Code Block, Background Pattern, Divider), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the semantic naming pattern (`--bg-primary`, `--text-secondary`, `--border-primary`, `--shadow-sm`, `--radius-xl`, `--space-4`, etc.). Understand the component recipes: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Code Block.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: disclosure model (accordion vs. wizard vs. matrix), code emphasis (dominant vs. supporting vs. contextual), navigation style (sequential vs. random-access vs. filterable), content density (verbose tutorial vs. compact reference vs. interactive guide).

**Phase 3 — BUILD:** Construct each variant as a complete HTML file with all CSS inline in a `<style>` block. Use ONLY `var(--token)` references for colors, spacing, typography, shadows, and radii — never raw hex/rgb values outside the `:root` block. Include the full `:root` token vocabulary, base styles, and relevant component recipes in each file.

**Phase 4 — SELF-VALIDATE:** Before outputting, verify each variant passes every item in the self-validation checklist. Fix any violations. Confirm: light background, dark text, semantic HTML, required meta tags, reduced-motion query, no JavaScript, no Tailwind, no React, no external icon CDN.

### DO'S

- Use `var(--shadow-*)` for elevation and depth hierarchy (cards, buttons, hover states)
- Use Featured Icon pattern to anchor configuration sections and step headers
- Use Badge Pill pattern for environment labels, difficulty levels, required/optional indicators
- Follow 8px spacing grid via `var(--space-*)` tokens consistently
- Use Inter for all body/display text, Roboto Mono for code, commands, config keys, and file paths
- Use inline SVG icons (Lucide-style: 24×24, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`)
- Use semantic HTML (`<section>`, `<article>`, `<details>`, `<summary>`, `<table>`, `<code>`)
- Include `@media (prefers-reduced-motion: reduce)` query
- Include `<meta name="color-scheme" content="light dark">`
- Use `::before` / `::after` for decorative skeumorphic borders where appropriate
- Target 600–900 lines per variant for rich, production-quality layouts
- Use Code Block pattern extensively for terminal commands and configuration snippets

### DON'TS

- No dark backgrounds as primary (`body`/`section` bg must resolve to white or near-white)
- No Tailwind utility classes
- No React/JSX syntax
- No external icon fonts or CDN icon libraries
- No raw hex/rgb values outside the `:root` block — use `var()` references only
- No neon glows, particle effects, parallax scrolling, or 3D transform effects
- No JavaScript (`<script>`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

### EXAMPLES — 5 Structural DNA Seeds

**Seed 1 — Progressive Disclosure:**
5 collapsible sections using `<details>/<summary>`: Prerequisites, Installation, Configuration, First Run, Verification. Each `<summary>` has: numbered badge (1–5), section title in semibold, and a chevron-down icon that implies expandability. When expanded, content shows: description paragraph, Code Block with commands, expected output area (lighter `--bg-secondary` background), and a success indicator ("You should see: ✓ ..."). Numbered headers use Featured Icons (brand). Vertical flow with subtle connecting line between sections.

**Seed 2 — Config Wizard:**
Multi-step card layout (showing "Step 2 of 4" indicator at top with progress dots). The current step card displays: step label + description, then a set of option cards arranged as radio-style selections. Each option card: title, description, and the selected option has `--border-brand` border + `--bg-brand-primary` background. Below: Back / Next buttons (secondary + primary). Previous/completed steps shown as collapsed summary cards above the active step. Clean wizard progression flow.

**Seed 3 — Environment Matrix:**
Full-width table with environments as columns (Development, Staging, Production) and configuration keys as rows. Column headers have environment badge pills and a Featured Icon. Cell content shows config values in monospace with a subtle copy-indicator icon. Production column highlighted with `--bg-error-primary` tint on sensitive values. Highlighted differences across environments use bold + colored text. Table uses `--border-secondary` cell borders, sticky header row. Footer with "Environment-specific notes" expandable section.

**Seed 4 — Recipe Cards:**
3-column grid of "recipe" cards. Each card: category badge pill at top (e.g., "Authentication", "Database", "Deployment"), recipe title in semibold, ingredient/requirements list (bulleted, compact), difficulty indicator (1–3 filled dots using brand/gray colors), estimated time badge ("~5 min"), and an expandable instructions section via `<details>`. Cards use `--shadow-sm`, `--radius-xl`, hover to `--shadow-md`. Section header with "Setup Recipes" title + filter description.

**Seed 5 — Terminal Walkthrough:**
Full-width terminal-style window at the top: dark header bar with three colored traffic-light dots (using error/warning/success circle SVGs) and a window title. Below the terminal header: alternating blocks of explanation text (light `--bg-primary` background, normal prose) and terminal output (dark `--gray-900` background, monospace green/white text). Step numbers appear in the left margin as small brand-colored circles. Each explanation block has a heading, description, and "What's happening" callout box. Clear visual rhythm between light (explanation) and dark (terminal) sections.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
