# Research Synthesis: sk-doc-visual Template Modernization

## Metadata
- Spec folder: `.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates`
- Scope: Compare provided README design system to current `sk-doc-visual` skill docs/references/templates, then produce implementation-ready recommendations.
- Depth: LEAF (no delegation)
- Date: 2026-02-23

## Executive Summary
The provided README design system is a dark brutalist, terminal-ledger interface with a specific token set (`--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border`), Inter + JetBrains Mono typography, 260px sticky sidebar layout, active-dot TOC links, reveal/viz animations, scanline effect, and a live UTC clock. [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:19-26] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:90-97] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:125-159] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:162-210] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:246-257] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:1703-1744]

Current `sk-doc-visual` assets are built around a different light-first `--ve-*` token system, different font policy, and template structures that only partially overlap with the README system. [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:273-277] [SOURCE: .opencode/skill/sk-doc-visual/references/css_patterns.md:23-75] [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/readme-guide.html:16-38]

This is not a cosmetic tweak; it is a framework-level style-system migration that requires coordinated updates to `SKILL.md`, multiple references, all 7 templates, and validator guardrails.

## Evidence-Based Gap Matrix

| Domain | README System | Current Skill System | Impact |
|---|---|---|---|
| Token namespace | `--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border` [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:19-25] | `--ve-*` token contract is mandatory in docs/rules/validator [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:273-275] [SOURCE: .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh:541-558] | Direct incompatibility unless we add aliasing or migrate validator/rules. |
| Typography policy | Inter + JetBrains Mono are canonical [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:12-13] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/context.md:20-28] | Inter is explicitly discouraged/disallowed by skill + validator [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:274] [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:307] [SOURCE: .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh:563-571] | Hard policy conflict. |
| Theme model | README is dark-ledger baseline (no `prefers-color-scheme` dark override block) [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:19-63] | Skill/checklist/validator currently require dual-theme patterns [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:276] [SOURCE: .opencode/skill/sk-doc-visual/references/quality_checklist.md:72-97] [SOURCE: .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh:484-501] | Must choose: strict README parity or maintain dual-theme contract. |
| Navigation layout | 260px sidebar + main grid, sidebar hidden on mobile [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:125-129] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:236-243] | 180-230px sidebar and mobile horizontal TOC in references/templates [SOURCE: .opencode/skill/sk-doc-visual/references/navigation_patterns.md:67-75] [SOURCE: .opencode/skill/sk-doc-visual/references/navigation_patterns.md:153-223] [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/readme-guide.html:145-149] | Template behavior divergence across breakpoints. |
| Component model | Terminal header, glass-card, ledger-line, flow-step, viz bars, scanline [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/context.md:47-196] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:162-257] | Current templates mostly use panel/card system without terminal header/scanline [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/readme-guide.html:185-190] [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/artifact-dashboard.html:180-185] | Requires component library rewrite. |
| Motion + JS behavior | Reveal observer + nav observer + viz-fill animation + UTC clock interval [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:1712-1744] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:1703-1710] | Only some templates use IntersectionObserver; some templates are fully static and have no scripts [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/readme-guide.html:546-589] [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/implementation-summary.html:538-581] [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/artifact-dashboard.html:410-411] [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/architecture.html:626-627] | Behavior consistency gap. |
| Runtime dependency style | README uses Tailwind CDN, Iconify runtime, Mermaid CDN script (unversioned links in-file) [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:14-17] | Skill architecture emphasizes pinned versions and drift checks for Mermaid/Chart/anime [SOURCE: .opencode/skill/sk-doc-visual/assets/library_versions.json:1-22] [SOURCE: .opencode/skill/sk-doc-visual/scripts/check-version-drift.sh:154-179] | Need a dependency strategy that preserves determinism. |
| Static-output rule | README uses `setInterval` for clock [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:1709-1710] | SKILL currently forbids `setInterval` in static outputs [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:310] | Rule contradiction if README clock is adopted. |

