---
title: "Tasks: Save Flow Planner-First Trim"
description: "Task breakdown for packet 015 save-flow planner-first trim."
trigger_phrases:
  - "015-save-flow-planner-first-trim"
  - "tasks"
  - "planner-first save"
  - "save flow trim"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored Level 3 docs scaffold from 014 research findings"
    next_safe_action: "Review packet; run 3 transcript prototypes"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-save-flow-planner-first-trim-seed"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Save Flow Planner-First Trim

<!-- SPECKIT_LEVEL: 3 -->
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

### M1: Planner Contract and Flag Plumbing

- [ ] T001 Add planner-default and fallback flag definitions to `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`. Dependencies: None. Milestone: M1.
- [ ] T002 [P] Document planner-default, fallback, and deferred follow-up flags in `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`. Dependencies: T001. Milestone: M1.
- [ ] T003 Add planner response interfaces and follow-up action types to `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`. Dependencies: T001. Milestone: M1.
- [ ] T004 Add planner-response serialization helpers to `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`. Dependencies: T003. Milestone: M1.
- [ ] T005 [P] Add planner blocker and advisory-warning response helpers to `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts`. Dependencies: T003. Milestone: M1.
- [ ] T006 Make `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` request planner-first behavior by default and expose explicit fallback mode. Dependencies: T003, T004. Milestone: M1.
- [ ] T007 [P] Update `.opencode/command/memory/save.md` to describe planner-first default behavior, fallback mode, and deferred freshness actions. Dependencies: T002, T006. Milestone: M1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### M1: Planner-First Handler Work

- [ ] T008 Make `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` return planner output by default while preserving the current canonical atomic path behind explicit fallback. Dependencies: T003, T004, T005, T006. Milestone: M1.
- [ ] T009 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save.vitest.ts` for planner-default behavior and explicit fallback mode. Dependencies: T008. Milestone: M1.
- [ ] T010 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` to verify non-mutating default responses and hard-blocker reporting. Dependencies: T008. Milestone: M1.
- [ ] T011 [P] Update `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` so CLI target authority survives planner-default execution. Dependencies: T006, T008. Milestone: M1.
- [ ] T012 Create `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts` with focused schema and follow-up-action coverage. Dependencies: T008. Milestone: M1.

### M2: Routing Classifier Stack Trim

- [ ] T013 Trim default Tier 3 participation in `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` while preserving the eight-category contract. Dependencies: T008. Milestone: M2.
- [ ] T014 [P] Reduce or re-scope `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` to the remaining Tier 2 library required after default Tier 3 removal. Dependencies: T013. Milestone: M2.
- [ ] T015 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` to verify deterministic Tier 1 or Tier 2 routing on the default path. Dependencies: T013, T014. Milestone: M2.
- [ ] T016 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts` to verify low-confidence cases refuse or warn instead of invoking Tier 3 by default. Dependencies: T013. Milestone: M2.
- [ ] T017 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts` to prove route overrides remain auditable after the trim. Dependencies: T013. Milestone: M2.

### M3: Quality-Loop Retirement and Hard-Check Preservation

- [ ] T018 Retire default-path auto-fix retries in `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` while preserving advisory quality output. Dependencies: T008. Milestone: M3.
- [ ] T019 Preserve structural blockers but downgrade score-heavy layers in `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`. Dependencies: T018. Milestone: M3.
- [ ] T020 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts` to cover advisory-only default behavior and any retained opt-in auto-fix mode. Dependencies: T018. Milestone: M3.
- [ ] T021 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts` to verify hard structural blockers still fail saves. Dependencies: T019. Milestone: M3.
- [ ] T022 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` to confirm the planner path still surfaces blocking legality rules. Dependencies: T018, T019. Milestone: M3.

### M4: Reconsolidation, Enrichment, and Partial-Value Hot-Path Extraction

- [ ] T023 Gate reconsolidation-on-save behind explicit fallback flags in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`. Dependencies: T001, T008. Milestone: M4.
- [ ] T024 Move default-path enrichment work out of `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` and expose it as explicit follow-up behavior. Dependencies: T001, T008. Milestone: M4.
- [ ] T025 [P] Preserve same-path lineage while reducing default PE work in `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`. Dependencies: T008, T023. Milestone: M4.
- [ ] T026 [P] Keep chunking as a size-driven fallback in `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` rather than a default-path dependency. Dependencies: T008. Milestone: M4.
- [ ] T027 Move unconditional graph refresh and spec-doc reindex out of `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` for planner-default saves. Dependencies: T008, T024. Milestone: M4.
- [ ] T028 [P] Expose explicit follow-up indexing entry points in `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`. Dependencies: T027. Milestone: M4.
- [ ] T029 [P] Keep graph refresh callable as an explicit follow-up in `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`. Dependencies: T027. Milestone: M4.
- [ ] T030 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts` for explicit opt-in reconsolidation behavior. Dependencies: T023. Milestone: M4.
- [ ] T031 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts` to verify reconsolidation no longer runs on the default path. Dependencies: T023. Milestone: M4.
- [ ] T032 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts` to verify assistive recommendations remain fallback-only or deferred. Dependencies: T023. Milestone: M4.
- [ ] T033 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts` for size-driven fallback behavior. Dependencies: T026. Milestone: M4.
- [ ] T034 [P] Update `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` to verify graph refresh works as an explicit follow-up. Dependencies: T027, T029. Milestone: M4.

### M5: Regression Suite, Transcript Prototype, and Structural Parity

- [ ] T035 Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts` for planner-default plus fallback end-to-end behavior. Dependencies: T008, T013, T019, T023, T027. Milestone: M5.
- [ ] T036 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts` to verify planner output remains readable and action-oriented for operators. Dependencies: T008. Milestone: M5.
- [ ] T037 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts` to prove continuity validation and upsert rules remain unchanged after the refactor. Dependencies: T008. Milestone: M5.
- [ ] T038 Prototype planner-first behavior against three real session transcripts under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/scratch/`. Dependencies: T008, T013, T019, T027. Milestone: M5.
- [ ] T039 Run per-file sk-doc validation for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/`. Dependencies: T038. Milestone: M5.
- [ ] T040 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim --strict` and capture any follow-on defects. Dependencies: T039. Milestone: M5.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T041 Review structural parity between `.opencode/command/memory/save.md`, `AGENTS.md`, and `.opencode/skill/system-spec-kit/SKILL.md` so the planner-first contract is described consistently. Dependencies: T007, T040. Milestone: M5.
- [ ] T042 Review fallback safety against `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` after implementation changes land. Dependencies: T035, T040. Milestone: M5.
- [ ] T043 Review transcript mismatches or manual-review cases and convert any unresolved issues into follow-on tasks before implementation closeout. Dependencies: T038, T040. Milestone: M5.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Planner-default, fallback, routing, quality, reconsolidation, enrichment, and continuity verification passed
- [ ] Three real transcript prototypes reviewed
- [ ] `validate.sh --strict` passed for the packet folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
