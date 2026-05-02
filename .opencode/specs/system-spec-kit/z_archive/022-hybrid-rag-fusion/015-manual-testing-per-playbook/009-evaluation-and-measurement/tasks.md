---
title: "Tasks [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/009-evaluation-and-measurement/tasks]"
description: "Task Format: T### [P?] Description (scenario ID)"
trigger_phrases:
  - "evaluation and measurement tasks"
  - "manual testing tasks"
  - "scenario execution tasks"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/009-evaluation-and-measurement"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Manual Testing — Evaluation and Measurement

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

**Task Format**: `T### [P?] Description (scenario ID)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm MCP server is running — `memory_health` call succeeds
- [x] T002 Confirm SPECKIT_ABLATION=true is set in environment
- [x] T003 Create pre-test checkpoint — `checkpoint_create({ name: "pre-009-testing" })`
- [x] T004 Verify eval_metric_snapshots table exists — confirmed in eval-db.ts:90-99 schema DDL
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Execute and record scenario 005 — Evaluation database and schema (R13-S1) — **PASS** — eval-db.ts creates 5 tables (eval_queries, eval_channel_results, eval_final_results, eval_ground_truth, eval_metric_snapshots) in separate speckit-eval.db; WAL mode enabled; fail-safe hooks in eval-logger.ts
- [x] T006 Execute and record scenario 006 — Core metric computation (R13-S1) — **PASS** — eval-metrics.ts implements 12 metrics (MRR@5, NDCG@10, Recall@20, HitRate@1, Precision@K, F1@K, MAP, InversionRate, ConstitutionalSurfacingRate, ImportanceWeightedRecall, ColdStartDetectionRate, IntentWeightedNDCG); all return values clamped to [0,1]
- [x] T007 Execute and record scenario 007 — Observer effect mitigation (D4) — **PASS** — All eval/observability paths wrapped in try-catch (eval-logger.ts:140-169, scoring-observability.ts:118-151); runShadowScoring returns null (shadow-scoring.ts:256-261); logging never blocks search
- [x] T008 Execute and record scenario 008 — Full-context ceiling evaluation (A2) — **PASS** — eval-ceiling.ts implements computeCeilingFromGroundTruth (pure) and computeCeilingWithScorer (async); 2x2 interpretCeilingVsBaseline matrix with HIGH_MRR_THRESHOLD=0.6; gap computation present
- [x] T009 Execute and record scenario 009 — Quality proxy formula (B7) — **PASS** — eval-quality-proxy.ts implements formula: avgRelevance*0.40 + topResult*0.25 + countSaturation*0.20 + latencyPenalty*0.15; weights sum to 1.0; output clamped [0,1]; interpretation tiers (excellent/good/acceptable/poor)
- [x] T010 Execute and record scenario 010 — Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) — **PASS** — 110 queries in ground-truth.json; 7 intent types (all >=5 queries); 3 complexity tiers; 40 manual queries; 11 hard negatives; 297 relevance judgments
- [x] T011 Execute and record scenario 011 — BM25-only baseline (G-NEW-1) — **PASS** — bm25-baseline.ts runs FTS5-only search; MRR@5 contingency matrix (PAUSE/RATIONALIZE/PROCEED); bootstrap CI computation; evaluateContingencyRelative for ratio-based analysis; baseline MRR@5=0.2083 documented
- [x] T012 Execute and record scenario 012 — Agent consumption instrumentation (G-NEW-2) — **PASS** — consumption-logger.ts wired with initConsumptionLog, logConsumptionEvent, getConsumptionStats, getConsumptionPatterns; isConsumptionLogEnabled() hardcoded false (inert mode); fail-safe throughout
- [x] T013 Execute and record scenario 013 — Scoring observability (T010) — **PASS** — scoring-observability.ts: SAMPLING_RATE=0.05 (5%); scoring_observations table created on init; logScoringObservation is fail-safe (try-catch, console.error only); getScoringStats aggregation available
- [x] T014 Execute and record scenario 014 — Full reporting and ablation study framework (R13-S3) — **PASS** — ablation-framework.ts: 5 channels (vector/bm25/fts5/graph/trigger); sign test with log-space binomial; 9-metric breakdown per channel; storeAblationResults writes to eval_metric_snapshots; reporting-dashboard.ts: generateDashboardReport with trend analysis; both exposed as MCP tools in lifecycle-tools.ts
- [x] T015 Execute and record scenario 015 — Shadow scoring and channel attribution (R13-S2) — **PASS** — shadow-scoring.ts: runShadowScoring returns null (retired); logShadowComparison returns false; compareShadowResults remains available as pure computation; channel-attribution.ts: attributeChannels and computeExclusiveContributionRate remain active
- [x] T016 Execute and record scenario 072 — Test quality improvements — **PASS** — memory-save-extended timeout 5000->15000ms; entity-linker db.close in afterEach; integration-search-pipeline tautological tests rewritten; memory-parser z_archive exclusion; 18+ test files updated
- [x] T017 Execute and record scenario 082 — Evaluation and housekeeping fixes — **PASS** — ablation uses config.recallK; evalRunId lazy-init from MAX(eval_run_id) in eval-logger.ts:48-67; parseArgs guard for null/undefined in types.ts:22-24; 128-bit dedup hash (.slice(0,32)) in session-manager.ts:309; cleanupExitHandlers in access-tracker.ts:293-298
- [x] T018 Execute and record scenario 088 — Cross-AI validation fixes (Tier 4) — **PASS** — SPECKIT_DASHBOARD_LIMIT in reporting-dashboard.ts:25; re-sort in stage2-fusion.ts; dedup parent_id IS NULL in vector-index-queries.ts; Number.isFinite guards in evidence-gap-detector.ts; transaction wrapping; cache-path ordering in hybrid-search.ts
- [x] T019 Execute and record scenario 090 — INT8 quantization evaluation (R5) — **PASS** — NO-GO decision documented in feature catalog: corpus 2,412 vs 10K threshold (24.1%); p95 15ms vs 50ms (30%); dimensions 1024 vs 1536 (66.7%); 7.1MB savings does not justify 5.32% recall risk. No source files needed (decision record only)
- [x] T020 Execute and record scenario 126 — Memory roadmap baseline snapshot — **PASS** — memory-state-baseline.ts: captureMemoryStateBaselineSnapshot reads from eval DB and context DB; persist=true writes metrics to eval_metric_snapshots with channel='memory-state-baseline'; missing context DB falls back to zero; eval DB initialized beside context DB under test
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Confirm all 16 P0 checklist items checked with evidence
- [x] T022 Fill in implementation-summary.md with overall results and date
- [x] T023 Restore from checkpoint if DB was modified destructively — N/A (code analysis only, no DB modification)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001–T023 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 16 scenarios have PASS, FAIL, or SKIP-ENV in checklist.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook source**: `.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/`
<!-- /ANCHOR:cross-refs -->
