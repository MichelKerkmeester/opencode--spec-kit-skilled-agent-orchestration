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
    last_updated_at: "2026-04-15T10:00:00Z"
    last_updated_by: "cli-copilot"
    recent_action: "Closed M5 verification, transcript review, and packet bookkeeping"
    next_safe_action: "Hand packet 015 back to the orchestrator for archive or follow-on routing"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-save-flow-planner-first-trim-seed"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Add planner-default and fallback flag definitions to `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`. Dependencies: None. Milestone: M1. Evidence: added `SavePlannerMode`, `resolveSavePlannerMode()`, and save-time opt-in gates for reconsolidation, enrichment, and quality auto-fix.
- [x] T002 [P] Document planner-default, fallback, and deferred follow-up flags in `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`. Dependencies: T001. Milestone: M1. Evidence: documented `SPECKIT_SAVE_PLANNER_MODE`, `SPECKIT_RECONSOLIDATION_ENABLED`, `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED`, and `SPECKIT_QUALITY_AUTO_FIX`.
- [x] T003 Add planner response interfaces and follow-up action types to `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`. Dependencies: T001. Milestone: M1. Evidence: added planner route target, proposed edit, blocker, advisory, follow-up action, and planner envelope types plus `plannerMode` save args.
- [x] T004 Add planner-response serialization helpers to `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`. Dependencies: T003. Milestone: M1. Evidence: added planner serializers plus `buildPlannerResponse()` for MCP planner payloads and hints.
- [x] T005 [P] Add planner blocker and advisory-warning response helpers to `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts`. Dependencies: T003. Milestone: M1. Evidence: added `buildPlannerBlocker()` and `buildPlannerAdvisory()` helpers used by planner-mode save responses.
- [x] T006 Make `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` request planner-first behavior by default and expose explicit fallback mode. Dependencies: T003, T004. Milestone: M1. Evidence: CLI now defaults to `plannerMode: "plan-only"` and parses `--planner-mode` / `--full-auto`, verified in `scripts/tests/generate-context-cli-authority.vitest.ts`.
- [x] T007 [P] Update `.opencode/command/memory/save.md` to describe planner-first default behavior, fallback mode, and deferred freshness actions. Dependencies: T002, T006. Milestone: M1. Evidence: command doc now explains planner-first default, explicit `full-auto`, and deferred `refresh-graph` / `reindex` follow-ups.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### M1: Planner-First Handler Work

- [x] T008 Make `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` return planner output by default while preserving the current canonical atomic path behind explicit fallback. Dependencies: T003, T004, T005, T006. Milestone: M1. Evidence: routed canonical saves now emit planner payloads by default while `plannerMode: "full-auto"` still drives the existing atomic writer path.
- [x] T009 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save.vitest.ts` for planner-default behavior and explicit fallback mode. Dependencies: T008. Milestone: M1. Evidence: aggregate memory-save suite now includes `memory-save-planner-first.vitest.ts` alongside the handler suite.
- [x] T010 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` to verify non-mutating default responses and hard-blocker reporting. Dependencies: T008. Milestone: M1. Evidence: added planner-default non-mutating and blocker tests, and pinned fallback mutation-path assertions to explicit `plannerMode: "full-auto"`.
- [x] T011 [P] Update `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` so CLI target authority survives planner-default execution. Dependencies: T006, T008. Milestone: M1. Evidence: CLI authority tests now assert default `plan-only` forwarding and explicit `--full-auto` override behavior.
- [x] T012 Create `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts` with focused schema and follow-up-action coverage. Dependencies: T008. Milestone: M1. Evidence: new focused suite covers planner response schema, blocker payloads, and follow-up action serialization.

### M2: Routing Classifier Stack Trim

