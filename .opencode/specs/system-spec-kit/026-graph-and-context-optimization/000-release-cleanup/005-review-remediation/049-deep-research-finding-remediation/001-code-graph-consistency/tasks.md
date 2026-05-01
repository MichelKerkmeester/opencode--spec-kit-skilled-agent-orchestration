---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 001 Code-Graph Consistency Remediation [template:level_2/tasks.md]"
description: "Task list for closing F-002-A2-01..03, F-014-C4-01..04, F-004-A4-02..03. Nine surgical edits + 6 vitest files + validate + stress + commit + push."
trigger_phrases:
  - "F-002-A2 tasks"
  - "F-014-C4 tasks"
  - "F-004-A4 tasks"
  - "001 code graph consistency tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/001-code-graph-consistency"
    last_updated_at: "2026-05-01T09:08:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase 2: apply 9 fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-001-code-graph-consistency"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: 001 Code-Graph Consistency Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §2/§14/§4 to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (5 target files)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P1] Add `PRAGMA busy_timeout = 5000` in `initDb()` (F-002-A2-02) (`mcp_server/code_graph/lib/code-graph-db.ts`)
- [ ] T004 [P1] Wrap `persistIndexedFileResult` storage operations in `db.transaction(...)` (F-002-A2-01) (`mcp_server/code_graph/lib/ensure-ready.ts`)
- [ ] T005 [P2] Hash content on mtime drift before declaring stale (F-014-C4-01) (`mcp_server/code_graph/lib/code-graph-db.ts`)
- [ ] T006 [P2] Filter HEAD diffs through index scope before declaring full-scan (F-014-C4-02) (`mcp_server/code_graph/lib/ensure-ready.ts`)
- [ ] T007 [P1] Persist + compare candidate manifest for untracked indexable files (F-014-C4-03) (`mcp_server/code_graph/lib/ensure-ready.ts`)
- [ ] T008 [P1] Redefine doctor Phase 1 Analysis around existing handler outputs (F-014-C4-04) (`.opencode/command/doctor/assets/doctor_code-graph_auto.yaml`)
- [ ] T009 [P2] Wrap multi-SELECT query operations in a short read transaction (F-002-A2-03) (`mcp_server/code_graph/handlers/query.ts`)
- [ ] T010 [P2] Return typed `resolved | unavailable | unresolved` from `resolveSubjectToRef` (F-004-A4-02) (`mcp_server/code_graph/lib/code-graph-context.ts`)
- [ ] T011 [P2] Distinguish absent / corrupt / invalid-shape metadata reads (F-004-A4-03) (`mcp_server/code_graph/lib/code-graph-db.ts`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 [P1] Add 6 vitest files: atomic-persistence, busy-timeout, mtime-vs-hash, candidate-manifest, metadata-shape, resolve-subject-typed (`mcp_server/code_graph/tests/`)
- [ ] T013 [P1] Run targeted vitest: `cd mcp_server && npx vitest run code_graph/`
- [ ] T014 [P1] Run `validate.sh --strict` on this packet — must exit 0 errors
- [ ] T015 [P1] Run `npm run stress` (from mcp_server) — exit 0 / >=58 files / >=195 tests
- [ ] T016 [P1] Run `generate-context.js` to refresh metadata for this packet
- [ ] T017 [P1] Confirm git diff shows only target product files + this packet's spec docs + new tests
- [ ] T018 [P1] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All 9 findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` errors=0 on this packet
- `npm run stress` exit 0 / >=58 files / >=195 tests
- Commit pushed to origin main with finding IDs in body
- 6 new vitest files pass
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §2, §14, §4
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: `../004-validation-and-memory/` (commit `1822a1e69`)
- Older pilot: `../010-cli-orchestrator-drift/` (commit `889d1ee08`)
<!-- /ANCHOR:cross-refs -->
