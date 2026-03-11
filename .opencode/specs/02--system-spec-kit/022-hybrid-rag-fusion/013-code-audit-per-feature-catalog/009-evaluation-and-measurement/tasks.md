---
title: "Tasks: evaluation-and-measurement [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "evaluation"
  - "measurement"
  - "core metric computation"
  - "observer effect mitigation"
  - "shadow scoring"
importance_tier: "normal"
contextType: "general"
---
# Tasks: evaluation-and-measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Align metric-count contract across feature docs and eval-metrics references (`feature_catalog/09--evaluation-and-measurement/`, `mcp_server/lib/eval/eval-metrics.ts`) — Evidence: `eval-metrics.ts` documents "12 evaluation metrics (7 core + 5 diagnostic)"; `computeAllMetrics()` returns 12 keys; test asserts 12 keys.
- [x] T002 Add missing per-feature source/test mappings for F-03, F-04, F-05, F-12, and F-14 (`feature_catalog/09--evaluation-and-measurement/`) — Evidence: all 14 feature files include `## Source Files` with `### Implementation` and `### Tests` mappings.
- [x] T003 [P] Add explicit NEW-050..072 playbook coverage mapping (or documented gaps) for each of the 14 features (`feature_catalog/09--evaluation-and-measurement/`) — Evidence: NEW-050..072 mapping statement present in 14/14 feature files.
- [x] T004 [P] Define non-fatal logging policy for currently silent evaluation and telemetry catch blocks (`mcp_server/lib/eval/`, `mcp_server/lib/telemetry/`) — Evidence: policy resolution captured in `spec.md` open questions; non-fatal warning behavior verified in `eval-db.ts` and `consumption-logger.ts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Fix duplicate-ID precision/F1 inflation by applying dedupe semantics consistent with recall/MAP (`mcp_server/lib/eval/eval-metrics.ts`, `mcp_server/tests/eval-metrics.vitest.ts`) — Evidence: `computePrecision` uses `seenIds` dedupe; tests `T005-01..T005-03` assert duplicate-ID behavior.
- [x] T006 Implement or document-correct observer p95 enabled-vs-disabled overhead behavior and alerting path (`mcp_server/lib/eval/`, `feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md`) — Evidence: feature file explicitly documents current-reality (no automated p95 alert path) and fail-safe mitigation.
- [x] T007 Replace placeholder channel attribution assertions with real channel-attribution behavior tests (`mcp_server/tests/channel.vitest.ts`, `mcp_server/lib/eval/channel-attribution.ts`) — Evidence: `channel.vitest.ts` contains concrete attribution/ECR assertions and no placeholder tautologies.
- [x] T008 Replace silent close catch in eval DB helpers with non-fatal warning logging (`mcp_server/lib/eval/eval-db.ts`) — Evidence: `closeEvalDb` catch logs `[eval-db] closeEvalDb warning:` and continues safely.
- [x] T009 Guard bootstrap confidence interval iteration bounds and add invalid-input coverage (`mcp_server/lib/eval/bm25-baseline.ts`, `mcp_server/tests/bm25-baseline.vitest.ts`) — Evidence: `safeIterations` guard + NaN/Infinity filter in `computeBootstrapCI`; tests `T009.1..T009.10`.
- [x] T010 Add non-fatal logging for broad consumption logger catch paths (`mcp_server/lib/telemetry/consumption-logger.ts`, `mcp_server/tests/consumption-logger.vitest.ts`) — Evidence: catch paths emit `[consumption-logger] ... warning:` and return fallback values.
- [x] T011 Align scoring observability behavior/docs for failure reporting semantics (`mcp_server/lib/telemetry/scoring-observability.ts`, `feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md`) — Evidence: doc states fail-safe non-silent logging; tests validate non-throw behavior in failure paths.
- [x] T012 Fix ablation baseline query-count persistence when all channel runs fail (`mcp_server/lib/eval/ablation-framework.ts`, `mcp_server/tests/ablation-framework.vitest.ts`) — Evidence: baseline snapshot uses `report.queryCount` fallback; regression test at `storeAblationResults() persists baseline query_count...`.
- [x] T013 Fix eval run counter bootstrap to derive max run ID from both final and channel result tables (`mcp_server/lib/eval/eval-logger.ts`, `mcp_server/tests/eval-logger.vitest.ts`) — Evidence: logger computes `Math.max(channelMax, finalMax)`; tests cover both table-dominant scenarios.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 [P] Add edge-case regression tests for duplicate IDs, bootstrap CI bounds, and baseline query-count persistence (`mcp_server/tests/`) — Evidence: edge-case test groups verified in `eval-metrics.vitest.ts`, `bm25-baseline.vitest.ts`, and `ablation-framework.vitest.ts`.
- [x] T015 [P] Validate observer-overhead and channel-attribution coverage against current-reality claims (`mcp_server/tests/`, `feature_catalog/09--evaluation-and-measurement/`) — Evidence: `channel.vitest.ts`, `scoring-observability.vitest.ts`, `shadow-scoring.vitest.ts` reviewed; no `expect(true).toBe(true)` placeholders found.
- [x] T016 Verify all 14 features include auditable source/test evidence links and cross-AI remediation traceability (`feature_catalog/09--evaluation-and-measurement/`) — Evidence: 14/14 feature files include Source Files + Implementation/Tests subsections with listed references; spot-checks confirm referenced files exist.
- [x] T017 Synchronize `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` status/summary counts after verification (`009-evaluation-and-measurement/*.md`) — Evidence: synchronized in this verification pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
