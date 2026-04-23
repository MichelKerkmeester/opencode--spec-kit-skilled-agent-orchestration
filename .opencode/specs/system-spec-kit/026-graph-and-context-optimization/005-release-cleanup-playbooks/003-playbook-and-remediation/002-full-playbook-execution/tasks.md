<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: Phase 015 Playbook Coverage Accounting and Partial Execution"
description: "Coverage-accounting tasks and per-category results for the Phase 015 playbook run, including the reclassified partial and failing scenarios."
trigger_phrases:
  - "phase 015 tasks"
  - "playbook coverage accounting tasks"
  - "manual playbook results"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded the coverage-accounting task inventory and category result matrix"
    next_safe_action: "Use the failure inventory to drive follow-on remediation"
    blockers:
      - "Automated suite still has two concrete MCP-side failures"
      - "273 manual scenarios remain truthful direct-handler UNAUTOMATABLE cases"
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:phase015-tasks"
      session_id: "phase015-full-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the final runner pass account for every live scenario file"
---
# Tasks: Phase 015 Playbook Coverage Accounting and Partial Execution

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### Description (artifact or scope)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Audit the live playbook inventory and packet state (`manual_testing_playbook/`, `015-full-playbook-execution/`)
- [x] T002 Read the existing runner and fixture before modifying them (`scripts/tests/manual-playbook-runner.ts`, `scripts/tests/fixtures/manual-playbook-fixture.ts`)
- [x] T003 Confirm the live active scenario count from the filesystem (`297` active files)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Retarget runner output to the Phase 015 scratch folder (`manual-playbook-runner.ts`)
- [x] T005 Retarget fixture report metadata to the same packet-local root (`manual-playbook-fixture.ts`)
- [x] T006 Extend the runner parser for live prose-style scenarios (`manual-playbook-runner.ts`)
- [x] T007 Rerun the manual sweep until all active scenario files are accounted for (`297/297`)

### Automated Suite Results

| Surface | Files discovered | Files executed before bail | Tests executed | Pass | Fail | Skip |
|---|---:|---:|---:|---:|---:|---:|
| `mcp_server` | 402 | 8 | 286 | 285 | 1 | 0 |
| `scripts` | 105 | 2 | 60 | 60 | 0 | 0 |
| **TOTAL** | **507** | **10** | **346** | **345** | **1** | **0** |

### Automated Failure Inventory

| File | Result | Evidence |
|---|---|---|
| `mcp_server/tests/handler-helpers.vitest.ts` | Suite import failure | Mocked `../core/config` omits `resolveDatabasePaths`, which `vector-index-store.ts` now requires |
| `mcp_server/tests/spec-doc-structure.vitest.ts` | 1 failing test | `validate.sh --strict` fixture returned exit code `2` instead of expected `0` |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Result-class contract for this packet: `PASS`, `FAIL`, `SKIP`, and `UNAUTOMATABLE` are the canonical playbook/runner scenario statuses; `PARTIAL` is a packet-summary overlay for scenarios where core behavior was observed but the evidence set stayed incomplete.

| Category | Total | PASS | PARTIAL | FAIL | SKIP | UNAUTOMATABLE |
|---|---:|---:|---:|---:|---:|---:|
| 01--retrieval | 16 | 2 | 1 | 0 | 0 | 13 |
| 02--mutation | 10 | 4 | 0 | 1 | 0 | 5 |
| 03--discovery | 3 | 3 | 0 | 0 | 0 | 0 |
| 04--maintenance | 2 | 1 | 0 | 0 | 0 | 1 |
| 05--lifecycle | 9 | 3 | 0 | 0 | 0 | 6 |
| 06--analysis | 7 | 6 | 0 | 0 | 0 | 1 |
| 07--evaluation | 2 | 0 | 0 | 0 | 0 | 2 |
| 08--bug-fixes-and-data-integrity | 12 | 0 | 0 | 0 | 0 | 12 |
| 09--evaluation-and-measurement | 15 | 0 | 0 | 0 | 0 | 15 |
| 10--graph-signal-activation | 17 | 0 | 0 | 0 | 0 | 17 |
| 11--scoring-and-calibration | 23 | 0 | 0 | 0 | 0 | 23 |
| 12--query-intelligence | 9 | 0 | 0 | 0 | 0 | 9 |
| 13--memory-quality-and-indexing | 29 | 0 | 0 | 0 | 0 | 29 |
| 14--pipeline-architecture | 23 | 0 | 0 | 0 | 0 | 23 |
| 15--retrieval-enhancements | 11 | 0 | 0 | 0 | 0 | 11 |
| 16--tooling-and-scripts | 50 | 0 | 0 | 0 | 0 | 50 |
| 17--governance | 3 | 0 | 0 | 0 | 0 | 3 |
| 18--ux-hooks | 18 | 0 | 0 | 0 | 0 | 18 |
| 19--feature-flag-reference | 10 | 0 | 0 | 0 | 0 | 10 |
| 20--remediation-revalidation | 3 | 0 | 0 | 0 | 0 | 3 |
| 21--implement-and-remove-deprecated-features | 5 | 0 | 0 | 0 | 0 | 5 |
| 22--context-preservation-and-code-graph | 20 | 3 | 0 | 0 | 0 | 17 |
| **TOTAL** | **297** | **22** | **1** | **1** | **0** | **273** |

### Execution Inventory

- [x] T008 Retrieval verdicts captured: `EX-002` and `EX-005` remain `PASS`; `EX-001` was reclassified to `PARTIAL` because the resume surfaces returned diagnostics but no recovery context.
- [x] T009 Mutation verdicts captured: `EX-007`, `EX-008`, `EX-009`, and `EX-010` remain `PASS`; `EX-006` was reclassified to `FAIL` because the save was rejected before indexing and no searchable result appeared.
- [x] T010 Discovery and maintenance passes captured: `EX-011`, `EX-012`, `EX-013`, `EX-014`
- [x] T011 Lifecycle and analysis passes captured: `EX-015`, `EX-016`, `EX-018`, `EX-020`, `EX-021`, `EX-022`, `EX-023`, `EX-024`, `EX-025`
- [x] T012 Context-preservation passes captured: `262`, `263`, `266`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All active scenario files accounted for
- [x] Packet-local reporting docs written
- [x] Failure inventory documented for follow-on work
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
