---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 006 Architecture Cleanup Remediation [template:level_2/tasks.md]"
description: "Task list for closing F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04. Fifteen surgical refactors + 2 vitest files + typecheck + stress + validate + commit + push."
trigger_phrases:
  - "F-016-D1 tasks"
  - "F-017-D2 tasks"
  - "F-018-D3 tasks"
  - "006 architecture cleanup tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/006-architecture-cleanup"
    last_updated_at: "2026-05-01T10:08:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase A: schema duplication refactors"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-006-architecture-cleanup"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: 006 Architecture Cleanup Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag (all P2 in this packet). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P2] Re-read packet 046 §16/§17/§18 to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P2] Verify each cited file:line still matches research.md claim before editing (15 target files)
- [x] T003 [P2] Pull latest from origin main to ensure latest watcher.ts (sub-phase 005 changes integrated)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A: Schema Duplication (D3, Low Risk)
- [ ] T004 [P2] Create trust-state values canonical tuple module (F-018-D3-01) (`skill_advisor/lib/freshness/trust-state-values.ts`)
- [ ] T005 [P2] Derive `SkillGraphTrustState` from tuple (F-018-D3-01) (`skill_advisor/lib/freshness/trust-state.ts`)
- [ ] T006 [P2] Create lifecycle status values canonical tuple module (F-018-D3-02) (`skill_advisor/lib/lifecycle/status-values.ts`)
- [ ] T007 [P2] Derive `SkillLifecycleStatus` from tuple (F-018-D3-02) (`skill_advisor/lib/scorer/types.ts`)
- [ ] T008 [P2] Create advisor runtime values canonical tuple module (F-018-D3-03) (`skill_advisor/lib/advisor-runtime-values.ts`)
- [ ] T009 [P2] Derive `AdvisorRuntime` from tuple (F-018-D3-03) (`skill_advisor/lib/skill-advisor-brief.ts`)
- [ ] T010 [P2] Generate `advisor_recommend` + `advisor_validate` JSON schemas from zod (F-018-D3-04 partial) (`tool-schemas.ts`)
- [ ] T011 [P2] typecheck (D3 group)

### Phase B: Dependency Graph Cycles (D2, Medium Risk)
- [ ] T012 [P2] Extract `StructuralBootstrapContract` type to seam module (F-017-D2-01) (`lib/session/structural-bootstrap-contract.ts`)
- [ ] T013 [P2] Update session-snapshot + memory-surface to use seam (F-017-D2-01) (2 files)
- [ ] T014 [P2] Extract `CommunityResult` + `CommunitySummary` to shared types module (F-017-D2-02) (`lib/graph/community-types.ts`)
- [ ] T015 [P2] Update community-detection/storage/summaries imports (F-017-D2-02) (3 files in `lib/graph/`)
- [ ] T016 [P2] Remove dead `getDetectedRuntime` export (F-017-D2-03) (`context-server.ts`)
- [ ] T017 [P2] typecheck (D2 group)

### Phase C: Boundary Discipline (D1, Highest Risk)
- [ ] T018 [P2] Create sqlite-integrity neutral seam (F-016-D1-01) (`lib/utils/sqlite-integrity.ts`)
- [ ] T019 [P2] Update skill-graph-db import (F-016-D1-01) (`lib/skill-graph/skill-graph-db.ts`)
- [ ] T020 [P2] Create skill-label-sanitizer neutral seam (F-016-D1-02) (`lib/utils/skill-label-sanitizer.ts`)
- [ ] T021 [P2] Update shared-payload import (F-016-D1-02) (`lib/context/shared-payload.ts`)
- [ ] T022 [P2] Create spec-document-finder lib seam (F-016-D1-03) (`lib/discovery/spec-document-finder.ts`)
- [ ] T023 [P2] Update resume-ladder import (F-016-D1-03) (`lib/resume/resume-ladder.ts`)
- [ ] T024 [P2] Create advisor-status-reader lib seam (F-016-D1-04) (`skill_advisor/lib/compat/advisor-status-reader.ts`)
- [ ] T025 [P2] Update daemon-probe default reader (F-016-D1-04) (`skill_advisor/lib/compat/daemon-probe.ts`)
- [ ] T026 [P2] Create busy-retry neutral seam (F-016-D1-05) (`skill_advisor/lib/utils/busy-retry.ts`)
- [ ] T027 [P2] Update rebuild-from-source import (F-016-D1-05) (`skill_advisor/lib/freshness/rebuild-from-source.ts`)
- [ ] T028 [P2] Extract `WatcherOrchestrator` class (F-016-D1-06) (`skill_advisor/lib/daemon/watcher-orchestrator.ts`)
- [ ] T029 [P2] Delegate reindex/generation orchestration to orchestrator; preserve all sub-phase 005 features (F-016-D1-06) (`skill_advisor/lib/daemon/watcher.ts`)
- [ ] T030 [P2] Create age-policy scorer seam (F-016-D1-07) (`skill_advisor/lib/scorer/age-policy.ts`)
- [ ] T031 [P2] Update derived lane import (F-016-D1-07) (`skill_advisor/lib/scorer/lanes/derived.ts`)
- [ ] T032 [P2] Add predicate parameter to `computeCorpusStats` (F-016-D1-08) (`skill_advisor/lib/corpus/df-idf.ts`)
- [ ] T033 [P2] typecheck (D1 group)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T034 [P2] Add architecture-seam.vitest.ts (verify seam importability) (`mcp_server/skill_advisor/handlers/__tests__/`)
- [ ] T035 [P2] Add architecture-cleanup-cycles.vitest.ts (verify cycle removal) (`mcp_server/tests/`)
- [ ] T036 [P2] Run targeted vitest: `cd mcp_server && npx vitest run skill_advisor/handlers/__tests__/architecture-seam.vitest.ts tests/architecture-cleanup-cycles.vitest.ts skill_advisor/tests/skill-graph-watcher`
- [ ] T037 [P2] Run `validate.sh --strict` on this packet — must exit 0
- [ ] T038 [P2] Run `npm run stress` (from mcp_server) — exit 0 / >=58 files / >=194 tests
- [ ] T039 [P2] Run `generate-context.js` to refresh metadata for this packet
- [ ] T040 [P2] Confirm git diff shows only target product files + this packet's spec docs + new seams + new tests
- [ ] T041 [P2] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All 15 findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md` (1 deferred-with-reason for F-018-D3-04 partial)
- `validate.sh --strict` exit 0 on this packet
- `npm run stress` exit 0 / >=58 files / >=194 tests
- Commit pushed to origin main with finding IDs in body
- 2 new vitest files pass
- Watcher public API parity verified (every existing export still resolvable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §16, §17, §18
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot patterns: `../004-validation-and-memory/` (commit `1822a1e69`, 13 findings) and `../001-code-graph-consistency/` (commit `57abfc553`, 9 findings)
<!-- /ANCHOR:cross-refs -->