## Modernization Options

### Option A: Direct README Parity (Tailwind + Iconify + exact markup)
- Confidence: Medium
- Pros: Fastest visual parity with source README.
- Cons: Conflicts with current pinned/declarative strategy and introduces unpinned runtime style unless additional pinning policy is added.

### Option B: Semantic-CSS Reimplementation of README Design (Recommended)
- Confidence: High
- Pros: Preserves deterministic static templates and existing validator/drift discipline while achieving README visual system.
- Cons: More rewrite effort (all references + all templates + validator alignment).

### Option C: Partial Hybrid (README style only for `readme-guide.html`)
- Confidence: Medium
- Pros: Lower immediate risk.
- Cons: Leaves `sk-doc-visual` internally inconsistent; fails “template modernization” objective for full set.

## Recommended Direction
Adopt **Option B**: implement the README design language as a new canonical profile while keeping static, self-contained, pin-friendly generation patterns.

## Implementation-Ready Guidance

### 1. `SKILL.md` Update Spec
Target file: `.opencode/skill/sk-doc-visual/SKILL.md`

1. Add a canonical style profile section: `README Ledger Profile (default)`.
- Define required primitives: terminal header, active-dot TOC, glass card, ledger divider, flow-step, viz bars, scanline.
- Cite component source from context package.

2. Replace strict “no Inter” policy with scoped policy.
- Allow Inter + JetBrains Mono for `README Ledger Profile`.
- Keep non-generic pairings as alternatives for non-ledger modes.
- Update lines currently disallowing Inter to avoid validator contradiction. [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:274] [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:307]

3. Amend static-script rule.
- Replace blanket prohibition on `setInterval` with: allow 1-second UTC clock updater only when tied to visible UI element (`#clock`) and no network/storage polling.
- Preserve prohibition on polling loops and hidden background work. [SOURCE: .opencode/skill/sk-doc-visual/SKILL.md:310]

4. Update layout contract.
- Standardize two-column desktop shell to 260px sidebar + content and mobile sidebar hide pattern. [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:125-129] [SOURCE: .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/context/README.html:236-243]

5. Add JS behavior contract.
- Require reveal observer, nav observer, and optional viz-fill animation module with reduced-motion guard.
- Require event listener initialization on `DOMContentLoaded`.

### 2. References Update Spec

#### `references/css_patterns.md`
1. Replace current token baseline with README token baseline.
- Primary tokens: `--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border`.
- Add compatibility alias block mapping old `--ve-*` names to new tokens during migration.
2. Add reusable component classes (`.terminal-header`, `.glass-card`, `.toc-link`, `.ledger-line`, `.flow-step`, `.viz-bar`, `.viz-fill`, `.scanline`, `.reveal`).
3. Add README fluid-typography scaling recipe from root/media-query strategy.

#### `references/navigation_patterns.md`
1. Replace 180px sidebar + mobile horizontal TOC guidance with README sidebar behavior.
2. Standardize active-dot link indicator and spacing/typography to match `.toc-link` semantics.
3. Keep current IntersectionObserver rootMargin guidance, but align class names and breakpoints.

#### `references/quick_reference.md`
1. Add a “README Ledger Starter” snippet (head meta, fonts, token block, layout skeleton, observer bootstrap).
2. Add component checklist for minimum modernized output.

#### `references/library_guide.md`
1. Add explicit decision section for Tailwind/Iconify usage:
- If used, pin versions and explain drift strategy.
- If not used (recommended), provide semantic CSS equivalent mappings.
2. Keep Mermaid hardening defaults unchanged.

#### `references/quality_checklist.md`
1. Add checks for terminal-header presence and clock rendering.
2. Add checks for TOC active-dot state and reveal/viz behavior under reduced motion.
3. Retain existing accessibility checks.

