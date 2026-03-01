---
title: "Tasks: Reverse-Engineer Doc Visual Skill [037-reverse-engineer-doc-visual/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "reverse"
  - "engineer"
  - "visual"
  - "explainer"
  - "037"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Reverse-Engineer Doc Visual Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Research & Analysis

- [x] T001 Clone nicobailon/doc-visual v0.1.1 repo locally
- [x] T002 Analyze single-file prompt structure (700+ lines)
- [x] T003 Map content sections to Skill Graph node candidates
- [x] T004 Identify 5 commands and their contracts
- [x] T005 Catalog 11 diagram types and 9 aesthetic profiles
- [x] T006 Identify conflicting keywords with existing skill_advisor.py entries
- [x] T007 Plan file naming conventions (snake_case for references, kebab-case for nodes)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Skill Graph Core

- [x] T008 Create SKILL.md lean router with Smart Router pseudocode (~1,683 words) (`.opencode/skill/sk-doc-visual/SKILL.md`)
- [x] T009 Create index.md MOC with 4 groups and 10 wikilinks (`.opencode/skill/sk-doc-visual/index.md`)
- [x] T010 Create nodes/when-to-use.md — 5 command overview, decision matrix, proactive trigger table (`.opencode/skill/sk-doc-visual/nodes/when-to-use.md`)
- [x] T011 Create nodes/rules.md — 9 ALWAYS, 7 NEVER, 4 ESCALATE IF rules (`.opencode/skill/sk-doc-visual/nodes/rules.md`)
- [x] T012 Create nodes/success-criteria.md — 9 quality checks (7 original + accessibility + reduced-motion) (`.opencode/skill/sk-doc-visual/nodes/success-criteria.md`)
- [x] T013 Create nodes/how-it-works.md — 4-phase Think > Structure > Style > Deliver workflow (`.opencode/skill/sk-doc-visual/nodes/how-it-works.md`)
- [x] T014 Create nodes/smart-routing.md — Python pseudocode for intent classification (`.opencode/skill/sk-doc-visual/nodes/smart-routing.md`)
- [x] T015 Create nodes/commands.md — full contracts for all 5 commands (`.opencode/skill/sk-doc-visual/nodes/commands.md`)
- [x] T016 Create nodes/diagram-types.md — 11 types with decision tree (`.opencode/skill/sk-doc-visual/nodes/diagram-types.md`)
- [x] T017 Create nodes/aesthetics.md — 9 profiles with CSS variables and 11x9 compatibility matrix (`.opencode/skill/sk-doc-visual/nodes/aesthetics.md`)
- [x] T018 Create nodes/integration-points.md — CDN libraries, cross-skill integration (`.opencode/skill/sk-doc-visual/nodes/integration-points.md`)
- [x] T019 Create nodes/related-resources.md — master index (`.opencode/skill/sk-doc-visual/nodes/related-resources.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: References & Assets

- [x] T020 Create references/quick_reference.md — ALWAYS tier, command cheat sheet, CDN snippets, 13 font pairings (`.opencode/skill/sk-doc-visual/references/quick_reference.md`)
- [x] T021 [P] Create references/css_patterns.md — CONDITIONAL tier, ~15KB CSS pattern library (`.opencode/skill/sk-doc-visual/references/css_patterns.md`)
- [x] T022 [P] Create references/library_guide.md — ON_DEMAND tier, ~16KB Mermaid v11, Chart.js v4, anime.js, Google Fonts (`.opencode/skill/sk-doc-visual/references/library_guide.md`)
- [x] T023 [P] Create references/navigation_patterns.md — CONDITIONAL tier, sticky TOC, scroll spy, mobile nav (`.opencode/skill/sk-doc-visual/references/navigation_patterns.md`)
- [x] T024 [P] Create references/quality_checklist.md — ON_DEMAND tier, detailed 9-check verification (`.opencode/skill/sk-doc-visual/references/quality_checklist.md`)
- [x] T025 Port assets/templates/architecture.html — terracotta/sage, CSS Grid, ~17KB (`.opencode/skill/sk-doc-visual/assets/templates/architecture.html`)
- [x] T026 [P] Port assets/templates/mermaid-flowchart.html — teal/cyan, Mermaid+ELK, ~13KB (`.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html`)
- [x] T027 [P] Port assets/templates/data-table.html — rose/cranberry, data table, ~16KB (`.opencode/skill/sk-doc-visual/assets/templates/data-table.html`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Commands & Integration

- [x] T028 Create command/doc-visual/generate.md (`.opencode/command/doc-visual/generate.md`)
- [x] T029 [P] Create command/doc-visual/diff-review.md (`.opencode/command/doc-visual/diff-review.md`)
- [x] T030 [P] Create command/doc-visual/plan-review.md (`.opencode/command/doc-visual/plan-review.md`)
- [x] T031 [P] Create command/doc-visual/recap.md (`.opencode/command/doc-visual/recap.md`)
- [x] T032 [P] Create command/doc-visual/fact-check.md (`.opencode/command/doc-visual/fact-check.md`)
- [x] T033 Add 11 INTENT_BOOSTERS entries to skill_advisor.py (`.opencode/skill/scripts/skill_advisor.py`)
- [x] T034 Add 5 MULTI_SKILL_BOOSTERS entries to skill_advisor.py (`.opencode/skill/scripts/skill_advisor.py`)
- [x] T035 Create scripts/validate-html-output.sh — 10-check static HTML validator (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T036 [P] Create scripts/cleanup-output.sh — output directory maintenance (`.opencode/skill/sk-doc-visual/scripts/cleanup-output.sh`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [x] T037 Run package_skill.py validation (result: PASS, 1 non-blocking emoji warning)
- [x] T038 Test skill_advisor.py routing (result: 0.95 confidence for "create doc visual")
- [x] T039 Verify SKILL.md word count (result: 1,683 words, under 5,000 limit)
- [x] T040 Verify all 10 wikilinks in index.md resolve to existing files (result: 10/10)
- [x] T041 Validate HTML templates via validate-html-output.sh (result: all 3 pass)
- [x] T042 Count total files created/modified (result: 27 new + 1 modified = 28 total)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Gap Remediation

- [x] T043 Gap Analysis & Classification — Systematic comparison of source repo against skill files; identified 30 gaps classified as 4 Critical, 15 Medium, 11 Low priority
- [x] T044 Batch 1 — css_patterns.md Remediation — Fixed gaps C2, C3, M1-M8, L8 (11 patterns total): CSS Grid with named template areas, container queries, scroll-snap, logical properties, aspect-ratio, clamp(), subgrid, CSS nesting, :has() selector, view transitions, @layer
- [x] T045 Batch 2 — library_guide.md Remediation — Fixed gaps C4, M9, M15, L1-L7, L9-L10 (12 items total): Framer Motion library entry, FLIP technique, performance budgets, will-change usage, paint containment, composite-only animations, accessibility patterns, motion sensitivity, forced-colors, scroll-timeline, animation-composition, timeline-scope
- [x] T046 Batch 3-6 — Remaining File Remediation — Fixed remaining gaps across navigation_patterns.md (intersection observer, view transitions), rules.md (performance rules, a11y mandates), commands.md (audit commands), integration-points.md (DevTools integration), quick_reference.md (modern CSS reference)
- [x] T047 Verification & Validation — Grep-verified all 30 gap patterns present in skill files; package_skill.py PASS; SKILL.md word count unchanged at 1,682 words; no regressions detected
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (47/47)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (6 success criteria verified)
- [x] package_skill.py validation PASS
- [x] skill_advisor.py routing >= 0.90 (actual: 0.95)
- [x] Gap remediation complete (30/30 gaps fixed and verified)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS - Retroactive documentation
42 tasks across 5 phases, all completed
27 files created + 1 modified
-->
