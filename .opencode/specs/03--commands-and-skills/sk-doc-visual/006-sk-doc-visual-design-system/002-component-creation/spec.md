---
title: "SK-Doc-Visual Additional Section and Component Extraction"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: SK-Doc-Visual Additional Section and Component Extraction

## EXECUTIVE SUMMARY
This phase implemented additional section/component extraction work from `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` and then consolidated overlapping section templates.
The final output preserves preview conventions (`../variables/*` and `../variables/template-defaults.js`) while reducing the section library to fewer unique, generic templates.

**Key Decisions**: Source-anchored extraction with line citations, consistent file naming across section/component previews.

**Critical Dependencies**: Canonical source template and existing preview conventions in `.opencode/skill/sk-doc-visual/assets/sections/` and `.opencode/skill/sk-doc-visual/assets/components/`.

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented; manual browser verification follow-up pending |
| **Created** | 2026-02-28 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Current extracted previews cover only a subset of the canonical README template, leaving twelve documentation sections and five reusable components without standalone previews.
Without a source-cited extraction plan, implementation can drift from `readme-guide-v2.html` and break established preview conventions.

### Purpose
Define a complete, evidence-backed implementation plan for expanding preview coverage while deferring HTML implementation work to the next phase.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Implement additional section/component previews derived from the canonical README template.
- Consolidate overlapping section templates into a smaller generic section library.
- Synchronize skill and command documentation with the consolidated section model.
- Update phase documentation and verification records.

