---
title: "Tasks: 017-markovian-architectures"
description: "Execution task list for first-milestone Markovian enhancements."
trigger_phrases: ["tasks", "markovian", "implementation", "graph walk", "session transition"]
importance_tier: "important"
contextType: "implementation"
---
# Tasks: 017-markovian-architectures
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
## Phase 1: Preflight and Contract Freeze

- [x] T001 Create numbered feature branch and re-run prerequisites (`.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh`)
- [ ] T002 Define graph-walk rollout flag constants and defaults (`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`)
- [ ] T003 Validate graph-specific rollout gate alignment (`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`)
- [ ] T004 Define additive cap and ordering invariants for Stage 2 (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`)
- [ ] T005 Capture baseline telemetry fields used for before/after comparisons (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [x] T006 Confirm explicit exclusions remain documented (no MDP/MCTS/SSM; no shadow scoring/novelty hot path) (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Session Transition Trace

- [x] T010 Add transition inference helper and wiring point behind existing `includeTrace` / response-trace controls (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`)
- [ ] T011 Propagate transition metadata through search handler response pipeline (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`)
- [x] T012 Add transition trace envelope fields and null-safe serialization (`.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T017 Confirm no dedicated transition-trace feature flag is added in this milestone (`spec.md`, `plan.md`)
- [ ] T013 [P] Emit transition observability fields in telemetry (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [x] T014 Add handler tests for missing/ephemeral/reused `sessionId` behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`)
- [ ] T015 Add context-level transition trace contract tests (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts`)
- [x] T016 Add response-envelope tests for trace field presence/absence (`.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Bounded Graph-Walk Stage 2

- [x] T020 Add or refine normalized/restart-aware graph-walk helpers (`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`)
- [x] T021 Integrate bounded additive graph bonus into the existing Stage 2 hook (`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`, existing `stage2-fusion.ts` seam reused)
- [ ] T022 Ensure ranking contract caps and tie behavior remain deterministic (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`)
- [x] T023 Verify graph contribution metadata remains wired through the existing search handler payload path (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`)
- [ ] T024 Extend trace formatter with graph contribution details and cap attribution (`.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [ ] T025 [P] Emit graph contribution telemetry fields (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [ ] T026 Add Stage 2 deterministic ordering regression tests (`.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`)
- [x] T027 Add graph signal normalization/cap tests (`.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts`)
- [ ] T028 Add graph feature-eval coverage for bounded rollout (`.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts`)
- [ ] T029 Add trace formatting tests for graph contribution payload (`.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Ingestion Lifecycle Forecasting

- [x] T030 Add queue-based ETA/failure-risk forecast helper(s) (`.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts`)
- [x] T031 Surface advisory forecast fields in ingest handler responses (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`)
- [x] T032 Add confidence/caveat fallback logic for sparse history (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`)
- [ ] T033 [P] Add optional lifecycle telemetry instrumentation (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [x] T034 Add queue forecast unit tests (`.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts`)
- [x] T035 Add edge-case tests for cold/sparse/failure-prone queue states (`.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Validation, Rollout, and Documentation Sync

- [ ] T040 Validate rollout membership and flag gating behavior (`.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts`)
- [ ] T041 Keep adaptive-ranking integration bounded and optional for post-milestone graduation (`.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [ ] T042 Verify no reintroduction of retired shadow scoring or novelty boost hot-path logic (`.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts`)
- [x] T043 Run focused test suite for transition, graph, envelope, and queue contracts (`.opencode/skill/system-spec-kit/mcp_server/tests`)
- [ ] T044 Perform deterministic rerun checks with graph flag off/on (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [x] T045 Confirm rollback drill instructions and kill switches are current (`plan.md`, `checklist.md`)
- [x] T046 Update planning docs with implementation deltas after coding (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
- [x] T047 Save fresh context via generator and verify indexing state (`node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:blockers -->
## Active Blockers

- [x] B001 Numbered feature branch created: current branch is `017-markovian-architectures`.
- [ ] B002 Existing memory artifacts remain low quality under JSON fallback and production indexing was skipped.
- [ ] B003 Follow-up work remains for telemetry, richer graph trace attribution, and deterministic rerun checks (`T013`, `T015`, `T022`-`T026`, `T033`, `T040`-`T044`).
<!-- /ANCHOR:blockers -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 planning checklist items are either complete or explicitly deferred with approval.
- [x] Core first-milestone code paths for transition trace, bounded graph-walk scoring, and advisory forecasting are implemented.
- [ ] All tasks required for first milestone are marked `[x]` or explicitly deferred.
- [ ] No `[B]` blocked tasks remain without mitigation plan.
- [x] Focused Vitest suites pass for transition/graph/forecast/envelope coverage.
- [x] Scope remains bounded to first milestone (no MDP/MCTS/SSM-runtime expansion).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Readiness Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
