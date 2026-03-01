---
title: "Styled HTML Visual Generator"
description: "Converts complex technical context into self-contained, styled HTML visual artifacts with strict quality checks, weighted intent routing and template-first delivery."
trigger_phrases:
  - "generate styled HTML visual"
  - "create architecture diagram"
  - "visual artifact from spec"
  - "mermaid flowchart HTML"
importance_tier: "normal"
---

# Styled HTML Visual Generator

> Converts complex technical context into self-contained, styled HTML pages with diagrams, tables and visualizations using a 4-phase Think > Structure > Style > Deliver workflow.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. EXAMPLES](#6--examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. RELATED](#8--related)
<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This skill generates self-contained HTML visual artifacts from technical content. It handles architecture diagrams, flowcharts, data dashboards, timelines and SpecKit artifact reviews through a strict 4-phase workflow with deterministic library pinning and automated validation.

The architecture follows a smart routing model: weighted intent scoring classifies requests across 10 intent signals, then loads only the resources needed for that intent. The core principle is **template-first composition with composable assets**.

All output uses the **README Ledger** aesthetic profile by default: terminal header, active-dot TOC, glass cards and ledger dividers with Inter + JetBrains Mono typography. Light and dark themes are always included.

Use this skill when creating styled HTML visuals, architecture diagrams, data tables with 4+ rows, SpecKit artifact dashboards or traceability boards. If the request is for plain markdown documentation, component scaffolding or ASCII flowcharts, route to `sk-doc` instead. Do not use this skill for framework-native components (React, Vue, Svelte) or server-side rendering.

| Metric | Count |
|--------|-------|
| Reference files | 7 |
| Composable components | 12 |
| Section templates | 8 |
| HTML templates | 10 |
| CSS/JS variables | 5 |
| Validation scripts | 3 |
| Intent signals | 10 |
| Success criteria | 14 |

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

The skill is invoked automatically via Gate 2 routing when visual artifact tasks are detected, or manually via the `skill` tool:

```
skill("sk-doc-visual")
```

**Common operations:**

```bash
# Generate a visual artifact (auto-routes intent)
/create:visual_html --mode auto

# Generate a new diagram or visual
/create:visual_html --mode create

# Analyze a plan, diff or recap as visual
/create:visual_html --mode analyze

# Fact-check an existing visual against source
/create:visual_html --mode verify

# Validate output HTML against contract
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh path/to/output.html

# Check pinned library versions for drift
bash .opencode/skill/sk-doc-visual/scripts/check-version-drift.sh
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
sk-doc-visual/
├── SKILL.md                              # Entry point with routing logic
├── README.md                             # This file
├── assets/
│   ├── components/                       # 12 composable HTML components
│   │   ├── bento-card.html               # Bento grid card
│   │   ├── caption.html                  # Figure caption
│   │   ├── code-window.html              # Code display window
│   │   ├── copy-code-interaction.html    # Copy-to-clipboard button
│   │   ├── data-table.html               # Styled data table
│   │   ├── footer.html                   # Page footer
│   │   ├── glass-card.html               # Glassmorphism card
│   │   ├── main-grid-shell.html          # Desktop sidebar + content grid
│   │   ├── scroll-progress.html          # Scroll progress indicator
│   │   ├── site-nav-link.html            # Navigation link
│   │   ├── terminal-header.html          # Terminal-style header bar
│   │   └── toc-link.html                 # Table of contents link
│   ├── sections/                         # 8 composable page sections
│   │   ├── extensibility-section.html
│   │   ├── feature-grid-section.html
│   │   ├── hero-section.html
│   │   ├── operations-overview-section.html
│   │   ├── quick-start-section.html
│   │   ├── related-documents-section.html
│   │   ├── setup-and-usage-section.html
│   │   └── support-section.html
│   ├── templates/                        # Starter templates
│   │   ├── readme-guide-v2.html          # Primary shell template
│   │   ├── drafts/                       # Active artifact-specific drafts
│   │   │   ├── spec.html
│   │   │   ├── plan.html
│   │   │   ├── tasks.html
│   │   │   ├── decision-record.html
│   │   │   ├── implementation-summary.html
│   │   │   ├── deployment-guide.html
│   │   │   └── troubleshooting-guide.html
│   │   └── z_archive/                    # Legacy reference templates
│   │       ├── readme-guide.html
│   │       └── implementation-summary.html
│   ├── variables/                        # Shared CSS/JS tokens
│   │   ├── colors.css                    # Color palette tokens
│   │   ├── fluid-typography.css          # Responsive type scale
│   │   ├── layout.css                    # Grid and spacing
│   │   ├── template-defaults.js          # JS bootstrap defaults
│   │   └── typography.css                # Font stacks
│   └── library_versions.json             # Pinned CDN version source of truth
├── references/                           # Domain knowledge (7 files)
│   ├── quick_reference.md                # One-page cheat sheet (ALWAYS loaded)
│   ├── css_patterns.md                   # Token contract and layout patterns
│   ├── library_guide.md                  # Mermaid, Chart.js, anime.js usage
│   ├── navigation_patterns.md            # Sidebar and scroll navigation
│   ├── quality_checklist.md              # Validation and quality gates
│   ├── artifact_profiles.md              # SpecKit artifact detector and profiles
│   └── user_guide_profiles.md            # README and install guide mapping
└── scripts/                              # Automation
    ├── validate-html-output.sh           # Contract enforcement checks
    ├── check-version-drift.sh            # CDN version drift detection
    ├── cleanup-output.sh                 # Output directory cleanup
    └── tests/                            # Validator test suite
        ├── test-validator-fixtures.sh    # Fixture-based test runner
        └── fixtures/                     # 9 test fixture HTML files
```

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

**Phase 1 - Think (Smart Routing):**
- Weighted intent scoring across 10 signal categories with command boosts
- 5 activation modes: `auto`, `create`, `analyze`, `verify` and `custom`
- Automatic artifact type classification (architecture, flowchart, table, dashboard, timeline)
- SpecKit artifact profile detection for spec folder documents
- Unknown-intent fallback with disambiguation checklist

**Phase 2 - Structure (Template Composition):**
- Template-first workflow starting from `assets/templates/readme-guide-v2.html`
- 7 artifact-specific draft templates for SpecKit document types
- 12 composable HTML components and 8 reusable page sections
- Semantic HTML landmarks (`header`, `main`, `section`, `figure`, `figcaption`)
- Two view modes: `artifact-dashboard` (default) and `traceability-board`

**Phase 3 - Style (Design Tokens):**
- README Ledger default profile with terminal header, glass cards and ledger dividers
- Token contract: `--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border`
- Light and dark themes via `prefers-color-scheme`
- Accessibility: `prefers-reduced-motion`, `prefers-contrast` and `forced-colors` support
- Inter + JetBrains Mono typography (README Ledger profile only)

**Phase 4 - Deliver (Validation):**
- Output to `.opencode/output/visual/` with mode-descriptor-timestamp naming
- Contract enforcement via `scripts/validate-html-output.sh`
- CDN version drift detection via `scripts/check-version-drift.sh`
- 14 success criteria covering hierarchy, theming, accessibility and responsiveness (320px-2560px)

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

No configuration required. The skill auto-detects intent and loads resources at the appropriate level:

| Loading Level | Trigger | Resources |
|---------------|---------|-----------|
| ALWAYS | Every invocation | `references/quick_reference.md` |
| CONDITIONAL | Intent signals match | CSS patterns, library guide, quality checklist, artifact profiles, user guide profiles |
| ON_DEMAND | Explicit request or keyword match | Navigation patterns, all HTML templates |

**Pinned library versions** are defined in `assets/library_versions.json`:

| Library | Version | Use Case |
|---------|---------|----------|
| Mermaid.js | 11.12.3 (ESM) | Flowcharts, sequences, ER, state, mindmap |
| Chart.js | 4.5.1 | Dashboards, metrics, bar/line/pie charts |
| anime.js | 4.3.6 (optional) | Advanced stagger and shape animation |
| Google Fonts | pinned families + `display=swap` | Typography |

**Output convention:**

```text
.opencode/output/visual/{mode}-{descriptor}-{timestamp}.html
.opencode/output/visual/{descriptor}-verified.html
```

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

**Generate a visual artifact (auto-routed):**
```bash
/create:visual_html --mode auto
# Analyzes request, scores intent, loads resources, generates HTML
```

**Create an architecture diagram:**
```bash
/create:visual_html --mode create
# Routes to GENERATE intent, loads css_patterns.md + library_guide.md
# Output: .opencode/output/visual/generate-architecture-{timestamp}.html
```

**Validate output HTML:**
```bash
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh \
  .opencode/output/visual/generate-architecture-20260301.html
# Checks: color-scheme meta, reduced-motion, contrast media, Mermaid hardening
# Exit 0 = pass, non-zero = errors found
```

**Check library version drift:**
```bash
bash .opencode/skill/sk-doc-visual/scripts/check-version-drift.sh
# Compares CDN URLs in output against assets/library_versions.json
```

**Review a SpecKit artifact as visual dashboard:**
```bash
/create:visual_html --mode analyze
# Provide path to spec.md, plan.md, or implementation-summary.md
# Routes to SPECKIT_ARTIFACT_REVIEW, loads artifact_profiles.md + quality_checklist.md
# Includes metadata tags: ve-artifact-type, ve-source-doc, ve-speckit-level, ve-view-mode
```

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Cause | Fix |
|-------|-------|-----|
| `validate-html-output.sh` fails on color-scheme | Missing `<meta name="color-scheme" content="light dark">` | Add the meta tag to `<head>` |
| `validate-html-output.sh` fails on reduced-motion | No `prefers-reduced-motion` media query | Add `@media (prefers-reduced-motion: reduce)` block for all animations |
| `check-version-drift.sh` reports mismatch | CDN URL uses different version than `library_versions.json` | Update the CDN URL to match pinned version |
| Mermaid diagram does not render | Missing hardened config or wrong theme | Use `theme: 'base'` with explicit `themeVariables`, set `securityLevel: 'strict'` |
| Output path missing | `.opencode/output/visual/` directory does not exist | Create the directory or run `scripts/cleanup-output.sh` which initializes it |
| SpecKit metadata tags missing | Artifact not detected as SpecKit-aligned | Add `ve-artifact-type`, `ve-source-doc`, `ve-speckit-level` and `ve-view-mode` meta tags |
| Contrast check fails | No `prefers-contrast` or `forced-colors` fallback | Add contrast-aware media query blocks per `references/css_patterns.md` |

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

- **sk-doc** - Markdown documentation quality, component creation and ASCII flowcharts
- **system-spec-kit** - Spec folder documentation structure and SpecKit Memory for context preservation
- **sk-git** - Git workflow with diff-based visual review integration
- **mcp-chrome-devtools** - Post-delivery console and layout verification in Chrome
- [Mermaid.js documentation](https://mermaid.js.org/intro/) - Diagram syntax and configuration
- [Chart.js documentation](https://www.chartjs.org/docs/latest/) - Chart types and options
- [anime.js documentation](https://animejs.com/documentation/) - Animation API reference

<!-- /ANCHOR:related -->