### Out of Scope
- Rewriting canonical template content in `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html`.
- Runtime platform behavior changes outside sk-doc-visual preview/documentation scope.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc-visual/assets/sections/*` | Modify | Add/merge/remove section previews and reduce overlap |
| `.opencode/skill/sk-doc-visual/assets/components/*` | Modify | Add 5 new component previews |
| `.opencode/skill/sk-doc-visual/SKILL.md` | Modify | Reflect consolidated section model |
| `.opencode/skill/sk-doc-visual/references/*.md` | Modify | Align profile and output conventions |
| `.opencode/command/create/visual_html.md` | Modify | Align routed naming and verify example |
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/006-sk-doc-visual-design-system/002-component-creation*.md` | Modify | Record implementation outcomes and evidence |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Section overlap must be reduced. | Final section library contains 8 section files including `operations-overview`, `setup-and-usage`, and `support`. |
| REQ-002 | New component extraction targets must be delivered. | `toc-link`, `site-nav-link`, `main-grid-shell`, `scroll-progress`, and `copy-code-interaction` exist as standalone component previews. |
| REQ-003 | Shared preview conventions must be preserved. | All section files include `../variables/*` imports and `../variables/template-defaults.js`. |
| REQ-004 | Command/skill docs must match asset model. | `SKILL.md`, references, and `/create:visual_html` reflect consolidated sections and current output conventions. |
| REQ-005 | Level 3 docs must be complete without placeholders. | Phase docs are synchronized and implementation summary reflects actual delivery status. |
| REQ-006 | Phase validation must run after documentation updates. | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/sk-doc-visual/006-sk-doc-visual-design-system/002-component-creation` executed and output captured. |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Implementation tasks must be traceable to delivery. | `tasks.md` records completed extraction/consolidation tasks and remaining manual verification tasks. |
| REQ-008 | ADR must define extraction and consolidation conventions. | `decision-record.md` includes accepted ADRs with alternatives and rollback plan. |
| REQ-009 | Checklist must reflect implementation reality. | `checklist.md` contains evidence-backed completions and explicit pending browser checks. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Final section library reduced to 8 files without breaking shared scaffold conventions.
- **SC-002**: 5 additional component previews exist in `assets/components`.
- **SC-003**: Skill and command docs are synchronized to consolidated section anchors/output conventions.
- **SC-004**: Validation command executes against the phase folder and results are reported.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` | High | Use line-cited extraction matrices tied to canonical source. |
| Dependency | Existing preview conventions in `assets/sections` and `assets/components` | Medium | Mirror import and script conventions from existing previews. |
| Risk | Source line drift after upstream template edits | Medium | Re-run source grep checks before implementation starts. |
| Risk | Scope creep into implementation during planning | Medium | Keep all implementation checklist items pending and explicitly out of scope in docs. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Maintainability
- **NFR-M01**: Every extraction target references canonical source lines.
- **NFR-M02**: Planned file naming is deterministic and follows existing asset naming conventions.

### Reliability
- **NFR-R01**: Documentation validates with Spec Kit validator for this phase path.

### Traceability
- **NFR-T01**: Checklist and ADR link back to requirement IDs and extraction tables.

## 8. EDGE CASES
### Source Edge Cases
- Section heading text may differ from section ID; section ID remains source of truth.
- Component behavior spans CSS, markup, and script; extraction notes must capture all three.

### Process Edge Cases
- If template lines shift before implementation, re-baseline matrix citations first.
- If a component has no standalone behavior in isolation, document adapter wrapper requirements before extraction.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | 6 planning docs + 17 extraction targets |
| Risk | 9/25 | Multi-surface extraction (CSS + markup + JS contracts) |
| Research | 17/20 | Requires source-line mapping and convention alignment |
| Multi-Agent | 5/15 | Single-agent planning workflow |
| Coordination | 8/15 | Depends on prior phase conventions and next implementation phase |
| **Total** | **54/100** | **Level 3** |

## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Extracted files diverge from canonical source structure | High | Medium | Require matrix and line references before implementation. |
| R-002 | Shared preview scaffolding is copied inconsistently | Medium | Medium | Enforce baseline from existing preview files and ADR naming convention. |
| R-003 | Plan-stage docs accidentally imply implementation completion | Medium | Medium | Keep tasks/checklist implementation items unchecked until execution phase. |

## 11. USER STORIES
### US-001: Implementation Engineer Preparation (Priority: P0)
**As a** maintainer of `sk-doc-visual`, **I want** a source-cited extraction plan, **so that** I can implement additional previews without reverse-engineering the README template again.

**Acceptance Criteria**:
1. **Given** this spec, **When** implementation starts, **Then** each target section/component maps to explicit source lines.
2. **Given** this spec, **When** file creation begins, **Then** naming and shared imports are already defined.
3. **Given** a review request, **When** the reviewer checks matrix rows, **Then** each row resolves to a concrete source citation.

### US-002: Reviewer Auditability (Priority: P1)
**As a** reviewer, **I want** clear planning boundaries and verification gates, **so that** I can distinguish planning completion from implementation completion.

**Acceptance Criteria**:
1. **Given** this phase output, **When** reviewing checklist state, **Then** implementation checks are still pending.
2. **Given** this phase output, **When** reviewing ADR, **Then** naming and extraction decisions are documented with alternatives.
3. **Given** this phase output, **When** planning handoff occurs, **Then** tasks are grouped and executable without additional discovery.

## 12. OPEN QUESTIONS
- None. Remaining work is explicit manual browser verification recorded in `tasks.md` and `checklist.md`.
<!-- /ANCHOR:questions -->

## 13. IMPLEMENTATION EVIDENCE MATRIX

### 13.1 Final Section Library (Consolidated)
| # | Final Section ID | Final File | Source Coverage | Consolidation Source |
|---|------------------|------------|-----------------|----------------------|
| 1 | `top` | `.opencode/skill/sk-doc-visual/assets/sections/hero-section.html` | README top/hero framing | retained |
| 2 | `quickstart` | `.opencode/skill/sk-doc-visual/assets/sections/quick-start-section.html` | README quick start | retained |
| 3 | `features` | `.opencode/skill/sk-doc-visual/assets/sections/feature-grid-section.html` | README feature highlights | retained |
| 4 | `operations-overview` | `.opencode/skill/sk-doc-visual/assets/sections/operations-overview-section.html` | architecture, systems, command, skills, gate, integration content | merged from `spec-kit-documentation`, `memory-engine`, `agent-network`, `command-architecture`, `skills-library`, `gate-system`, `tool-integration` |
| 5 | `extensibility` | `.opencode/skill/sk-doc-visual/assets/sections/extensibility-section.html` | README extensibility | retained |
| 6 | `setup-and-usage` | `.opencode/skill/sk-doc-visual/assets/sections/setup-and-usage-section.html` | configuration and usage workflows | merged from `configuration`, `usage-examples` |
| 7 | `support` | `.opencode/skill/sk-doc-visual/assets/sections/support-section.html` | troubleshooting and FAQ support content | merged from `troubleshooting`, `faq` |
| 8 | `related-documents` | `.opencode/skill/sk-doc-visual/assets/sections/related-documents-section.html` | README related docs | retained |

### 13.2 Delivered Component Targets
| Component | Source Evidence | Delivered Preview File | Contract |
|-----------|-----------------|------------------------|----------|
| `toc-link` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:105`, `:1422` | `.opencode/skill/sk-doc-visual/assets/components/toc-link.html` | Base/hover/active states and active marker behavior |
| `site-nav-link` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:134`, `:264` | `.opencode/skill/sk-doc-visual/assets/components/site-nav-link.html` | Active state and icon-capable variants |
| `main-grid/sidebar shell` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:62`, `:83`, `:256`, `:1418` | `.opencode/skill/sk-doc-visual/assets/components/main-grid-shell.html` | Desktop/tablet/mobile shell behavior |
| `scroll-progress` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:186`, `:205`, `:1467` | `.opencode/skill/sk-doc-visual/assets/components/scroll-progress.html` | Fixed top bar and width-update script contract |
| `copy-code interaction contract` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:323`, `:1506`, `:1512` | `.opencode/skill/sk-doc-visual/assets/components/copy-code-interaction.html` | Copy button aria label, icon swap, success class, timeout reset |

### 13.3 Shared Preview Convention Baseline
| Convention | Evidence | Required Reuse |
|------------|----------|----------------|
| Shared variable imports | `.opencode/skill/sk-doc-visual/assets/sections/hero-section.html:8` | Keep `../variables/fluid-typography.css`, `colors.css`, `typography.css`, `layout.css` in new previews. |
| Template defaults script | `.opencode/skill/sk-doc-visual/assets/sections/hero-section.html:17` | Keep `<script src="../variables/template-defaults.js" defer></script>`. |
| Component preview scaffold parity | `.opencode/skill/sk-doc-visual/assets/components/code-window.html:8` and `.opencode/skill/sk-doc-visual/assets/components/code-window.html:17` | Use same head/bootstrap structure for newly added component previews. |

### 13.4 Verification Commands Used
- `ls .opencode/skill/sk-doc-visual/assets/sections` confirms final 8-file section library.
- `rg` checks confirm all remaining section files include required `../variables/*` imports and `template-defaults.js`.
- `rg` checks confirm removed section filenames are no longer present in section assets.

## RELATED DOCUMENTS
- See `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` for execution sequencing and quality gates.
