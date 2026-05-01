---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 005 Resource Leaks And Silent Errors Remediation [template:level_2/tasks.md]"
description: "Task list for closing F-003-A3-01..03 and F-004-A4-01, F-004-A4-04. Five surgical edits + 11 new vitests + 1 existing-test update + validate + stress + commit + push."
trigger_phrases:
  - "F-003-A3 tasks"
  - "F-004-A4 tasks"
  - "005 resource leaks tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/005-resource-leaks-silent-errors"
    last_updated_at: "2026-04-30T09:46:30Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Run validate strict + commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-005-resource-leaks-silent-errors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 005 Resource Leaks And Silent Errors Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §3/§4 to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (3 target files: watcher.ts, file-watcher.ts, projection.ts)
- [x] T003 [P1] Confirm sub-phase 003's projection.ts changes (commit `f5b815c7e`) do not conflict with F-004-A4-01's fallback fix line range
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P1] Add optional `unwatch?` to `SkillGraphFsWatcher`; refreshTargets() computes additions+removals; calls unwatch; prunes fileHashes + pending (F-003-A3-01) (`mcp_server/skill_advisor/lib/daemon/watcher.ts`)
- [x] T005 [P2] Diagnostics ring buffer cap=100 + counter map + COUNTERS synthetic line in status() (F-003-A3-02) (`mcp_server/skill_advisor/lib/daemon/watcher.ts`)
- [x] T006 [P2] `parseDerivedKeyFiles()` accepts `onMalformed?` callback; watcher wires it to push MALFORMED_GRAPH_METADATA diagnostic (F-004-A4-04) (`mcp_server/skill_advisor/lib/daemon/watcher.ts`)
- [x] T007 [P2] File-watcher pendingReindexSlots cap=1000; oldest evicted on overflow; close() drains queue with sentinel; sentinel logged at error not warn (F-003-A3-03) (`mcp_server/lib/ops/file-watcher.ts`)
- [x] T008 [P1] AdvisorProjection.source enum extended with `'filesystem-fallback'`; optional `fallbackReason?: string`; loadAdvisorProjection distinguishes null vs throw + warns (F-004-A4-01) (`mcp_server/skill_advisor/lib/scorer/projection.ts` + `lib/scorer/types.ts`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P1] Add 7 vitest cases for watcher resource leaks (`mcp_server/skill_advisor/tests/daemon-watcher-resource-leaks-049-005.vitest.ts`)
- [x] T010 [P1] Add 2 vitest cases for projection fallback (`mcp_server/skill_advisor/tests/scorer/projection-fallback-049-005.vitest.ts`)
- [x] T011 [P1] Add 2 vitest cases for file-watcher queue cap + close drain (`mcp_server/tests/file-watcher-queue-cap-049-005.vitest.ts`)
- [x] T012 [P1] Update existing native-scorer corrupt-DB assertion for new `'filesystem-fallback'` contract (`mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts`)
- [x] T013 [P1] Run targeted vitest: 11 new + 14 native-scorer + 57 daemon-freshness/lifecycle/file-watcher = 82 tests pass
- [x] T014 [P1] Run `npm run typecheck` — exit 0
- [x] T015 [P1] Run `npm run build` — exit 0 (dist artifacts refreshed)
- [x] T016 [P1] Run `npm run stress` — baseline parity (1 pre-existing env-dependent latency failure unrelated)
- [ ] T017 [P1] Run `validate.sh --strict` on this packet — exit 0 (or peer-warning pattern)
- [ ] T018 [P1] Run `generate-context.js` to refresh metadata for this packet
- [ ] T019 [P1] Confirm git diff shows only 4 product files + 3 new tests + 1 updated test + this packet's spec docs
- [ ] T020 [P1] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All 5 findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` exit 0 (or peer-warning pattern) on this packet
- `npm run stress` baseline parity preserved
- Commit pushed to origin main with finding IDs in body
- 11 new vitest cases pass
- 1 existing test updated for new contract; passes
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §3, §4
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: `../004-validation-and-memory/` (commit `1822a1e69`)
- Predecessor: `../003-advisor-quality/` (commit `f5b815c7e`) — preserves projection.ts coexistence
<!-- /ANCHOR:cross-refs -->
