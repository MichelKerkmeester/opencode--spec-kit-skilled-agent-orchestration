---
title: "Tasks: discovery [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "discovery"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: discovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---


<!-- ANCHOR:overview -->
## 1. OVERVIEW

These tasks record the completed Discovery packet sync work. This update keeps wording truthful and replaces stale placeholder/glob/brace path notation with concrete file references.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:notation -->
## 2. TASK NOTATION

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
## 3. PHASE 1: SETUP

- [x] T001 Re-verify Discovery source-of-truth files for handlers, schemas, tests, and related docs (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md`, `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md`, `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md`, `.opencode/skill/system-spec-kit/shared/scoring/README.md`)
- [x] T002 Re-read all five `003-discovery` docs and identify stale statements to remove (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/spec.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/plan.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/tasks.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/checklist.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/implementation-summary.md`)
- [x] T003 Lock update scope to requested doc set only (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 4. PHASE 2: IMPLEMENTATION

- [x] T004 [P1] Update docs for pre-query `checkDatabaseUpdated()` failure handling across `memory_list`, `memory_stats`, and `memory_health` (`E021` + `requestId`) (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`)
- [x] T005 [P1] Update docs for regression tests that assert pre-query refresh failures return MCP envelopes (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts`)
- [x] T006 [P1] Update docs for `memory_list` and `memory_stats` validation behavior and response fields (`sortBy`, `limit`) plus `memory_health` schema support for `confirmed` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/tool-input-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/tool-schemas.ts`)
- [x] T007 [P1] Document related corrections outside the packet (`.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md`, `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md`, `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md`, `.opencode/skill/system-spec-kit/shared/scoring/README.md`)
- [x] T008 [P1] Remove stale Discovery wording (`documentation-only phase`, stale targeted test totals, outdated Discovery inconsistency limitation) across all five docs (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/spec.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/plan.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/tasks.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/checklist.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 5. PHASE 3: VERIFICATION

- [x] T009 Record clean TypeScript verification evidence (`npx tsc --noEmit`, no output)
- [x] T010 Record targeted verification evidence: 5 test files, `95/95` passing (`handler-memory-list-edge`, `handler-memory-stats-edge`, `handler-memory-health-edge`, `handler-memory-crud`, `tool-input-schema`)
- [x] T011 Validate packet docs with sk-doc validator (`spec.md`, `implementation-summary.md`)
- [x] T012 Run final cross-file sync check across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 6. COMPLETION CRITERIA

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification evidence updated to current on-disk reality
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 7. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
