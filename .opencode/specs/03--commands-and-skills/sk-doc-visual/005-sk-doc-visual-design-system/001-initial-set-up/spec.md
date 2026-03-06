---
title: "SK-Doc-Visual Design System"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: SK-Doc-Visual Design System

## EXECUTIVE SUMMARY
This specification documents the canonical visual system used by `sk-doc-visual`, extracted from `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html`.
The remediation adds concrete evidence tables for layout, CSS variables, component contracts, and all 15 content sections so future contributors can reproduce the interface without reverse-engineering the HTML again.

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (remediated) |
| **Created** | 2026-02-28 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The `sk-doc-visual` skill relies on a visual design system in `readme-guide-v2.html`, but prior documentation only stated that extraction was done and did not include the extracted details.
Without explicit inventories and source citations, reviewers cannot verify fidelity and implementers cannot reliably reuse the design system.

### Purpose
Extract and document the layout, CSS variables, components, and section structure from `readme-guide-v2.html` with direct evidence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Document layout patterns (`.page-container`, `.main-grid`, responsive breakpoints).
- Document all CSS custom properties used via `var(--*)`.
- Document UI components (`glass-card`, `code-window`, `terminal-header`, `toc-link`).
- Document all 15 top-level sections by id and label.
- Synchronize `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.

### Out of Scope
- Modifying the existing `readme-guide-v2.html`.
- Modifying runtime code outside this spec folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Extract Layout | Document `.page-container` and `.main-grid`, including responsive behavior. |
| REQ-002 | Extract CSS Vars | Document all unique `var(--*)` tokens used in template markup/style. |
| REQ-003 | Extract Components | Document `glass-card`, `code-window`, `terminal-header`, `toc-link` with source references. |
| REQ-004 | Document Sections | List 15 sections from HTML. |
| REQ-005 | No Placeholders | Replace all placeholders in templates. |
| REQ-006 | Validate | `validate.sh` exits 0 for this spec folder. |
| REQ-007 | Evidence | Checklist entries include command/file evidence or explicit N/A rationale. |
| REQ-008 | Consistency | Ensure visual consistency across templates. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: A complete Level 3 spec folder is created.
- **SC-002**: Validation script returns Exit Code 0.
- **SC-003**: Section 13 contains extracted evidence for layout, variables, components, and 15-section map.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` | High | Source file verified and cited in extraction tables. |
| Risk | Template evolves over time | Medium | Keep extraction tables versioned and rerun extraction when source changes. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Performance
- **NFR-P01**: Documentation artifacts remain valid Markdown and pass `validate.sh` for this spec folder.

### Maintainability
- **NFR-M01**: Every completed checklist item includes evidence (`[Command:]`, `[File:]`, or `[N/A:]`).

## 8. EDGE CASES
### Error Scenarios
- Component name appears in multiple contexts: document class definition line and representative usage lines.
- Section id and sidebar label diverge: use `section id` as source of truth and record sidebar label separately.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 6 + evidence tables |
| Risk | 5/25 | No APIs |
| Research | 16/20 | Analyze raw HTML and reconcile traceability |
| Multi-Agent| 5/15 | Single workstream |
| Coordination| 5/15 | Independent |
| **Total** | **43/100**| **Level 3** |

## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Missing extraction detail | Medium | Medium | Maintain explicit evidence tables with source line references. |
| R-002 | Checklist drift from scope | Medium | Medium | Mark non-applicable checks as N/A with rationale. |

## 11. USER STORIES
### US-001: Design System Reference
**As a** developer, **I want** the design system documented, **so that** I can build consistent technical documentation UIs.

**Acceptance Criteria**:
1. **Given** I am a developer, When I read spec.md, Then I understand layout patterns.
2. **Given** I am a developer, When I read spec.md, Then I understand CSS variables.
3. **Given** I am a developer, When I read spec.md, Then I understand UI components.
4. **Given** I am a developer, When I read spec.md, Then I understand section structure.
5. **Given** I am a developer, When I read spec.md, Then I can recreate the UI.
6. **Given** I am a developer, When I read spec.md, Then I know where to look.

