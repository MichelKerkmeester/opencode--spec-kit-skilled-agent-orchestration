---
title: "Tasks: discovery [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
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

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. TASK NOTATION](#2--task-notation)
- [3. PHASE 1: SETUP](#3--phase-1-setup)
- [4. PHASE 2: IMPLEMENTATION](#4--phase-2-implementation)
- [5. PHASE 3: VERIFICATION](#5--phase-3-verification)
- [6. COMPLETION CRITERIA](#6--completion-criteria)
- [7. CROSS-REFERENCES](#7--cross-references)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

These tasks record the completed packet sync work for Discovery: reflect landed runtime reliability fixes, regression coverage, related documentation corrections, and current verification evidence.
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

- [x] T001 Re-verify Discovery source-of-truth files for handlers, schemas, tests, and related docs (`.opencode/skill/system-spec-kit/mcp_server/*`, manual playbook, merged feature catalog, scoring README)
- [x] T002 Re-read all five `003-discovery` docs and identify stale statements to remove (`.opencode/specs/.../003-discovery/*.md`)
- [x] T003 Lock update scope to requested doc set only (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 4. PHASE 2: IMPLEMENTATION

- [x] T004 [P1] Update docs for pre-query `checkDatabaseUpdated()` failure handling across `memory_list`, `memory_stats`, and `memory_health` (`E021` + `requestId`) (`mcp_server/handlers/memory-crud-{list,stats,health}.ts`)
- [x] T005 [P1] Update docs for new regression tests that assert pre-query refresh failures return MCP envelopes (`mcp_server/tests/handler-memory-{list,stats,health}-edge.vitest.ts`)
- [x] T006 [P1] Update docs for `memory_list`/`memory_stats` validation behavior and response fields (`sortBy`, `limit`) plus `memory_health` schema support for `confirmed` (`mcp_server/handlers/*`, `tool-input-schemas.ts`, `tool-schemas.ts`)
- [x] T007 [P1] Document related doc corrections outside packet (`manual_testing_playbook` EX-012 `folderRanking:composite`, merged Discovery catalog wording, scoring README cleanup)
- [x] T008 [P1] Remove stale Discovery wording (`documentation-only phase`, stale targeted test totals, outdated Discovery inconsistency limitation) across all five docs (`.opencode/specs/.../003-discovery/*.md`)
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