- [x] T013 Trim default Tier 3 participation in `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` while preserving the eight-category contract. Dependencies: T008. Milestone: M2. Evidence: default router path now refuses uncertain chunks with `Router uncertain for [chunk]; operator should specify routeAs`, while `tier3Enabled` remains opt-in via `SPECKIT_ROUTER_TIER3_ENABLED` and `plannerMode: "full-auto"` still preserves legacy Tier 3 fallback.
- [x] T014 [P] Reduce or re-scope `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` to the remaining Tier 2 library required after default Tier 3 removal. Dependencies: T013. Milestone: M2. Evidence: reduced the Tier 2 prototype library to four entries per routing category while keeping all eight categories intact.
- [x] T015 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` to verify deterministic Tier 1 or Tier 2 routing on the default path. Dependencies: T013, T014. Milestone: M2. Evidence: added default-path refusal coverage that asserts low-confidence chunks do not invoke Tier 3, and pinned explicit Tier 3 regression cases behind `tier3Enabled: true`.
- [x] T016 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts` to verify low-confidence cases refuse or warn instead of invoking Tier 3 by default. Dependencies: T013. Milestone: M2. Evidence: added runtime routing fallback guardrail coverage asserting ambiguous save chunks return manual-review warnings without calling Tier 3.
- [x] T017 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts` to prove route overrides remain auditable after the trim. Dependencies: T013. Milestone: M2. Evidence: added override-audit coverage asserting `overrideApplied`, preserved route category, and retained natural-decision trace data after the default Tier 3 trim.

### M3: Quality-Loop Retirement and Hard-Check Preservation

- [x] T018 Retire default-path auto-fix retries in `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` while preserving advisory quality output. Dependencies: T008. Milestone: M3. Evidence: `runQualityLoop()` now defaults to advisory mode, skips auto-fix retries on the planner path, and only re-enables the legacy retry loop in `full-auto` mode or when `SPECKIT_QUALITY_AUTO_FIX=true`.
- [x] T019 Preserve structural blockers but downgrade score-heavy layers in `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`. Dependencies: T018. Milestone: M3. Evidence: `runQualityGate()` now defaults to planner-advisory semantics that still fail structural/legality violations while treating content-quality and semantic-dedup failures as `wouldReject` advisories unless `mode: "legacy"` is requested.
- [x] T020 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts` to cover advisory-only default behavior and any retained opt-in auto-fix mode. Dependencies: T018. Milestone: M3. Evidence: added advisory-default assertions plus explicit `mode: "full-auto"` coverage for rejection, retry-count, and successful auto-fix behavior; verified with `npx vitest run tests/content-router.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts`.
- [x] T021 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts` to verify hard structural blockers still fail saves. Dependencies: T019. Milestone: M3. Evidence: preserved structural rejection assertions, flipped score-heavy failures to advisory expectations on the default path, and added a legacy-mode regression proving strict blocking remains available; verified with `npx vitest run tests/content-router.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts`.
- [x] T022 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` to confirm the planner path still surfaces blocking legality rules. Dependencies: T018, T019. Milestone: M3. Evidence: added planner-default canonical-save coverage asserting `handleMemorySave()` returns blocked planner output with legality blockers and `full-auto` follow-up guidance, and updated pipeline-ordering expectations for advisory-default quality behavior; verified with `npx vitest run tests/memory-save-pipeline-enforcement.vitest.ts`.

### M4: Reconsolidation, Enrichment, and Partial-Value Hot-Path Extraction

