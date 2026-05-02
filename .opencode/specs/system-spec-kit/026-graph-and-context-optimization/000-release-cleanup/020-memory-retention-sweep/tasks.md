---
title: "Tasks: Memory Retention Sweep"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task tracker for packet 033 retention sweep implementation."
trigger_phrases:
  - "033 retention tasks"
  - "memory retention sweep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep"
    last_updated_at: "2026-04-29T14:03:15Z"
    last_updated_by: "cli-codex"
    recent_action: "Retention sweep complete"
    next_safe_action: "Orchestrator commit"
    blockers: []
    completion_pct: 100
---
# Tasks: Memory Retention Sweep

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
## Phase 1: Setup

- [x] T001 Read 013 P1-2 source research. [EVIDENCE: research report and iteration 004 cited in spec]
- [x] T002 Read governance delete_after persistence path. [EVIDENCE: `scope-governance.ts` read before edit]
- [x] T003 Read session cleanup interval and target tables. [EVIDENCE: `session-manager.ts` init and cleanup functions read]
- [x] T004 [P] Create packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`).
- [x] T005 [P] Create packet metadata (`description.json`, `graph-metadata.json`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add retention sweep handler/core. [EVIDENCE: `lib/governance/memory-retention-sweep.ts:109` and handler wrapper]
- [x] T007 Register `memory_retention_sweep`. [EVIDENCE: `tool-schemas.ts:328` and `tools/memory-tools.ts:75`]
- [x] T008 Add scheduled sweep interval. [EVIDENCE: `session-manager.ts:204-290`]
- [x] T009 Add targeted tests. [EVIDENCE: `tests/memory-retention-sweep.vitest.ts:68-190`]
- [x] T010 Update docs and governance comment. [EVIDENCE: MCP README, ENV reference, and `scope-governance.ts:321`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `npm run build` in MCP server. [EVIDENCE: build exit 0]
- [x] T012 Run `npx vitest run memory-retention-sweep`. [EVIDENCE: 6 tests passed]
- [x] T013 Run strict validator on packet 033. [EVIDENCE: final validator exit 0]
- [x] T014 Update checklist and implementation summary with final evidence. [EVIDENCE: completion_pct=100]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Build succeeds.
- [x] Targeted retention tests pass.
- [x] Strict validator exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source research**: `../017-automation-reality-supplemental-research/research/research-report.md`
<!-- /ANCHOR:cross-refs -->
