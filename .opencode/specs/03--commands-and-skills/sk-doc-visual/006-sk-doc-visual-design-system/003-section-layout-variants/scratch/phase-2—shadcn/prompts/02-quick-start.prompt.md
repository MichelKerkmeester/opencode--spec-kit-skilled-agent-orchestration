# Quick Start Section — Shadcn Zinc Light Theme Variants

> **Section:** Quick Start
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

Generate 5 structurally distinct **Quick Start** section layouts using the Shadcn Zinc design system vocabulary provided in the CONTEXT below. Each variant must be a complete, standalone HTML file (600–900 lines). All 5 variants belong to the same documentation site but explore radically different layout strategies for a getting-started/quick-start guide area.

### CONTEXT

**[The Master Template CSS vocabulary (00-master-template.prompt.md) is injected here by the runner before this prompt. It contains: full `:root` token vocabulary with bare HSL triplets, component CSS recipes (Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd), base styles, HTML boilerplate, and self-validation checklist.]**

### INSTRUCTIONS

**Phase 1 — INTERNALIZE:** Read all CSS custom properties from the injected master template. Note the critical differences from other design systems: colors are bare HSL triplets applied via `hsl(var(--token))`, opacity uses `hsl(var(--token) / 0.1)` format, elevation uses `ring-1` pattern (`0 0 0 1px hsl(var(--foreground) / 0.1)`), radii are calc-based from `--radius` base, buttons have NO `::before` pseudo-elements, and there is NO Background Grid Pattern.

**Phase 2 — DIVERGE:** For each of the 5 DNA seeds below, choose a fundamentally different information architecture. Consider: progression model (linear vs. branching vs. parallel), code presentation (inline vs. terminal vs. tabbed), step visualization (numbered vs. timeline vs. checklist), density level (sparse guide vs. dense reference).

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

**Seed 1 — Numbered Card Rail:**
4 step cards in a horizontal row connected by thin lines (1px `--border` color). Each card has ring-1 elevation, a numbered circle (badge--default, round) at top, a step title, description paragraph, and a code block showing the terminal command for that step. Cards are equal width. A connecting line runs between the numbered circles. Below the rail: a final "Next Steps" link row. Linear, scannable progression.

**Seed 2 — Accordion Steps:**
5 accordion items (`<details>/<summary>`) stacked vertically. At the top: a row of 5 small progress dots — filled dot for completed steps, ring-only for upcoming. Each accordion trigger shows a numbered badge (`badge--secondary`) + step title. Expanded content contains: prose description, a code block, and a small alert callout with a tip. First accordion open by default. Clean vertical flow.

**Seed 3 — Split Pane Guide:**
Two-panel layout. Left panel (35% width): sticky step list showing all 5 steps as a vertical nav — each step has a number, title, and "active" state indicated by `--primary` left border + bold text. Right panel (65%): scrollable detail area showing the active step's content — heading, description, code block, and a small "Prerequisites" badge list. The left nav highlights the current step. Documentation-style sidebar pattern.

**Seed 4 — Environment Tabs:**
CSS-only tab interface using `<details>` elements styled as tabs. 4 tab triggers (macOS / Linux / Windows / Docker) in a horizontal row with bottom-border active indicator using `--primary` color. Each tab panel contains: a prerequisite checklist (checkbox-style list items with status indicators), environment-specific install commands in code blocks, and a verification step. Below tabs: a shared "Verify Installation" section with a single code block and expected output.

**Seed 5 — Terminal Walkthrough:**
Terminal-window-inspired layout. A terminal header bar (muted bg, three small colored dots, title text) at the top. Below: alternating blocks of light prose (white bg, description text) and dark code blocks (foreground-color bg, monospace). 5 steps flow top-to-bottom. Each prose block has a step number label (badge--outline), description, and optional alert callout. Code blocks show commands with `$` prompts and expected output in muted color. Linear, developer-focused tutorial.

### OUTPUT FORMAT

Output exactly 5 complete HTML files. Separate each with a line containing only:

---VARIANT-SEPARATOR---

Do not wrap in markdown code fences. Output raw HTML directly.
Each file must be a complete `<!DOCTYPE html>` document following the boilerplate skeleton from the master template.
