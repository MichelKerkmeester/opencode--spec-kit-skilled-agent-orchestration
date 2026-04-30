---
title: "Tasks: Hook Test Sandbox Fix"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks | v2.2"
description: "Task list for the sandbox-aware runtime hook test methodology correction."
trigger_phrases:
  - "031-hook-test-sandbox-fix"
  - "hook test methodology"
  - "sandbox detection"
  - "BLOCKED_BY_TEST_SANDBOX"
  - "operator-run-outside-sandbox"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/031-hook-test-sandbox-fix"
    last_updated_at: "2026-04-29T21:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed task list"
    next_safe_action: "Review validation evidence"
    blockers: []
    completion_pct: 95
---
# Tasks: Hook Test Sandbox Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

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

- [x] T001 Read prior findings and result evidence.
- [x] T002 Confirm all direct hook/plugin smokes passed in historical evidence.
- [x] T003 Confirm live CLI failures map to sandbox-blocked user state.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `detectSandbox()` and `SKIPPED_SANDBOX`.
- [x] T005 Split runtime adapters into direct-smoke and live-cli result cells.
- [x] T006 Update orchestration to pass one sandbox detection result.
- [x] T007 Add package script for operator live-hook tests.
- [x] T008 Update runner README and prior findings.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run sandboxed hook test script.
- [x] T010 Run MCP server build.
- [x] T011 Run strict validator for this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Direct smokes pass in sandbox mode.
- [x] Live CLI cells are `SKIPPED_SANDBOX` in sandbox mode.
- [x] Prior findings are corrected without deleting historical verdict text.
- [x] Build and strict validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent packet: `system-spec-kit/026-graph-and-context-optimization`
- Dependency: `system-spec-kit/026-graph-and-context-optimization/030-hook-plugin-per-runtime-testing`
- Root-cause writeup: `methodology-correction.md`
<!-- /ANCHOR:cross-refs -->

