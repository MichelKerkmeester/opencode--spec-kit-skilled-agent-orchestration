---
title: "Tasks: System-Wide Remediation of Confirmed Findings [125-codex-system-wide-audit/tasks]"
description: "Task format: T### [P?] Description (path)"
trigger_phrases:
  - "tasks"
  - "system"
  - "wide"
  - "remediation"
  - "confirmed"
  - "125"
  - "codex"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: System-Wide Remediation of Confirmed Findings

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 (refactored) -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Task format: `T### [P?] Description (path)`

<!-- /ANCHOR:notation -->

---

## Phase 0: Findings Baseline (Completed)

- [x] T001 Consolidate documentation defects across specs 121/124/125 (`scratch/context-*.md`)
- [x] T002 Consolidate runtime code defects touched by 121/124/125 (`scratch/context-*.md`)
- [x] T003 Run independent verification pass for high-impact findings (`scratch/verification-evidence.md`)
- [x] T004 Produce cross-code consistency view (`scratch/context-cross-spec-lineage.md`)

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Documentation Re-Baselining (Completed)

- [x] T010 Rewrite `spec.md` around full confirmed issue inventory (`spec.md`)
- [x] T011 Rewrite `plan.md` with path-correct command manifest (`plan.md`)
- [x] T012 Rebuild `tasks.md` with unique IDs and truthful status (`tasks.md`)
- [x] T013 Rebuild `checklist.md` to map to current remediation contracts (`checklist.md`)
- [x] T014 Rewrite `decision-record.md` to supersede stale assumptions (`decision-record.md`)
- [x] T015 Rewrite `implementation-summary.md` to remove false completion claims (`implementation-summary.md`)
- [x] T016 Rewrite `handover.md` for remediation-first continuation (`handover.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Shell Runtime Remediation (P0)

### Upgrade flow safety

- [x] T020 Fix undefined failure-path call in upgrade flow (`.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`)
- [x] T021 Implement atomic rollback cleanup for files created during failed run (`.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`)
- [x] T022 Fail restore when copy/delete operations fail (`.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`)

### Level parser parity

- [x] T023 Align level detection contract in `upgrade-level.sh` and `validate.sh` (`.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T024 Update rule parser to support marker/table canonical patterns (`.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`)
- [x] T025 Add parity fixtures/tests for all level detection paths (`.opencode/skill/system-spec-kit/scripts/tests/`)

### Registry and test hardening

- [x] T026 Register `upgrade-level` in script registry (`.opencode/skill/system-spec-kit/scripts/scripts-registry.json`)
- [x] T027 Verify registry lookup resolves `upgrade-level` (`.opencode/skill/system-spec-kit/scripts/registry-loader.sh`)
- [x] T028 Remove shared-file rename race from upgrade test suite (`.opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh`)
- [x] T029 Add exact exit-code assertion for missing helper path (`.opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: MCP/TypeScript Remediation (P1 but high runtime impact)

- [x] T030 Canonicalize DB marker write path to shared config contract (`.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts`)
- [x] T031 Validate DB marker read/write consistency with env override (`.opencode/skill/system-spec-kit/mcp_server/core/config.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`)
- [x] T032 Make dedup behavior explicit when DB unavailable (`.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`)
- [x] T033 Return non-success/degraded result for zero-row reinforcement (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`)
- [x] T034 Move scan cooldown update to successful completion path (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`)
- [x] T035 Add targeted test coverage for T032-T034 (`.opencode/skill/system-spec-kit/mcp_server/tests/`)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Phase 4: Verification and Closure

- [x] T040 [P] Run shell syntax and targeted script tests (`.opencode/skill/system-spec-kit/scripts/`)
- [x] T041 [P] Run spec validation on 121, 124, and 125 folders (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T042 [P] Run TypeScript checks/tests for touched MCP modules (`.opencode/skill/system-spec-kit/mcp_server/`)
- [x] T043 Update checklist evidence for all completed P0/P1 items (`checklist.md`)
- [x] T044 Reconcile implementation summary with final state (`implementation-summary.md`)
- [x] T045 Finalize handover with remaining backlog and known risks (`handover.md`)

---

## Completion Criteria

- [x] All P0 tasks complete: `T020..T029`
- [x] No task ID duplicates or contradictory status markers
- [x] Verification tasks `T040..T042` pass with evidence paths
- [x] Root docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`) are synchronized

<!-- /ANCHOR:completion -->

---

## Dependency Notes

- `T021` depends on understanding created-file tracking semantics in upgrade flow.
- `T023` and `T024` should land together to avoid temporary parser divergence.
- `T030` and `T031` should land together to prevent marker-path regression.
- `T043` must happen after all implementation and verification tasks finish.