- [x] T023 Gate reconsolidation-on-save behind explicit fallback flags in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`. Dependencies: T001, T008. Milestone: M4. Evidence: `runReconsolidationIfEnabled()` now accepts `plannerMode` and only executes save-time reconsolidation on `full-auto` or when `SPECKIT_RECONSOLIDATION_ENABLED=true`, while keeping the legacy full-auto fallback path intact.
- [x] T024 Move default-path enrichment work out of `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` and expose it as explicit follow-up behavior. Dependencies: T001, T008. Milestone: M4. Evidence: added `shouldRunPostInsertEnrichment()` and `runPostInsertEnrichmentIfEnabled()` so planner-default saves skip entity/summarization/linking work unless `full-auto` or `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=true`; explicit follow-up API now lives in `api/indexing.ts::runEnrichmentBackfill()`.
- [x] T025 [P] Preserve same-path lineage while reducing default PE work in `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`. Dependencies: T008, T023. Milestone: M4. Evidence: `findSimilarMemories()` now filters same-path candidates via canonical/file-path exclusion, and `handlers/save/pe-orchestration.ts` passes the routed target path so same-path lineage stays owned by routed record identity instead of PE duplicate arbitration.
- [x] T026 [P] Keep chunking as a size-driven fallback in `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` rather than a default-path dependency. Dependencies: T008. Milestone: M4. Evidence: added `shouldUseChunkedIndexing(content, plannerMode)` and switched `memory-save.ts` to only chunk when content exceeds the threshold in `full-auto` mode.
- [x] T027 Move unconditional graph refresh and spec-doc reindex out of `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` for planner-default saves. Dependencies: T008, T024. Milestone: M4. Evidence: `workflow.ts` now defers graph refresh and Step 11.5 reindex on planner-default saves, and only runs those steps when explicitly invoked with `plannerMode === "full-auto"`.
- [x] T028 [P] Expose explicit follow-up indexing entry points in `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`. Dependencies: T027. Milestone: M4. Evidence: added `refreshGraphMetadata(specFolder)`, `reindexSpecDocs(specFolder)`, and `runEnrichmentBackfill(specFolder)` wrappers on the public indexing API surface and re-exported them from `api/index.ts`.
- [x] T029 [P] Keep graph refresh callable as an explicit follow-up in `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`. Dependencies: T027. Milestone: M4. Evidence: added `refreshGraphMetadata()` as an explicit follow-up alias over `refreshGraphMetadataForSpecFolder()` so callers can use a stable follow-up API without reintroducing save-path coupling.
- [x] T030 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts` for explicit opt-in reconsolidation behavior. Dependencies: T023. Milestone: M4. Evidence: suite now covers planner-default reconsolidation skip plus `full-auto` merge, assistive, and BM25 repair behavior; verified with `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/reconsolidation-bridge.vitest.ts tests/chunking-orchestrator.vitest.ts`.
- [x] T031 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts` to verify reconsolidation no longer runs on the default path. Dependencies: T023. Milestone: M4. Evidence: added regression coverage proving the new save-flow opt-in flag is bridge-owned and does not change the core reconsolidation engine default; verified with `npx vitest run tests/reconsolidation.vitest.ts tests/assistive-reconsolidation.vitest.ts tests/chunking-orchestrator-swap.vitest.ts tests/memory-save-planner-first.vitest.ts tests/graph-metadata-integration.vitest.ts ../scripts/tests/graph-metadata-refresh.vitest.ts`.
- [x] T032 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts` to verify assistive recommendations remain fallback-only or deferred. Dependencies: T023. Milestone: M4. Evidence: added deferred-follow-up coverage showing assistive classification helpers stay available while save-time reconsolidation remains opt-in; verified in the same auxiliary Vitest sweep.
- [x] T033 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts` for size-driven fallback behavior. Dependencies: T026. Milestone: M4. Evidence: both suites now assert `shouldUseChunkedIndexing()` only activates on `full-auto`; focused chunking regression command passed and the swap suite passed in the auxiliary Vitest sweep.
- [x] T034 [P] Update `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` to verify graph refresh works as an explicit follow-up. Dependencies: T027, T029. Milestone: M4. Evidence: both suites now target the explicit `api/indexing.ts::refreshGraphMetadata()` follow-up surface and passed in the auxiliary Vitest sweep.

### M5: Regression Suite, Transcript Prototype, and Structural Parity

- [x] T035 Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts` for planner-default plus fallback end-to-end behavior. Dependencies: T008, T013, T019, T023, T027. Milestone: M5. Evidence: `memory-save-integration.vitest.ts:526-621` now proves planner-default stays non-mutating while explicit `plannerMode: "full-auto"` preserves the same narrative-progress and metadata-only targets end to end; current targeted sweep passed.
- [x] T036 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts` to verify planner output remains readable and action-oriented for operators. Dependencies: T008. Milestone: M5. Evidence: `memory-save-ux-regressions.vitest.ts:422-533` verifies readable proposed edits, explicit `apply` follow-up guidance, continuity-focused metadata-only output, and blocker language for manual review; current targeted sweep passed.
- [x] T037 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts` to prove continuity validation and upsert rules remain unchanged after the refactor. Dependencies: T008. Milestone: M5. Evidence: `thin-continuity-record.vitest.ts:148-212` keeps deterministic normalization plus single-block replacement behavior for `_memory.continuity`; current targeted sweep passed.
- [x] T038 Prototype planner-first behavior against three real session transcripts under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/scratch/`. Dependencies: T008, T013, T019, T027. Milestone: M5. Evidence: packet-local scratch now contains `transcript-{1,2,3}.md`, `transcript-{1,2,3}-planner-output.json`, and `transcript-{1,2,3}-review.md`; transcript 1 and 2 aligned and transcript 3 blocked as designed.
- [x] T039 Run per-file sk-doc validation for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/`. Dependencies: T038. Milestone: M5. Evidence: `validate_document.py` returned `VALID` with `0` issues for `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.
- [x] T040 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim --strict` and capture any follow-on defects. Dependencies: T039. Milestone: M5. Evidence: strict validation returned `0` errors and the single accepted warning `COMPLEXITY_MATCH: Phases (0) below minimum (2) for Level 3`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T041 Review structural parity between `.opencode/command/memory/save.md`, `AGENTS.md`, and `.opencode/skill/system-spec-kit/SKILL.md` so the planner-first contract is described consistently. Dependencies: T007, T040. Milestone: M5. Evidence: `/memory:save` docs now own the planner-first default plus explicit `full-auto` fallback, while `AGENTS.md` and the system-spec-kit skill documentation stay aligned at the higher-level continuity, validation, and canonical-save governance layer without contradicting the new default.
- [x] T042 Review fallback safety against `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` after implementation changes land. Dependencies: T035, T040. Milestone: M5. Evidence: `git diff --name-only HEAD~4 -- .../atomic-index-memory.ts .../create-record.ts` returned no paths, confirming the load-bearing fallback files stayed unchanged during packet 015.
- [x] T043 Review transcript mismatches or manual-review cases and convert any unresolved issues into follow-on tasks before implementation closeout. Dependencies: T038, T040. Milestone: M5. Evidence: `scratch/transcript-1-review.md` and `scratch/transcript-2-review.md` record aligned planner targets, and `scratch/transcript-3-review.md` records the expected blocked manual-review outcome; no unresolved issues remained to convert into new follow-on tasks.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (43/43 T001-T043)
- [x] No `[B]` blocked tasks remaining
- [x] Planner-default, fallback, routing, quality, reconsolidation, enrichment, and continuity verification passed
- [x] Three real transcript prototypes reviewed
- [x] `validate.sh --strict` completed with 0 errors and the single accepted `COMPLEXITY_MATCH` warning for the packet folder
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