#### `references/user_guide_profiles.md`
1. Update `readme` required sections/anchors to support ledger-style README structures (15-section navigation pattern from provided README).
2. Preserve artifact metadata contract.

#### `references/artifact_profiles.md` (optional but recommended)
1. Add style-profile key so artifact mapping can demand `README Ledger Profile` instead of only module names.

### 3. Full Template Regeneration Spec
Target directory: `.opencode/skill/sk-doc-visual/assets/templates/`

Regenerate all 7 templates around one shared shell (copy/adapt once, then specialize):
- Shared shell requirements:
1. Token block aligned to README system.
2. Terminal header with UTC clock element.
3. 260px sidebar TOC + `main` content region.
4. Component class set from README design system.
5. JS init module for reveal/nav (and viz where applicable).
6. Reduced-motion guard and color-scheme meta.
7. Preserve SpecKit metadata tags where applicable.

- Template-specific guidance:
1. `readme-guide.html`
- Make this the canonical README-ledger demonstration artifact with full multi-section TOC behavior.

2. `implementation-summary.html`
- Re-skin existing content modules into ledger cards and section bands.
- Preserve existing section ids and metadata contract.

3. `artifact-dashboard.html`
- Add currently missing JS scroll-spy/reveal module (file is currently static). [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/artifact-dashboard.html:410-411]

4. `traceability-board.html`
- Keep Mermaid hardening and zoom controls, but re-skin shell/components to ledger system. [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/traceability-board.html:493-517]

5. `mermaid-flowchart.html`
- Keep hardened Mermaid config and zoom controls; migrate layout/typography/tokens to ledger system. [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html:389-415]

6. `architecture.html`
- Add navigation shell and optional reveal behavior (currently no scripts). [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/architecture.html:626-627]

7. `data-table.html`
- Add navigation shell and optional section reveal behavior (currently no scripts). [SOURCE: .opencode/skill/sk-doc-visual/assets/templates/data-table.html:566-567]

## Critical Dependency: Validator Alignment
Even though this task is research-only, implementation will fail validation unless rules are updated in parallel.

Required validator updates in `scripts/validate-html-output.sh`:
1. Replace strict `--ve-*` requirement with dual acceptance:
- pass if `--ve-*` OR README-token set exists.
- transition period: accept both.
2. Replace hard Inter/Roboto fail rule with scoped allowlist for ledger profile.
3. Decide dark-mode policy:
- If keeping dual-theme requirement, README-style templates must include `prefers-color-scheme` overrides.
- If moving to dark-first fixed theme, adjust check 9 accordingly.

Evidence for current constraints: [SOURCE: .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh:484-501] [SOURCE: .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh:541-558] [SOURCE: .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh:563-571]

## Suggested Execution Order (for implementer)
1. Update `SKILL.md` rules and style profile contract.
2. Update `css_patterns.md` + `navigation_patterns.md` first (new canonical system).
3. Update `quick_reference.md`, `library_guide.md`, `quality_checklist.md`, `user_guide_profiles.md`.
4. Regenerate templates with shared shell.
5. Update validator checks for new token/typography/theme policy.
6. Run `scripts/validate-html-output.sh` against all regenerated templates.
7. Run `scripts/check-version-drift.sh` and fix pinning drift.

## Risks and Mitigations
- Risk: Style migration breaks SpecKit metadata contract.
- Mitigation: Preserve all `ve-*` meta tags and existing required section ids during regeneration.

- Risk: README parity introduces unpinned dependencies.
- Mitigation: Prefer semantic CSS implementation; if using runtime libs, pin URLs and update drift checks.

- Risk: Accessibility regressions while chasing visual parity.
- Mitigation: Keep existing reduced-motion, contrast, forced-colors checks and add README-specific behavior checks.

## Final Recommendation
Proceed with a **full-system modernization (Option B)** that adopts the README visual language as the canonical `sk-doc-visual` profile while retaining deterministic pinning, hardened Mermaid defaults, and SpecKit metadata compatibility.