## 12. OPEN QUESTIONS
- None.

## 13. EXTRACTED DESIGN SYSTEM EVIDENCE

### 13.1 Layout Patterns
| Pattern | Definition | Behavior | Source |
|---------|------------|----------|--------|
| `.page-container` | Full-width container, constrained by `var(--container-max)`, centered with `margin: 0 auto` | Global page frame | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:56` |
| `.main-grid` | Three-column CSS grid: sidebar, content, right-sidebar | Primary desktop structure | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:62` |
| `.main-grid` @ `max-width: 1280px` | Drops right sidebar and reduces gap | Tablet-ish fallback | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:82` |
| `.main-grid` @ `max-width: 1024px` | Single-column layout and hides left sidebar | Mobile fallback | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:92` |
| `.sidebar` / `.right-sidebar` | Vertical rails with border separators | Navigation framing | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:68` |

### 13.2 CSS Variable Inventory (`var(--*)`)
Unique custom properties found in `readme-guide-v2.html`:

`--accent-border`, `--accent-hover`, `--accent-muted`, `--accent`, `--bg-alpha`, `--bg`, `--blur`, `--border-faint`, `--border-light`, `--border`, `--container-max`, `--error`, `--font-mono`, `--font-sans`, `--gap-lg`, `--gap-xl`, `--glass-shadow`, `--lh-base`, `--radius-card`, `--radius-interactive`, `--right-sidebar-w`, `--section-y`, `--sidebar-w`, `--success-alpha`, `--success`, `--surface-l2`, `--surface-l3-alpha`, `--surface-l3`, `--surface`, `--text-muted`, `--text`, `--transition-card`, `--transition-main`, `--transition-progress`, `--transition-reveal`, `--weight-medium`, `--z-progress`, `--z-sticky`, `--zinc-100`, `--zinc-200`, `--zinc-300`, `--zinc-400`, `--zinc-500`, `--zinc-600`, `--zinc-800-alpha`.

Evidence command used:
- `rg -o --no-filename "var\(--[a-zA-Z0-9-]+\)" .opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html | sort -u`

### 13.3 Component Catalog
| Component | Purpose | Definition / Usage Evidence |
|-----------|---------|-----------------------------|
| `terminal-header` | Sticky top ledger header row | Definition: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:155`; Usage: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:210` |
| `glass-card` | Elevated content cards with hover border/shadow transitions | Definition: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:173`; Usage: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:375` |
| `code-window` | Framed code/command blocks with window-style top chrome | Usage: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:318`; Additional usage: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:563` |
| `toc-link` | Right-sidebar table-of-contents links with active state marker | Definition: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:105`; Usage: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1422` |

### 13.4 Section Map (15 Sections)
| # | Section ID | Label | Source |
|---|------------|-------|--------|
| 1 | `overview` | Overview | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:292` |
| 2 | `quickstart` | Quick Start | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:542` |
| 3 | `spec-kit-documentation` | Spec Kit Documentation | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:608` |
| 4 | `memory-engine` | Memory Engine | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:765` |
| 5 | `agent-network` | Agent Network | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:864` |
| 6 | `command-architecture` | Command Architecture | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:934` |
| 7 | `skills-library` | Skills Library | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1001` |
| 8 | `gate-system` | Gate System | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1043` |
| 9 | `code-mode-mcp` | Code Mode MCP | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1077` |
| 10 | `extensibility` | Extensibility | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1135` |
| 11 | `configuration` | Configuration | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1157` |
| 12 | `usage-examples` | Usage Examples | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1205` |
| 13 | `troubleshooting` | Troubleshooting | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1266` |
| 14 | `faq` | FAQ | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1325` |
| 15 | `related-documents` | Related Documents | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1362` |

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS
- See `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
