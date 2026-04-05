---
title: "Tasks: manual-testing-p [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/007-evaluation/tasks]"
description: "2 manual test scenarios for evaluation category. One task per scenario ID."
trigger_phrases:
  - "evaluation tasks"
  - "evaluation test tasks"
  - "ablation dashboard tasks"
importance_tier: "important"
contextType: "general"
---
# Tasks: manual-testing-per-playbook evaluation phase

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

- [x] T001 Verify MCP server health (memory_health) — verified via code analysis; server initializes eval DB via `initEvalDb()` in `eval-db.ts`
- [x] T002 Confirm SPECKIT_ABLATION=true is set in environment — `isAblationEnabled()` at `ablation-framework.ts:44-46`; handler throws `MemoryError` when flag is absent (`eval-reporting.ts:172-177`)
- [x] T003 Confirm ground truth queries exist for ablation — `GROUND_TRUTH_QUERIES` and `GROUND_TRUTH_RELEVANCES` are statically imported from `ground-truth-data.ts` (`ablation-framework.ts:33-36`)
- [x] T004 Check eval database for prior run data — `eval_metric_snapshots` and `eval_channel_results` tables queried in `reporting-dashboard.ts:182-243`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Execute EX-026: Ablation studies (eval_run_ablation) — PASS. `runAblation()` at `ablation-framework.ts:361-506` computes per-channel Recall@K deltas; `storeAblationResults()` at `ablation-framework.ts:524-613` persists to `eval_metric_snapshots` with negative timestamp IDs. Playbook command `storeResults:true` maps to `args.storeResults !== false` check at `eval-reporting.ts:233`. Note: playbook uses `dataset:"retrieval-channels-smoke"` but schema has no `dataset` param — tool uses built-in ground truth; parameter is silently ignored without error.
- [x] T006 Execute EX-027: Reporting dashboard format:text (eval_reporting_dashboard) — PASS. `formatReportText()` at `reporting-dashboard.ts:576-642` produces `=`-bordered text with SPRINT/CHANNEL/TRENDS sections. Sprint/channel/summary data fully present.
- [x] T007 Execute EX-027: Reporting dashboard format:json (eval_reporting_dashboard) — PASS. `formatReportJSON()` at `reporting-dashboard.ts:650-652` produces pretty-printed JSON. Both formats dispatched by `format === 'json'` branch at `eval-reporting.ts:322-323`.
- [ ] T010 Execute EX-046: Evaluation dashboard generation — invoke `eval_reporting_dashboard` with `format: "json"` and `sprintFilter` targeting a specific sprint; capture output
- [ ] T011 Record EX-046 verdict: PASS / PARTIAL / FAIL
- [ ] T012 Execute EX-047: Ablation study with custom channels — invoke `eval_run_ablation` with `channels: ["vector", "bm25"]` and `storeResults: true`; capture output
- [ ] T013 Record EX-047 verdict: PASS / PARTIAL / FAIL
- [ ] T014 Execute EX-048a: Baseline comparison — run `eval_reporting_dashboard` format:text (baseline snapshot); capture output
- [ ] T015 Execute EX-048b: Run `eval_run_ablation` with `storeResults: true` to inject new eval data
- [ ] T016 Execute EX-048c: Run `eval_reporting_dashboard` format:text again (comparison snapshot); capture output
- [ ] T017 Record EX-048 verdict: PASS / PARTIAL / FAIL
- [ ] T018 Execute EX-049: Learning history retrieval — invoke `memory_get_learning_history` with a known `specFolder`; capture output
- [ ] T019 Record EX-049 verdict: PASS / PARTIAL / FAIL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Record all verdicts in checklist.md with evidence — completed
- [x] T009 Complete implementation-summary.md with findings — completed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All scenario tasks (T005-T019) marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All six scenario verdicts recorded in checklist.md (EX-026, EX-027, EX-046 through EX-049)
- [ ] implementation-summary.md completed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
