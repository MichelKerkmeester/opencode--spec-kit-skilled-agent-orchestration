---
title: "Consolidated tasks: 003-speckit-quality-and-standards [003-speckit-quality-and-standards/tasks.md]"
description: "Consolidated from tasks.md (merged from the former templates phase) and tasks.md (merged from former phase 008)."
SPECKIT_TEMPLATE_SOURCE: "tasks-core + level2-verify | v2.2"
trigger_phrases:
  - "consolidated"
  - "003-speckit-quality-and-standards"
importance_tier: "important"
contextType: "implementation"
---
# Consolidated tasks.md

This document consolidates source documents from:
- `tasks.md (merged from the former templates phase)`
- `tasks.md (merged from former phase 008)`

## Source: `tasks.md (merged from the former templates phase)`

---
title: "Tasks: SpecKit Template ToC Policy Enforcement [tasks.md (merged from the former templates phase)]"
description: "Execution checklist for Level 2 documentation creation, retro ToC cleanup, and validation reporting."
trigger_phrases:
  - "tasks"
  - "spec kit"
  - "toc"
  - "cleanup"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Template ToC Policy Enforcement

<!-- SPECKIT_LEVEL: 2 -->
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
## Phase 1: Preparation

- [x] T001 Read `speckit` playbook and system-spec-kit Level 2 templates.
- [x] T002 Scan scoped standard artifacts for ToC occurrences.
- [x] T003 Confirm cleanup file list across `039`, `040`, and `041` folders.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Documentation Updates

- [x] T004 Create `spec.md` in the historical templates phase with task-specific Level 2 content.
- [x] T005 Create `plan.md` in the historical templates phase with execution and verification flow.
- [x] T006 Create `tasks.md` in the historical templates phase and mark execution state.
- [x] T007 Create `checklist.md` in the historical templates phase with evidence-backed verification status.
- [x] T008 Create `implementation-summary.md` in the historical templates phase.
- [x] T009 Remove ToC sections from scoped non-research standard artifacts under `039`.
- [x] T010 Remove ToC sections from scoped non-research standard artifacts under `040`.
- [x] T011 Remove ToC sections from scoped non-research standard artifacts under `041`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run ToC policy scan to confirm no ToC sections remain in scoped standard artifacts.
- [x] T013 Run `validate.sh` for the historical templates phase.
- [x] T014 Run `validate.sh` for `039-sk-code-opencode-alignment-hardening`.
- [x] T015 Run `validate.sh` for the removed visual skill hardening docs.
- [x] T016 Run `validate.sh` for `041-code-review-skill`.
- [x] T017 Compile concise output report: files changed + validation outcomes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] All requested validation commands executed and recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

## Source: `tasks.md (merged from former phase 008)`

---
title: "Tasks: Spec Kit Code Quality Completion Run [tasks.md (merged from former phase 008)]"
description: "Execution-ready task list mapping baseline stabilization, read-only review coverage, moderate modularization, README modernization, standards propagation, final verification, and context save."
trigger_phrases:
  - "tasks"
  - "phase 008"
  - "code quality run"
  - "execution checklist"
SPECKIT_TEMPLATE_SOURCE: "tasks-core + level2-verify + level3-arch | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Spec Kit Code Quality Completion Run

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-continuity -->
## Phase Continuity Notice

As of 2026-02-23, merged phase-008 content supersedes retired phase-009 record for all ongoing work in this stream. Continue execution, verification, and documentation updates only in this the canonical merged phase folder.
<!-- /ANCHOR:phase-continuity -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline Stabilization (Locked Triad)

- [x] T001 Capture baseline triad evidence and failing assertions (`.opencode/skill/system-spec-kit/mcp_server/tests/{graph-search-fn,query-expander,memory-save-extended}.vitest.ts`).
- [x] T002 Fix graph search SQL/lookup contract failure (`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`).
- [x] T003 Fix query expander single-word variant contract failure (`.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts`).
- [x] T004 Resolve modularization gate regression through `memory-index` seam extraction (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`).
- [x] T005 Re-run focused triad tests and record pass outputs (`scratch/ (merged from former phase 008)`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Full Read-Only Review Wave (Max 6 Parallel Lanes)

- [x] T006 Define six-lane bounded-summary schema and lane ownership (`scratch/ (merged from former phase 008)`).
- [x] T007 [P] Lane 1 review: search/ranking logic seams (read-only) (`.opencode/skill/system-spec-kit/mcp_server/lib/search/`).
- [x] T008 [P] Lane 2 review: handler and persistence seams (read-only) (`.opencode/skill/system-spec-kit/mcp_server/handlers/`).
- [x] T009 [P] Lane 3 review: parsing/indexing seams (read-only) (`.opencode/skill/system-spec-kit/mcp_server/lib/parsing/`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/`).
- [x] T010 [P] Lane 4 review: scripts/validation seams (read-only) (`.opencode/skill/system-spec-kit/scripts/`).
- [x] T011 [P] Lane 5 review: documentation/README seams (read-only) (`.opencode/skill/system-spec-kit/**/README.md`).
- [x] T012 [P] Lane 6 review: test reliability/flaky risk seams (read-only) (`.opencode/skill/system-spec-kit/mcp_server/tests/`).
- [x] T013 Consolidate lane findings into prioritized remediation queue and map to requirements (`tasks.md (merged from former phase 008)`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Moderate Surgical Modularization

- [x] T014 Extract focused helper modules from `memory-index` hotspot without API break (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`).
- [x] T015 Evaluate additional `memory-save` extraction and hold current seam as-is to avoid scope/risk expansion (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`).
- [x] T016 Keep handler exports and MCP response contracts unchanged (`.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` and dependent tests).
- [x] T017 Pass modularization gate and related focused regression tests (`.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: README Modernization (Repo-Owned Only)

- [x] T018 Generate README inventory with enforced exclusions (`node_modules`, `dist`, cache-like directories) (`.opencode/skill/system-spec-kit/`).
- [x] T019 Modernize in-scope READMEs for clarity/consistency in touched areas (`.opencode/skill/system-spec-kit/**/README.md`).
- [x] T020 Verify touched README set excludes vendor/generated trees and record manifest (`scratch/ (merged from former phase 008)`).
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: `sk-code--opencode` Propagation (Conditional)

- [x] T021 Compare changed implementation patterns against current `sk-code--opencode` references/checklists (`.opencode/skill/sk-code--opencode/references/` and `assets/checklists/`).
- [x] T022 Apply standards propagation updates if net-new enforceable patterns are introduced (`.opencode/skill/sk-code--opencode/README.md`, the skill guide, selected references).
- [x] T023 Record propagation evidence in phase artifacts (`checklist.md (merged from former phase 008)`).
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Final Verification, Documentation Closure, and Context Save

- [x] T024 Run final command matrix (focused triad, modularization, lint, full suite) and capture evidence (`scratch/ (merged from former phase 008)`).
- [x] T025 Validate phase folder docs (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../merged phase-008 content`).
- [x] T026 Create and populate `implementation-summary.md` after implementation completion (`implementation-summary.md (merged from former phase 008)`).
- [x] T027 Execute memory save script for this phase (`node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards`).
- [x] T028 Prepare concise closure report with files changed and validation results (`checklist.md (merged from former phase 008)`).
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements are satisfied with recorded evidence artifacts.
- [x] No `[B]` blocked tasks remain unresolved.
- [x] Final verification matrix is complete and documented.
- [x] Context save is successfully executed with `generate-context.js`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decision Log**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
